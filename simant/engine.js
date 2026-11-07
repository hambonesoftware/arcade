'use strict';
/* COLONY — First Light. Fresh RTS simulation; no legacy sandbox or nine-patch logic. */
(() => {
  const Mission=window.ColonyFirstLight;
  const SW=1000,SH=660,C=21,R=13,CELL=36,PORTAL={x:178,y:330},OUTPOST=Mission.OUTPOST,BORDER=Mission.BORDER;
  const NEST_ENT={x:(10.5)*CELL,y:(.5)*CELL},QUEEN={x:10.5*CELL,y:3.5*CELL},STORE={x:7.5*CELL,y:4.5*CELL},NURSERY={x:14.5*CELL,y:5.5*CELL};
  const firstOpen=[[10,0],[10,1],[10,2],[10,3],[9,3],[11,3],[10,4],[9,4],[8,4],[7,4],[6,4],[7,5],[8,5],[9,5],[11,4],[12,4]];
  const recommended=[[13,4],[14,4],[14,5],[13,5],[12,5],[13,6]];
  const foodSeed=[{x:324,y:330,amount:140,max:140},{x:510,y:350,amount:190,max:190},{x:415,y:177,amount:85,max:85},{x:720,y:535,amount:130,max:130}];
  const max=(a,b)=>Math.max(a,b),min=(a,b)=>Math.min(a,b),clamp=(v,a,b)=>min(b,max(a,v));
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),cellPos=(c,r)=>({x:(c+.5)*CELL,y:(r+.5)*CELL});
  const index=(c,r)=>r*C+c,inside=(c,r)=>c>=1&&r>=0&&c<C-1&&r<R-1;
  const neighbors=(c,r)=>[[c-1,r],[c+1,r],[c,r-1],[c,r+1]].filter(([x,y])=>inside(x,y));
  let sequential=0;
  function ant(role='worker',layer='nest',x=QUEEN.x,y=QUEEN.y,side='black') {
    const maxHP=role==='soldier'?90:role==='scout'?65:role==='raider'?68:45;
    return {id:++sequential,side,role,layer,x,y,hp:maxHP,maxHP,carry:0,target:null,stance:'auto',swing:0,angle:0,task:'',moveOrder:null,attackCooldown:0,glow:0};
  }
  function create(seed=Math.floor(Math.random()*0x7fffffff)){
    sequential=0;
    const cells=Array(C*R).fill(0);
    for(const [c,r] of firstOpen)cells[index(c,r)]=1;
    const state={schema:2,seed,elapsed:0,paused:false,speed:1,view:'surface',mode:'move',food:25,queenHP:100,
      mission:Mission.fresh(),nest:{cells,digQueue:[],nursery:false},ants:[],eggs:[],foodNodes:foodSeed.map((f,i)=>({...f,id:i+1})),
      selected:[],nextId:1,logs:[],ended:null,alert:0,buildPrompt:false,firstLaunch:true};
    for(let i=0;i<4;i++)state.ants.push(ant('worker','nest',QUEEN.x+(i%2)*17-10,QUEEN.y+14+i*5));
    const scout=ant('scout','surface',PORTAL.x+20,PORTAL.y,'black');
    state.ants.push(scout);state.selected=[scout.id];state.nextId=sequential+1;
    writeLog(state,'First Light: forage nearby seeds to feed your queen.');
    return state;
  }
  function normalize(raw){
    if(!raw||raw.schema!==2||!raw.mission||!Array.isArray(raw.ants)||!Array.isArray(raw.nest?.cells))return null;
    if(raw.nest.cells.length!==C*R)return null;
    const s={...raw,mission:Mission.normalize(raw.mission)};
    s.ended=s.ended||null;s.paused=false;s.speed=1;s.logs=Array.isArray(s.logs)?s.logs.slice(-8):[];
    s.selected=Array.isArray(s.selected)?s.selected.filter(id=>s.ants.some(a=>a.id===id&&a.side==='black'&&a.hp>0)):[];
    s.nest.digQueue=Array.isArray(s.nest.digQueue)?s.nest.digQueue.filter(q=>inside(q.c,q.r)&&!s.nest.cells[index(q.c,q.r)]).slice(0,30):[];
    s.foodNodes=Array.isArray(s.foodNodes)?s.foodNodes.filter(f=>Number.isFinite(f.amount)):[];
    s.nextId=max(1,...s.ants.map(a=>a.id||0))+1;
    sequential=s.nextId-1;
    return s;
  }
  function writeLog(s,msg){s.logs.push(msg);if(s.logs.length>8)s.logs.shift();s.lastLog=msg;}
  function selected(s){return s.ants.filter(a=>a.side==='black'&&a.hp>0&&s.selected.includes(a.id));}
  function selectGroup(s,role){s.selected=s.ants.filter(a=>a.side==='black'&&a.hp>0&&(role==='all'||a.role===role)).map(a=>a.id);writeLog(s,s.selected.length+' ants selected. Tap a destination or choose a command.');}
  function selectOne(s,layer,p,append=false){let nearest=null,best=26;for(const a of s.ants){if(a.layer!==layer||a.side!=='black'||a.hp<=0)continue;const d=dist(a,p);if(d<best){best=d;nearest=a;}}if(!nearest)return false;if(!append)s.selected=[];if(!s.selected.includes(nearest.id))s.selected.push(nearest.id);else if(append)s.selected=s.selected.filter(id=>id!==nearest.id);return true;}
  function setMode(s,mode){if(['move','forage','defend','attack','dig'].includes(mode))s.mode=mode;}
  function issue(s,p){
    if(s.ended)return;
    const chosen=selected(s);
    if(s.mode==='dig')return;
    if(!chosen.length){writeLog(s,'Select workers or soldiers first.');return;}
    let mode=s.mode;
    const f=s.foodNodes.find(n=>n.amount>0&&dist(n,p)<34);
    if(mode==='move'&&f&&chosen.some(a=>a.role==='worker'))mode='forage';
    if(mode==='move'&&dist(p,OUTPOST)<OUTPOST.r+40)mode='attack';
    let count=0;
    for(const a of chosen){
      if(mode==='forage'&&a.role!=='worker'&&a.role!=='scout')continue;
      if(mode==='attack'&&a.role==='worker')continue;
      a.stance=mode;a.moveOrder={x:clamp(p.x,20,SW-20),y:clamp(p.y,20,SH-20)};
      if(mode==='forage'&&f)a.foodNodeId=f.id;
      if(mode==='defend')a.task='defend';
      count++;
    }
    writeLog(s,count+' ants ordered: '+mode.toUpperCase()+'.');
  }
  function nearestFood(s,a){
    const forced=s.foodNodes.find(f=>f.id===a.foodNodeId&&f.amount>0);
    if(forced)return forced;
    let best=null,score=Infinity;
    for(const f of s.foodNodes){if(f.amount<1)continue;let d=dist(f,a);if(d<score){score=d;best=f;}}
    return best;
  }
  
  // All underground movement follows the player's excavated tunnel graph.
  // Surface and nest use one ant object; entering the mound is a real transfer.
  function travelNest(s,a,p,dt,speed=65){
    const from={c:clamp(Math.floor(a.x/CELL),0,C-1),r:clamp(Math.floor(a.y/CELL),0,R-1)};
    const to={c:clamp(Math.floor(p.x/CELL),0,C-1),r:clamp(Math.floor(p.y/CELL),0,R-1)};
    const source=index(from.c,from.r),dest=index(to.c,to.r);
    if(source===dest)return travel(a,p,dt,speed);
    const prev=new Int32Array(C*R).fill(-1),front=[source];prev[source]=source;
    for(let head=0;head<front.length;head++){
      const n=front[head];if(n===dest)break;
      const c=n%C,r=Math.floor(n/C);
      for(const [nx,ny] of neighbors(c,r)){
        const next=index(nx,ny);
        if(prev[next]!==-1||!s.nest.cells[next])continue;
        prev[next]=n;front.push(next);
      }
    }
    if(prev[dest]===-1)return false;
    let next=dest;
    while(prev[next]!==source&&prev[next]!==next&&prev[next]!==-1)next=prev[next];
    const waypoint=cellPos(next%C,Math.floor(next/C));
    travel(a,waypoint,dt,speed);
    return false;
  }
function travel(a,p,dt,speed){
    if(!p)return false;
    const dx=p.x-a.x,dy=p.y-a.y,d=Math.hypot(dx,dy);
    if(d<5)return true;
    const vel=speed||(a.role==='scout'?107:a.role==='soldier'?78:64);
    const actual=min(d,vel*dt);
    a.x+=dx/d*actual;a.y+=dy/d*actual;a.angle=Math.atan2(dy,dx);a.swing+=dt*9;
    return d<max(7,actual+1);
  }
  function surfaceEntry(a){a.layer='surface';a.x=PORTAL.x;a.y=PORTAL.y+(a.id%5-2)*5;a.task='';}
  function nestEntry(a){a.layer='nest';a.x=NEST_ENT.x;a.y=NEST_ENT.y;a.task='';}
  function cross(s,a,layer,dt){
    if(a.layer===layer)return true;
    if(a.layer==='nest'&&layer==='surface'){if(travelNest(s,a,NEST_ENT,dt,75))surfaceEntry(a);return false;}
    if(a.layer==='surface'&&layer==='nest'){if(travel(a,PORTAL,dt,75))nestEntry(a);return false;}
    return false;
  }
  function adjacentOpen(s,c,r){
    const options=neighbors(c,r).filter(([x,y])=>s.nest.cells[index(x,y)]);
    if(!options.length)return null;
    const best=options.sort(([ac,ar],[bc,br])=>Math.abs(ac-10)+Math.abs(ar-3)-Math.abs(bc-10)-Math.abs(br-3))[0];
    return cellPos(best[0],best[1]);
  }
  function plannedOpen(s,c,r){return !!s.nest.cells[index(c,r)]||s.nest.digQueue.some(q=>q.c===c&&q.r===r);}
  function queueDig(s,c,r){
    if(s.ended||s.mission.step!==1)return false;
    if(!inside(c,r)||s.nest.cells[index(c,r)])return false;
    if(s.nest.digQueue.some(q=>q.c===c&&q.r===r))return false;
    const chain=[];let here={c,r};
    while(!neighbors(here.c,here.r).some(([nc,nr])=>plannedOpen(s,nc,nr))){
      chain.push(here);
      const candidates=neighbors(here.c,here.r);
      if(!candidates.length||chain.length>12)return false;
      let best=null,score=Infinity;
      for(const [nx,ny] of candidates){
        if(chain.some(q=>q.c===nx&&q.r===ny))continue;
        let nearest=Infinity;
        for(let cy=0;cy<R;cy++)for(let cx=0;cx<C;cx++)if(plannedOpen(s,cx,cy))nearest=min(nearest,Math.abs(cx-nx)+Math.abs(cy-ny));
        if(nearest<score){score=nearest;best={c:nx,r:ny};}
      }
      if(!best)return false;
      here=best;
    }
    chain.push(here);
    for(const q of chain.reverse()){
      if(!plannedOpen(s,q.c,q.r))s.nest.digQueue.push({...q,progress:0});
    }
    writeLog(s,s.nest.digQueue.length+' soil cells marked for excavation.');
    return true;
  }
  function planNest(s){
    if(s.mission.step!==1)return false;
    let added=0;
    for(const [c,r] of recommended){if(queueDig(s,c,r))added++;}
    if(added)writeLog(s,'Workers are excavating the future nursery passage.');
    return added>0;
  }
  function workDig(s,a,dt){
    const q=s.nest.digQueue.find(q=>!!adjacentOpen(s,q.c,q.r));
    if(!q)return false;
    if(!cross(s,a,'nest',dt))return true;
    const site=adjacentOpen(s,q.c,q.r);
    if(!travelNest(s,a,site,dt,67))return true;
    q.progress+=dt*(a.role==='worker'?.29:.1);
    a.swing+=dt*18;a.task='dig';
    if(q.progress>=1){
      s.nest.cells[index(q.c,q.r)]=1;s.nest.digQueue=s.nest.digQueue.filter(x=>x!==q);
      if(Mission.dug(s.mission)<6){s.mission.cells[Mission.dug(s.mission)]=1;}
      writeLog(s,'A soil cell was excavated ('+Mission.dug(s.mission)+'/6).');
    }
    return true;
  }
  function workForage(s,a,dt){
    if(a.carry>0){
      if(!cross(s,a,'nest',dt))return;
      if(travelNest(s,a,STORE,dt,65)){
        const weight=a.carry;a.carry=0;s.food=min(240,s.food+weight);
        s.mission.delivered+=weight;
        a.task='unload';a.foodNodeId=null;
        if(s.mission.step===0&&s.mission.delivered<=45)writeLog(s,'Food delivered: '+Math.floor(s.mission.delivered)+'/45.');
      }
      return;
    }
    if(!cross(s,a,'surface',dt))return;
    let f=nearestFood(s,a);
    if(!f)return;
    if(travel(a,f,dt,64)&&f.amount>0){
      const amount=min(15,f.amount);f.amount-=amount;a.carry=amount;
      a.task='carry';a.foodNodeId=f.id;
    }else a.task='forage';
  }
  function workerTick(s,a,dt){
    if(a.hp<=0)return;
    if(a.carry>0){workForage(s,a,dt);return;}
    if((a.stance==='move'||a.stance==='defend')&&a.moveOrder){
      if(!cross(s,a,'surface',dt))return;
      if(travel(a,a.moveOrder,dt,64)&&a.stance==='move'){a.stance='auto';a.moveOrder=null;}
      a.task='field command';return;
    }
    if(s.mission.step===1&&s.nest.digQueue.length>0&&a.id%2===0&&workDig(s,a,dt))return;
    workForage(s,a,dt);
  }
  function canTrain(s,role){
    const cost=role==='soldier'?30:18;
    const limit=s.nest.nursery?24:10;
    const black=s.ants.filter(a=>a.side==='black'&&a.hp>0).length;
    const brood=s.eggs.filter(e=>e.side==='black').length;
    return !s.ended&&(role!=='soldier'||s.mission.step>=2)&&s.food>=cost&&black+brood<limit;
  }
  function train(s,role){
    if(!canTrain(s,role)){writeLog(s,role==='soldier'&&s.mission.step<2?'Finish the nursery to unlock soldiers.':'Not enough food or nursery space.');return false;}
    s.food-=role==='soldier'?30:18;
    s.eggs.push({side:'black',role,remaining:role==='soldier'?7:5});
    writeLog(s,'Brood queued: '+role+'.');
    return true;
  }
  function buildNursery(s){
    if(s.ended||s.mission.step!==1)return false;
    if(Mission.dug(s.mission)<6){writeLog(s,'Excavate six cells before building the nursery.');return false;}
    if(s.food<45){writeLog(s,'The nursery requires 45 stored food.');return false;}
    s.food-=45;s.nest.nursery=true;
    s.nest.cells[index(14,5)]=1;s.nest.cells[index(13,5)]=1;
    writeLog(s,'Nursery constructed! Eggs and soldiers can now be raised.');
    return true;
  }
  function onStage(s){
    const m=s.mission;
    if(m.step===1){
      s.eggs.push({side:'black',role:'worker',remaining:5},{side:'black',role:'worker',remaining:8});
      writeLog(s,'Food secured! Two eggs laid. Open Nest to excavate the nursery.');
      s.alert=5;s.view='nest';s.mode='dig';
    }else if(m.step===2){
      s.food+=50;s.mode='move';s.view='surface';
      writeLog(s,'Nursery finished! 50 food awarded. Train three soldiers and secure the glowing border.');
      s.alert=5;
    }else if(m.step===3){
      s.view='surface';s.mode='defend';
      s.selected=s.ants.filter(a=>a.role==='soldier'&&a.side==='black'&&a.hp>0).map(a=>a.id);
      for(const a of selected(s)){a.stance='defend';a.moveOrder={...PORTAL};}
      writeLog(s,'ALERT: Red raiders are advancing on the queen. Defend the nest!');
      s.alert=8;
    }else if(m.step===4){
      for(const a of s.ants)if(a.side==='red'){a.stance='retreat';a.target={x:OUTPOST.x,y:OUTPOST.y};}
      s.mode='attack';s.view='surface';
      writeLog(s,'Raid survived! Advance on the red outpost and hold its territory.');
      s.alert=6;
    }else if(m.step===5){
      m.complete=true;s.ended='victory';s.paused=true;
      writeLog(s,'FIRST LIGHT SECURED! Your colony has won its first territory.');
    }
  }
  function checkStage(s){
    const m=s.mission;
    if(s.queenHP<=0){m.failed=true;s.ended='defeat';s.paused=true;writeLog(s,'The queen has fallen. Retry First Light.');return;}
    const soldiers=s.ants.filter(a=>a.side==='black'&&a.role==='soldier'&&a.hp>0).length;
    if(Mission.completion(m,0,soldiers,s.nest.nursery?1:0)){m.step++;onStage(s);}
  }
  function spawnRaid(s){
    if(s.mission.raidSpawned)return;
    s.mission.raidSpawned=true;
    for(let i=0;i<3;i++){
      const a=ant('raider','surface',OUTPOST.x+(i%2)*12,OUTPOST.y+(i-2)*16,'red');
      a.stance='raid';s.ants.push(a);s.mission.raidIds.push(a.id);
    }
    s.nextId=sequential+1;
  }
  function soldierTick(s,a,dt){
    const enemy=s.ants.filter(e=>e.side!==a.side&&e.hp>0&&e.layer===a.layer).sort((x,y)=>dist(x,a)-dist(y,a))[0];
    if(enemy&&dist(enemy,a)<100){
      travel(a,enemy,dt,78);a.task='combat';return;
    }
    const goal=a.moveOrder||{...PORTAL};
    if(a.stance==='attack'&&s.mission.step>=4){
      if(!cross(s,a,'surface',dt))return;
      travel(a,dist(goal,OUTPOST)<90?OUTPOST:goal,dt,78);a.task='attack';return;
    }
    if(!cross(s,a,'surface',dt))return;
    travel(a,goal,dt,72);a.task='guard';
  }
  function raiderTick(s,a,dt){
    if(a.stance==='retreat'){if(a.layer==='nest')cross(s,a,'surface',dt);else travel(a,OUTPOST,dt,82);return;}
    const enemy=s.ants.filter(e=>e.side==='black'&&e.hp>0&&e.layer===a.layer).sort((x,y)=>dist(x,a)-dist(y,a))[0];
    if(enemy&&dist(enemy,a)<80){travel(a,enemy,dt,73);return;}
    if(!cross(s,a,'nest',dt))return;
    travelNest(s,a,QUEEN,dt,76);
    if(dist(a,QUEEN)<42&&a.attackCooldown<=0){s.queenHP=max(0,s.queenHP-5);a.attackCooldown=1;}
  }
  function combatTick(s,dt){
    for(const a of s.ants)if(a.hp>0)a.attackCooldown=max(0,(a.attackCooldown||0)-dt);
    for(const a of s.ants){
      if(a.hp<=0||a.attackCooldown>0)continue;
      if(a.role==='worker'&&a.side==='black')continue;
      let b=null,nearest=19;
      for(const e of s.ants){
        if(e.side===a.side||e.hp<=0||e.layer!==a.layer)continue;
        const d=dist(a,e);
        if(d<nearest){nearest=d;b=e;}
      }
      if(!b)continue;
      b.hp-=a.role==='soldier'?22:a.role==='scout'?13:16;
      a.attackCooldown=.58;
      if(b.hp<=0){b.hp=0;a.glow=1.4;}
    }
    if(s.mission.step===4&&s.mission.outpostHealth>0){
      const attackers=s.ants.filter(a=>a.side==='black'&&a.hp>0&&a.layer==='surface'&&a.role!=='worker'
        &&a.stance==='attack'&&dist(a,OUTPOST)<OUTPOST.r+45);
      s.mission.outpostHealth=max(0,s.mission.outpostHealth-dt*attackers.reduce((v,a)=>v+(a.role==='soldier'?3.9:1.9),0));
      if(s.mission.outpostHealth===0&&s.mission.outpostHold===0)writeLog(s,'Red outpost destroyed! Hold the ground for 16 seconds.');
    }
  }
  function update(s,dt){
    if(!s||s.paused||s.ended)return;
    dt=clamp(dt,0,.05)*s.speed;s.elapsed+=dt;s.alert=max(0,s.alert-dt);
    const m=s.mission;
    if(m.step===3){spawnRaid(s);m.raidElapsed+=dt;}
    for(const egg of s.eggs)egg.remaining-=dt;
    const ready=s.eggs.filter(e=>e.remaining<=0);
    s.eggs=s.eggs.filter(e=>e.remaining>0);
    for(const egg of ready){
      const spawn=s.nest.nursery?NURSERY:QUEEN;
      const a=ant(egg.role,'nest',spawn.x-12,spawn.y+8);
      s.ants.push(a);
      if(egg.role==='soldier')writeLog(s,'A soldier has hatched. Add it to your army!');
    }
    s.nextId=sequential+1;
    for(const a of s.ants){
      if(a.hp<=0)continue;
      a.glow=max(0,(a.glow||0)-dt);
      if(a.side==='red'){raiderTick(s,a,dt);continue;}
      if(a.role==='worker')workerTick(s,a,dt);
      else if(a.role==='soldier')soldierTick(s,a,dt);
      else if(a.role==='scout'){
        if(a.carry>0||a.stance==='forage'){workForage(s,a,dt);continue;}
        if(a.moveOrder){
          if(!cross(s,a,'surface',dt))continue;
          if(travel(a,a.moveOrder,dt,107)&&a.stance==='move'){a.moveOrder=null;a.stance='auto';}
        }else if(a.layer==='surface')travel(a,{x:PORTAL.x+34,y:PORTAL.y-20},dt,82);
      }
    }
    combatTick(s,dt);
    s.ants=s.ants.filter(a=>a.hp>0);
    s.selected=s.selected.filter(id=>s.ants.some(a=>a.id===id));
    if(m.step===2){
      const hasSoldiers=s.ants.filter(a=>a.side==='black'&&a.role==='soldier'&&a.hp>0).length>=3;
      const atBorder=s.ants.some(a=>a.side==='black'&&a.hp>0&&a.layer==='surface'&&dist(a,BORDER)<BORDER.r);
      m.borderHold=hasSoldiers&&atBorder?min(18,m.borderHold+dt):max(0,m.borderHold-dt*.25);
    }
    if(m.step===4&&m.outpostHealth<=0){
      const occupying=s.ants.some(a=>a.side==='black'&&a.hp>0&&a.layer==='surface'&&dist(a,OUTPOST)<OUTPOST.r+43);
      m.outpostHold=occupying?min(16,m.outpostHold+dt):max(0,m.outpostHold-dt);
    }
    checkStage(s);
  }
  function objective(s){return Mission.objective(s.mission,s.ants.filter(a=>a.side==='black'&&a.role==='soldier'&&a.hp>0).length,s.nest.nursery?1:0);}
  function cellAt(p){return {c:Math.floor(p.x/CELL),r:Math.floor(p.y/CELL)};}
  window.ColonyEngine={create,normalize,update,objective,selected,selectGroup,selectOne,setMode,issue,queueDig,planNest,
    train,canTrain,buildNursery,cellAt,writeLog,
    constants:{SW,SH,C,R,CELL,PORTAL,OUTPOST,BORDER,NEST_ENT,QUEEN,STORE,NURSERY,recommended}};
})();