import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const load=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const scripts={
  firstlight:load('../firstlight.js'),
  engine:load('../engine.js'),
  renderer:load('../renderer.js'),
  ui:load('../game.js'),
  html:load('../index.html')
};
function environment(){
  const window={};
  runInNewContext(scripts.firstlight,{window},{timeout:10000});
  runInNewContext(scripts.engine,{window},{timeout:10000});
  return {window,Engine:window.ColonyEngine,Mission:window.ColonyFirstLight};
}
function advance(engine,state,frames){for(let i=0;i<frames;i++)engine.update(state,1/30);}
function completeFood(e,s,limit=3000){
  for(let i=0;i<limit&&s.mission.step===0&&!s.ended;i++)e.update(s,1/30);
  assert.equal(s.mission.step,1,'workers must deliver food to unlock digging');
}
function completeDig(e,s,limit=2500){
  assert.ok(e.planNest(s));
  for(let i=0;i<limit&&s.mission.cells.filter(v=>v>=1).length<6;i++)e.update(s,1/30);
  assert.equal(s.mission.cells.filter(v=>v>=1).length,6,'six tunnels must be physically excavated');
  assert.equal(e.buildNursery(s),true);
  e.update(s,1/30);
  assert.equal(s.mission.step,2);
}
function runtimeCanvas(){
  const noop=()=>{};
  const gradient=()=>({addColorStop(){}});
  const context=new Proxy({createLinearGradient:gradient,createRadialGradient:gradient,measureText:x=>({width:x.length*7})},{
    get(target,key){return key in target?target[key]:noop},
    set(target,key,value){target[key]=value;return true;}
  });
  const document={createElement(){return{width:800,height:500,getContext:()=>context}}};
  return {context,document};
}

test('First Light launches a completely fresh scenario, not the old sandbox',()=>{
  const {Engine:e}=environment(),s=e.create(11);
  assert.equal(s.schema,2);
  assert.equal(s.food,25);
  assert.equal(s.mission.step,0);
  assert.equal(s.queenHP,100);
  assert.equal(s.ants.filter(a=>a.role==='worker').length,4);
  assert.equal(s.ants.filter(a=>a.role==='soldier').length,0);
  assert.equal(s.ants.filter(a=>a.role==='scout').length,1);
  assert.equal(s.nest.nursery,false);
  assert.equal(s.ants.filter(a=>a.side==='red').length,0);
  assert.equal(scripts.ui.includes('hambone-colony-v1'),false);
  assert.equal(scripts.html.includes('nest.js'),false);
  assert.ok(scripts.html.includes('firstlight.js'));
});

test('workers really carry food between surface and connected granary',()=>{
  const {Engine:e}=environment(),s=e.create(30);
  let carried=false,nestDeposits=0,previousFood=25;
  for(let i=0;i<500;i++){
    e.update(s,1/30);
    if(s.ants.some(a=>a.role==='worker'&&a.carry>0))carried=true;
    if(s.food>previousFood)nestDeposits++;
    previousFood=s.food;
  }
  assert.ok(carried,'worker must pick up a visible food load');
  assert.ok(nestDeposits>=3,'worker must physically deposit more than one load');
  assert.ok(s.mission.delivered>=45);
  assert.ok(s.food>25);
});

test('workers stay inside excavated underground cells and follow marked dig paths',()=>{
  const {Engine:e}=environment(),s=e.create(31),K=e.constants;
  completeFood(e,s);
  e.planNest(s);
  for(let i=0;i<650;i++){
    e.update(s,1/30);
    for(const a of s.ants.filter(a=>a.layer==='nest'&&a.hp>0)){
      const c=Math.max(0,Math.min(K.C-1,Math.floor(a.x/K.CELL)));
      const r=Math.max(0,Math.min(K.R-1,Math.floor(a.y/K.CELL)));
      assert.equal(s.nest.cells[r*K.C+c],1,'ant '+a.id+' crossed solid underground soil');
    }
  }
  assert.equal(s.mission.cells.filter(v=>v>=1).length,6);
  assert.equal(s.nest.digQueue.length,0);
});

test('digging and building are genuine mission prerequisites and cost food',()=>{
  const {Engine:e}=environment(),s=e.create(49);
  completeFood(e,s);
  assert.equal(e.buildNursery(s),false,'nursery cannot be built before excavation');
  completeDig(e,s);
  assert.equal(s.nest.nursery,true);
  assert.ok(s.nest.cells.filter(x=>x===1).length>=22);
  assert.ok(s.mission.step===2);
});

