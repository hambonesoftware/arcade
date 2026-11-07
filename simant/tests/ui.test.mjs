import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const scripts=['firstlight.js','engine.js','renderer.js','game.js'].map(filename=>readFileSync(new URL('../'+filename,import.meta.url),'utf8'));

function setup(initialStorage={}){
  const elements=new Map(),windowEvents=new Map();
  const noop=()=>{};
  const gradient=()=>({addColorStop:noop});
  const context=new Proxy({
    createLinearGradient:gradient,
    createRadialGradient:gradient,
    measureText:text=>({width:String(text).length*7})
  },{
    get(target,prop){return prop in target?target[prop]:noop;},
    set(target,prop,value){target[prop]=value;return true;}
  });
  function element(id){
    if(elements.has(id))return elements.get(id);
    const listeners=new Map(),attributes=new Map();
    const node={
      id,hidden:['helpDialog','endDialog','eventToast','nestTools'].includes(id),
      disabled:false,style:{},dataset:{},textContent:'',
      classList:{add:noop,remove:noop,toggle:noop},
      setAttribute(name,value){attributes.set(name,value);},
      getAttribute(name){return attributes.get(name);},
      addEventListener(name,listener){listeners.set(name,listener);},
      trigger(name,event={}){assert.ok(listeners.has(name),'missing '+name+' listener for '+id);listeners.get(name)(event);},
      getBoundingClientRect(){return{width:390,height:540,left:0,top:0};},
      getContext(){return context;},
      setPointerCapture:noop
    };
    elements.set(id,node);
    return node;
  }
  const data={
    '[data-mode]':['move','forage','attack','defend','dig'],
    '[data-group]':['scout','worker','soldier','all'],
    '[data-view]':['surface','nest'],
    '[data-train]':['worker','soldier']
  };
  const document={
    getElementById:element,
    querySelectorAll(selector){
      assert.ok(data[selector],selector);
      const name=selector.slice(6,-1);
      return data[selector].map(value=>{
        const node=element(name+value);node.dataset[name]=value;return node;
      });
    },
    createElement(){return{getContext(){return context;},width:900,height:700};},
    addEventListener:noop,
    hidden:false
  };
  const window={
    devicePixelRatio:2,
    addEventListener(name,fn){windowEvents.set(name,fn);}
  };
  const storage={
    getItem(key){return Object.hasOwn(initialStorage,key)?initialStorage[key]:null;},
    setItem(key,value){initialStorage[key]=value;},
    removeItem(key){delete initialStorage[key];}
  };
  let renderCallback=null;
  const sandbox={
    window,document,localStorage:storage,
    requestAnimationFrame(fn){renderCallback=fn;},
    setTimeout(fn){return 1;},
    clearTimeout:noop,
    confirm:()=>true
  };
  for(const source of scripts)runInNewContext(source,sandbox,{timeout:10000});
  function frame(timestamp=16){
    assert.ok(renderCallback);
    renderCallback(timestamp);
  }
  function pagehide(){assert.ok(windowEvents.has('pagehide'));windowEvents.get('pagehide')();}
  return{el:element,frame,pagehide,storage:initialStorage};
}

test('new First Light opens in the tutorial with a fresh small colony',()=>{
  const app=setup();
  assert.equal(app.el('intro').hidden,false);
  assert.equal(app.el('objectiveTitle').textContent,'Feed the first brood');
  assert.equal(app.el('workers').textContent,4);
  assert.equal(app.el('soldiers').textContent,0);
  assert.equal(app.el('food').textContent,25);
  app.el('startGame').trigger('click');
  app.frame();
  assert.equal(app.el('intro').hidden,true);
  assert.ok(app.storage['colony-firstlight-v2']);
});

test('Guide preserves pause status before and after starting the mission',()=>{
  const app=setup();
  app.el('help').trigger('click');
  app.el('closeHelp').trigger('click');
  assert.equal(app.el('pause').textContent,'▶ Resume','tutorial still paused');
  app.el('startGame').trigger('click');
  app.el('help').trigger('click');
  app.el('closeHelp').trigger('click');
  assert.equal(app.el('pause').textContent,'Ⅱ Pause','playing continues');
  app.el('pause').trigger('click');
  app.el('help').trigger('click');
  app.el('closeHelp').trigger('click');
  assert.equal(app.el('pause').textContent,'▶ Resume','manual pause preserved');
});

test('squad selection, nest view and panning render without breaking saved game',()=>{
  const app=setup();
  app.el('startGame').trigger('click');
  app.el('groupworker').trigger('click');
  assert.equal(app.el('selectedCount').textContent,'4 SELECTED');
  app.el('viewnest').trigger('click');
  app.frame();
  assert.equal(app.el('viewHeading').textContent,'UNDERGROUND · YOUR NEST');
  app.el('zoomIn').trigger('click');
  app.el('center').trigger('click');
  app.pagehide();
  const saved=JSON.parse(app.storage['colony-firstlight-v2']);
  assert.equal(saved.schema,2);
  assert.equal(saved.ants.filter(a=>a.role==='worker').length,4);
  assert.equal(saved.selected.length,4);
});

test('old sandbox saves are ignored rather than corrupting First Light',()=>{
  const app=setup({'hambone-colony-v1':JSON.stringify({tile:4,claimed:[4],queen:100,food:150})});
  assert.equal(app.el('intro').hidden,false);
  assert.equal(app.el('objectiveTitle').textContent,'Feed the first brood');
  app.el('startGame').trigger('click');
  app.pagehide();
  assert.ok(app.storage['colony-firstlight-v2']);
});
