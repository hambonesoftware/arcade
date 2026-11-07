'use strict';
/* First Light game entrypoint. All simulation belongs to engine.js. */
(() => {
  const E=window.ColonyEngine,R=window.ColonyRender;
  const SAVE='colony-firstlight-v2';
  const $=id=>document.getElementById(id);
  const canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false}),stage=$('stage');
  const by=(selector)=>Array.from(document.querySelectorAll(selector));
  const modeButtons=by('[data-mode]'),groupButtons=by('[data-group]'),viewButtons=by('[data-view]');
  const cameras={surface:{x:0,y:0,zoom:1},nest:{x:0,y:0,zoom:1}};
  let state=null,rafLast=0,accumulator=0,clock=0,autosave=0,uiDelay=0,lastStep=-1,firstResize=true,screen={w:400,h:570,dpr:1};
  let touches=new Map(),pinch=null,selectionBox=null;
  function save(){
    if(!state||state.firstLaunch)return;
    try{localStorage.setItem(SAVE,JSON.stringify({...state,paused:false,firstLaunch:false}));}catch(e){}
  }
  function load(){
    try{return E.normalize(JSON.parse(localStorage.getItem(SAVE)||'null'));}catch(e){return null;}
  }
  function start(){
    if(!state)return;
    state.firstLaunch=false;state.paused=false;
    $('intro').hidden=true;save();updateUI();
  }
  function fresh(){
    state=E.create();state.paused=true;lastStep=0;
    cameras.surface={x:0,y:0,zoom:1};cameras.nest={x:0,y:0,zoom:1};
    $('endDialog').hidden=true;$('helpDialog').hidden=true;$('intro').hidden=false;
    firstResize=true;resize();updateUI();
    try{localStorage.removeItem(SAVE);}catch(e){}
  }
  function resize(){
    const bounds=stage.getBoundingClientRect();
    screen.w=Math.max(120,bounds.width);screen.h=Math.max(220,bounds.height);
    screen.dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.round(screen.w*screen.dpr);
    canvas.height=Math.round(screen.h*screen.dpr);
    if(firstResize){firstResize=false;focus({x:275,y:330},'surface');}
    else{R.limit(cameras.surface,'surface',screen.w,screen.h);R.limit(cameras.nest,'nest',screen.w,screen.h);}
  }
  function focus(p,view=state.view){
    const world=view==='nest'?{w:E.constants.C*E.constants.CELL,h:E.constants.R*E.constants.CELL}:{w:E.constants.SW,h:E.constants.SH};
    const camera=cameras[view];
    const scale=Math.max(screen.w/world.w,screen.h/world.h)*camera.zoom;
    const center={x:world.w/2,y:world.h/2};
    camera.x=(center.x-p.x)*scale;camera.y=(center.y-p.y)*scale;
    R.limit(camera,view,screen.w,screen.h);
  }
  function setView(v){state.view=v;updateUI();}
  function focusObjective(){
    const m=state.mission;
    if(m.step===1){setView('nest');focus(E.constants.NURSERY,'nest');return;}
    setView('surface');
    const where=m.step===2?E.constants.BORDER:m.step===3?E.constants.PORTAL:m.step>=4?E.constants.OUTPOST:{x:300,y:330};
    focus(where,'surface');
  }
  function toast(msg){
    $('eventText').textContent=msg;
    const el=$('eventToast');el.hidden=false;
    el.classList.add('pop');
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>{el.hidden=true;el.classList.remove('pop');},4400);
  }
  function groupLabel(){
    const selected=E.selected(state),roles=new Set(selected.map(a=>a.role));
    return selected.length===0?'Nothing selected':roles.size===1?(selected[0].role+'s selected'):'Mixed squad selected';
  }
  function uiObjective(){
    const o=E.objective(state),m=state.mission;
    $('objectiveCount').textContent=m.complete?'COMPLETE':'STEP '+(m.step+1)+' / 5';
    $('objectiveTitle').textContent=o.title;
    $('objectiveDetail').textContent=o.hint;
    $('objectiveCounter').textContent=o.counter;
    $('objectiveProgress').style.width=Math.round(o.progress*100)+'%';
    $('objectiveFocus').textContent=o.action;
  }
  function updateUI(){
    if(!state)return;
    uiObjective();
    const black=state.ants.filter(a=>a.side==='black'&&a.hp>0);
    const workers=black.filter(a=>a.role==='worker').length;
    const soldiers=black.filter(a=>a.role==='soldier').length;
    const brood=state.eggs.filter(e=>e.side==='black').length;
    $('food').textContent=Math.floor(state.food);
    $('workers').textContent=workers;
    $('soldiers').textContent=soldiers;
    $('brood').textContent=brood;
    $('queenHealth').textContent=Math.ceil(state.queenHP)+'%';
    $('elapsed').textContent=Math.floor(state.elapsed/60)+':'+String(Math.floor(state.elapsed%60)).padStart(2,'0');
    $('viewHeading').textContent=state.view==='surface'?'SURFACE · FIRST LIGHT':'UNDERGROUND · YOUR NEST';
    $('viewHint').textContent=state.view==='surface'?'Tap an ant to select · tap the ground to command':'Tap soil to excavate · drag to explore';
    $('selectedCount').textContent=E.selected(state).length+' SELECTED';
    $('selectedSummary').textContent=groupLabel();
    $('selectedStatus').textContent=state.mode.toUpperCase()+' ORDER';
    $('logMessage').textContent=state.lastLog||state.logs.at(-1)||'A new queen has founded the colony.';
    viewButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===state.view)));
    groupButtons.forEach(b=>{
      const role=b.dataset.group,all=black.filter(a=>role==='all'||a.role===role);
      b.setAttribute('aria-pressed',String(all.length>0&&all.length===E.selected(state).length&&all.every(a=>state.selected.includes(a.id))));
    });
    modeButtons.forEach(b=>{
      b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode));
      if(b.dataset.mode==='dig')b.hidden=state.mission.step!==1||state.view!=='nest';
    });
    $('nestTools').hidden=state.mission.step!==1;
    $('planDig').disabled=state.nest.digQueue.length>=12||state.mission.cells.filter(v=>v>=1).length>=6;
    $('buildNursery').disabled=state.nest.nursery||state.mission.cells.filter(v=>v>=1).length<6||state.food<45;
    $('trainSoldier').disabled=!E.canTrain(state,'soldier');
    $('trainWorker').disabled=!E.canTrain(state,'worker');
    $('buildProgress').textContent=state.mission.cells.filter(v=>v>=1).length+' / 6 CELLS DUG';
    $('nestBuildLabel').textContent=state.nest.nursery?'Nursery built':'Build nursery · 45 food';
    $('pause').textContent=state.paused?'▶ Resume':'Ⅱ Pause';
    $('pause').setAttribute('aria-pressed',String(state.paused));
    $('speed').textContent=state.speed+'×';
    stage.dataset.view=state.view;
    const q=state.nest.digQueue.length;
    $('queueCount').textContent=q+' marked';
    $('statusHint').textContent=state.mission.step===3?'RED RAID! Protect the queen':state.mission.step===4?'Destroy the red outpost and hold':state.mission.step===1?'Excavate six cells then build the nursery':'The colony is alive';
    if(state.ended&&!$('endDialog').hidden)return;
    if(state.ended)showEnd();
  }
  function showEnd(){
    const victory=state.ended==='victory';
    $('endTitle').textContent=victory?'First Light secured!':'The queen has fallen';
    $('endEyebrow').textContent=victory?'TERRITORY WON':'COLONY LOST';
    $('endText').textContent=victory
      ?'Your ants survived their first battle and claimed the red outpost. The colony is ready to spread.'
      :'Your colony was overwhelmed. Try a stronger defense at the entrance and keep your soldiers together.';
    $('endStatistics').textContent=Math.floor(state.mission.delivered)+' food delivered · '+
      state.mission.cells.filter(v=>v>=1).length+' cells excavated · '+
      Math.floor(state.elapsed/60)+'m '+Math.floor(state.elapsed%60)+'s';
    $('endDialog').hidden=false;save();
  }
  function selectBoxUnits(rect,append=false){
    const chosen=state.ants.filter(a=>{
      if(a.hp<=0||a.side!=='black'||a.layer!==state.view)return false;
      const t=R.fit(state.view,screen.w,screen.h,cameras[state.view]);
      const x=a.x*t.scale+t.offsetX,y=a.y*t.scale+t.offsetY;
      return x>=Math.min(rect.x,rect.x2)&&x<=Math.max(rect.x,rect.x2)
        &&y>=Math.min(rect.y,rect.y2)&&y<=Math.max(rect.y,rect.y2);
    }).map(a=>a.id);
    state.selected=append?Array.from(new Set([...state.selected,...chosen])):chosen;
    updateUI();
  }
  function tap(p,button=0,append=false){
    if(state.paused||state.ended)return;
    const world=R.locate(p.x,p.y,state.view,screen.w,screen.h,cameras[state.view]);
    if(button===0&&E.selectOne(state,state.view,world,append)){updateUI();return;}
    if(state.view==='nest'){
      if(state.mission.step!==1){toast('The nest is safe. Focus on your current objective.');return;}
      const cell=E.cellAt(world);
      if(E.queueDig(state,cell.c,cell.r))toast('Workers marked a new soil cell.');
      else toast('Choose unexcavated soil next to the tunnel network.');
    }else E.issue(state,world);
    updateUI();
  }
  function pointerPosition(e){const rect=canvas.getBoundingClientRect();return{x:e.clientX-rect.left,y:e.clientY-rect.top};}
  canvas.addEventListener('pointerdown',e=>{
    if(e.button===2)e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    const p=pointerPosition(e);
    touches.set(e.pointerId,{...p,startX:p.x,startY:p.y,lastX:p.x,lastY:p.y,moved:false,button:e.button,mouse:e.pointerType==='mouse',shift:!!e.shiftKey});
    if(touches.size>1)pinch=null;
  });
  canvas.addEventListener('pointermove',e=>{
    const t=touches.get(e.pointerId);if(!t)return;
    const p=pointerPosition(e);
    t.x=p.x;t.y=p.y;
    if(touches.size===2){
      const [a,b]=[...touches.values()],mid={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5};
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(pinch){R.pan(cameras[state.view],mid.x-pinch.mid.x,mid.y-pinch.mid.y,state.view,screen.w,screen.h);
        R.zoom(cameras[state.view],d/Math.max(5,pinch.d),mid,state.view,screen.w,screen.h);}
      pinch={mid,d};a.moved=true;b.moved=true;
    }else{
      if(Math.hypot(t.x-t.startX,t.y-t.startY)>9)t.moved=true;
      if(t.moved&&t.mouse&&t.shift&&t.button===0){
        selectionBox={x:t.startX,y:t.startY,x2:t.x,y2:t.y};
      }else if(t.moved){
        R.pan(cameras[state.view],t.x-t.lastX,t.y-t.lastY,state.view,screen.w,screen.h);
      }
    }
    t.lastX=t.x;t.lastY=t.y;
  });
  function release(e){
    const t=touches.get(e.pointerId);if(!t)return;
    touches.delete(e.pointerId);
    if(touches.size===0){
      if(selectionBox)selectBoxUnits(selectionBox,t.shift);
      else if(!t.moved&&!pinch&&Math.hypot(t.x-t.startX,t.y-t.startY)<14)tap(t,t.button,t.shift);
      pinch=null;selectionBox=null;
    }
  }
  canvas.addEventListener('pointerup',release);
  canvas.addEventListener('pointercancel',e=>{touches.delete(e.pointerId);selectionBox=null;pinch=null;});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  canvas.addEventListener('wheel',e=>{e.preventDefault();R.zoom(cameras[state.view],e.deltaY<0?1.13:.89,pointerPosition(e),state.view,screen.w,screen.h);},{passive:false});
  by('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  by('[data-group]').forEach(b=>b.addEventListener('click',()=>{E.selectGroup(state,b.dataset.group);updateUI();}));
  by('[data-mode]').forEach(b=>b.addEventListener('click',()=>{E.setMode(state,b.dataset.mode);updateUI();}));
  by('[data-train]').forEach(b=>b.addEventListener('click',()=>{
    if(E.train(state,b.dataset.train))toast('Egg laid. Watch your nursery for a new '+b.dataset.train+'.');
    else toast(state.lastLog);
    updateUI();
  }));
  $('buildNursery').addEventListener('click',()=>{
    if(E.buildNursery(state))toast('New nursery constructed!');
    else toast(state.lastLog);updateUI();
  });
  $('planDig').addEventListener('click',()=>{
    if(E.planNest(state))toast('Six nursery passage cells marked for excavation.');
    else toast('The passage is already planned.');updateUI();
  });
  $('objectiveFocus').addEventListener('click',focusObjective);
  $('pause').addEventListener('click',()=>{state.paused=!state.paused;updateUI();});
  $('speed').addEventListener('click',()=>{state.speed=state.speed===1?2:state.speed===2?.5:1;updateUI();});
  $('zoomIn').addEventListener('click',()=>R.zoom(cameras[state.view],1.28,{x:screen.w/2,y:screen.h/2},state.view,screen.w,screen.h));
  $('zoomOut').addEventListener('click',()=>R.zoom(cameras[state.view],1/1.28,{x:screen.w/2,y:screen.h/2},state.view,screen.w,screen.h));
  $('center').addEventListener('click',focusObjective);
  $('startGame').addEventListener('click',start);
  $('help').addEventListener('click',()=>{$('helpDialog').hidden=false;state.paused=true;updateUI();});
  $('closeHelp').addEventListener('click',()=>{$('helpDialog').hidden=true;state.paused=false;updateUI();});
  $('retry').addEventListener('click',fresh);
  $('newGame').addEventListener('click',()=>{if(confirm('Restart First Light? Current progress will be replaced.'))fresh();});
  window.addEventListener('keydown',e=>{
    if(!$('intro').hidden||!$('helpDialog').hidden||!$('endDialog').hidden)return;
    if(e.key==='1')E.selectGroup(state,'worker');
    if(e.key==='2')E.selectGroup(state,'soldier');
    if(e.key==='3')E.selectGroup(state,'all');
    if(e.key==='Escape')state.selected=[];
    if(e.code==='Space'){e.preventDefault();state.paused=!state.paused;}
    if(e.key.toLowerCase()==='n')setView(state.view==='nest'?'surface':'nest');
    updateUI();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
  window.addEventListener('pagehide',save);
  window.addEventListener('resize',resize);
  function frame(now){
    const dt=Math.min(.1,Math.max(0,(now-(rafLast||now-16))/1000));
    rafLast=now;clock+=dt;
    if(!state.paused&&!state.ended){
      accumulator+=dt;let cycles=0;
      while(accumulator>=1/30&&cycles<5){const before=state.mission.step;
        E.update(state,1/30);
        accumulator-=1/30;cycles++;
        if(state.mission.step!==before){
          toast(state.lastLog);save();if(state.mission.step===1)focus(E.constants.NURSERY,'nest');
          else if(state.mission.step===2)focus(E.constants.BORDER,'surface');
          else if(state.mission.step===3)focus(E.constants.PORTAL,'surface');
          else if(state.mission.step===4)focus(E.constants.OUTPOST,'surface');
        }
        if(state.ended)break;
      }
    }else accumulator=0;
    ctx.setTransform(screen.dpr,0,0,screen.dpr,0,0);
    ctx.clearRect(0,0,screen.w,screen.h);
    R.draw(ctx,state,screen.w,screen.h,cameras,clock);
    if(selectionBox){
      ctx.strokeStyle='#f8eba2';ctx.fillStyle='#f8eba229';ctx.lineWidth=1.5;
      const r=selectionBox,x=Math.min(r.x,r.x2),y=Math.min(r.y,r.y2),w=Math.abs(r.x2-r.x),h=Math.abs(r.y2-r.y);
      ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);
    }
    uiDelay+=dt;autosave+=dt;
    if(uiDelay>.16){uiDelay=0;updateUI();}
    if(autosave>8){autosave=0;save();}
    requestAnimationFrame(frame);
  }
  const loaded=load();
  if(loaded){state=loaded;state.firstLaunch=false;$('intro').hidden=true;lastStep=state.mission.step;}
  else{state=E.create();state.paused=true;$('intro').hidden=false;}
  resize();updateUI();requestAnimationFrame(frame);
})();