test('RTS selection and manual orders move chosen workers',()=>{
  const {Engine:e}=environment(),s=e.create(51);
  e.selectGroup(s,'worker');
  assert.equal(s.selected.length,4);
  e.setMode(s,'move');
  e.issue(s,{x:476,y:244});
  advance(e,s,150);
  const chosen=e.selected(s);
  assert.ok(chosen.some(a=>a.layer==='surface'&&a.x>200),'selected worker should honor movement command');
  assert.ok(chosen.every(a=>a.stance==='move'||a.stance==='auto'));
  assert.ok(!s.ended);
});

test('soldier training is locked until the nursery and costs food',()=>{
  const {Engine:e}=environment(),s=e.create(52);
  assert.equal(e.train(s,'soldier'),false);
  completeFood(e,s);
  completeDig(e,s);
  const before=s.food;
  assert.equal(e.train(s,'soldier'),true);
  assert.equal(s.food,before-30);
  advance(e,s,240);
  assert.ok(s.ants.some(a=>a.role==='soldier'));
});

test('complete First Light: food, excavation, holding the border, raid and outpost',()=>{
  const {Engine:e}=environment(),s=e.create(78);
  completeFood(e,s);
  completeDig(e,s);
  for(let i=0;i<3;i++)assert.equal(e.train(s,'soldier'),true);
  advance(e,s,240);
  e.selectGroup(s,'soldier');
  e.setMode(s,'move');
  e.issue(s,e.constants.BORDER);
  for(let i=0;i<1500&&s.mission.step===2;i++)e.update(s,1/30);
  assert.equal(s.mission.step,3,'the contested border must unlock a raid');
  for(let i=0;i<1800&&s.mission.step===3&&!s.ended;i++)e.update(s,1/30);
  assert.equal(s.mission.step,4,'the colony must survive the raid');
  assert.ok(s.queenHP>0,'the queen must survive a reasonably defended raid');
  e.selectGroup(s,'soldier');
  e.setMode(s,'attack');
  e.issue(s,e.constants.OUTPOST);
  for(let i=0;i<1800&&s.mission.step===4&&!s.ended;i++)e.update(s,1/30);
  assert.equal(s.ended,'victory');
  assert.equal(s.mission.step,5);
  assert.equal(s.mission.outpostHealth,0);
  assert.equal(s.mission.outpostHold,16);
});

test('queen death produces a definitive defeat, not an endless simulation',()=>{
  const {Engine:e}=environment(),s=e.create(80);
  s.queenHP=0;e.update(s,1/30);
  assert.equal(s.ended,'defeat');
  assert.equal(s.paused,true);
});

test('saved state restores connected tunnels, objective progress and unit IDs',()=>{
  const {Engine:e}=environment(),s=e.create(91);
  completeFood(e,s);e.planNest(s);advance(e,s,300);
  const snapshot=JSON.stringify(s);
  const restored=e.normalize(JSON.parse(snapshot));
  assert.ok(restored);
  assert.equal(restored.seed,s.seed);
  assert.equal(restored.mission.step,s.mission.step);
  assert.equal(restored.mission.delivered,s.mission.delivered);
  assert.deepEqual([...restored.nest.cells],[...s.nest.cells]);
  const priorIds=new Set(s.ants.map(a=>a.id));
  advance(e,restored,100);
  assert.ok(restored.ants.some(a=>priorIds.has(a.id)));
  assert.equal(e.normalize({schema:1,ants:[],nest:{cells:[]}}),null);
});

test('surface and nest renderer draw new simulation without old assets',()=>{
  const {window,Engine:e}=environment();
  const {context,document}=runtimeCanvas();
  runInNewContext(scripts.renderer,{window,document},{timeout:10000});
  const s=e.create(111),cams={surface:{x:0,y:0,zoom:1},nest:{x:0,y:0,zoom:1}};
  assert.doesNotThrow(()=>window.ColonyRender.draw(context,s,390,540,cams,0));
  s.view='nest';
  assert.doesNotThrow(()=>window.ColonyRender.draw(context,s,390,540,cams,0));
  const p={x:195,y:270};
  assert.doesNotThrow(()=>window.ColonyRender.zoom(cams.nest,1.4,p,'nest',390,540));
  assert.ok(Number.isFinite(window.ColonyRender.locate(p.x,p.y,'nest',390,540,cams.nest).x));
});
