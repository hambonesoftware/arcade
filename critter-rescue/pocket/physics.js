// Fixed-step mechanical rescue simulation in a compact portrait room.
export const W=400,H=600,DT=1/120,R=13;
export const levels=[
 {name:'The swinging bridge',world:'Clover Creek',hint:'Swipe through the rope to lower the bridge, then open the nest.',kind:'bridge',start:{x:52,y:207},home:{x:341,y:382},floor:[[12,238,112,22],[273,395,115,22]],pivot:{x:124,y:238},length:210,angle:-1.12,target:.78,rope:{a:{x:251,y:75}},count:3},
 {name:'The springboard',world:'Fernwater Falls',hint:'Drag the spring lever upward to charge it. Aim the dotted arc at the upper trail.',kind:'spring',start:{x:49,y:355},home:{x:343,y:274},floor:[[12,386,139,24],[273,287,115,24]],spring:{x:131,y:386},count:3},
 {name:'The acorn lift',world:'Oak Workshop',hint:'Pull the brass pin, then open the nest. The loaded lift will rise to the upper trail.',kind:'lift',start:{x:48,y:389},home:{x:345,y:225},floor:[[12,420,115,22],[273,238,115,22]],lift:{x:200,y:420,top:238,width:146},count:4}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function segmentDistance(p,a,b){let dx=b.x-a.x,dy=b.y-a.y;let t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t);}
export function segmentsHit(a,b,c,d,r=12){return segmentDistance(a,c,d)<=r||segmentDistance(b,c,d)<=r||segmentDistance(c,a,b)<=r||segmentDistance(d,a,b)<=r||((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))*((b.x-a.x)*(d.y-a.y)-(b.y-a.y)*(d.x-a.x))<0&&((d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x))*((d.x-c.x)*(b.y-c.y)-(d.y-c.y)*(b.x-c.x))<0;}
export function springVelocity(charge){return {vx:145+charge*70,vy:-285-charge*115};}
export function createGame(index=0){
 const l=levels[index],agents=[],events=[];let time=0,spawned=0,saved=0,lost=0,running=false,done=false,angle=l.angle||0,av=0,cut=false,charge=.15,pin=true,liftY=l.lift?.y||0,liftV=0,weightY=0,liftReady=false,launchCount=0;
 function event(type,x,y){events.push({type,x,y});}
 function rope(){if(l.kind!=='bridge'||cut)return null;return {a:l.rope.a,b:{x:l.pivot.x+Math.cos(angle)*l.length,y:l.pivot.y+Math.sin(angle)*l.length}};}
 function swipe(a,b){const r=rope();if(done||!r||!segmentsHit(a,b,r.a,r.b,15))return false;cut=true;event('cut',(r.a.x+r.b.x)/2,(r.a.y+r.b.y)/2);return true;}
 function setCharge(v){if(l.kind!=='spring'||done)return false;charge=clamp(v,0,1);return true;}
 function pullPin(){if(l.kind!=='lift'||!pin||done)return false;pin=false;event('pin',l.lift.x+85,150);return true;}
 function release(){if(done||running)return false;running=true;event('release',l.start.x,l.start.y);return true;}
 function finish(a,state){a.state=state;if(state==='saved'){saved++;event('saved',l.home.x,l.home.y);}else{lost++;event('lost',a.x,a.y);}}
 function surface(x){let ys=[];for(const [fx,fy,fw] of l.floor)if(x>=fx-3&&x<=fx+fw+3)ys.push(fy);
  if(l.kind==='bridge'&&cut){let end=l.pivot.x+Math.cos(angle)*l.length;if(x>=l.pivot.x-3&&x<=end+3&&Math.cos(angle)>.1)ys.push(l.pivot.y+Math.tan(angle)*(x-l.pivot.x));}
  if(l.kind==='lift'&&x>=l.lift.x-l.lift.width/2-3&&x<=l.lift.x+l.lift.width/2+3)ys.push(liftY);
  return ys.sort((a,b)=>a-b);
 }
 function tick(dt=DT){if(done)return;
  if(cut&&l.kind==='bridge'){av+=(10*(l.target-angle)-5.6*av)*dt;angle+=av*dt;if(Math.abs(angle-l.target)<.002&&Math.abs(av)<.02){angle=l.target;av=0;}}
  if(!pin&&l.kind==='lift'&&!liftReady&&agents.filter(a=>a.state==='live'&&a.onLift).length===l.count){liftReady=true;event('lift',l.lift.x,liftY);}
  if(liftReady){liftV=Math.min(96,liftV+180*dt);liftY=Math.max(l.lift.top,liftY-liftV*dt);weightY=l.lift.y-liftY;if(liftY===l.lift.top)liftV=0;}
  if(!running)return;time+=dt;
  if(spawned<l.count&&time>=.25+spawned*.72)agents.push({id:spawned++,x:l.start.x,y:l.start.y,vx:58,vy:0,grounded:false,onLift:false,fired:false,state:'live'});
  for(const a of agents){if(a.state!=='live')continue;
   if(a.onLift){a.y=liftY-R;if(liftY===l.lift.top){a.onLift=false;a.grounded=true;a.vx=60;}else continue;}
   if(l.kind==='lift'&&liftY>l.lift.top&&a.x>=l.lift.x-l.lift.width*.22&&a.x<=l.lift.x+l.lift.width*.22&&Math.abs(a.y+R-liftY)<5){a.onLift=true;a.x=l.lift.x-30+a.id*20;a.y=liftY-R;continue;}
   if(l.kind==='spring'&&!a.fired&&a.x>=l.spring.x-2&&a.grounded){a.fired=true;a.grounded=false;Object.assign(a,springVelocity(charge));launchCount++;event('launch',a.x,a.y);}
   let oy=a.y;a.x+=a.vx*dt;a.vy+=530*dt;let ny=a.y+a.vy*dt;
   let candidates=surface(a.x);
   if(a.grounded){let support=candidates.find(y=>Math.abs(y-(oy+R))<12);if(support!==undefined){a.y=support-R;a.vy=0;}else a.grounded=false;}
   if(!a.grounded){let hit=a.vy>=0?candidates.find(y=>oy+R<=y+.5&&ny+R>=y):undefined;if(hit!==undefined){a.y=hit-R;a.vy=0;a.grounded=true;if(a.fired){a.vx=58;event('land',a.x,a.y);}}else a.y=ny;}
   if(a.grounded&&Math.hypot(a.x-l.home.x,a.y-l.home.y)<24){finish(a,'saved');continue;}
   if(a.x>W+25||a.x< -25||a.y>555){finish(a,'lost');continue;}
  }
  if(saved+lost===l.count||time>26){for(const a of agents)if(a.state==='live')finish(a,'lost');lost+=l.count-spawned;done=true;}
 }
 return {level:l,agents,events,swipe,setCharge,pullPin,release,tick,rope,get time(){return time},get saved(){return saved},get lost(){return lost},get running(){return running},get done(){return done},get angle(){return angle},get cut(){return cut},get charge(){return charge},get pin(){return pin},get liftY(){return liftY},get weightY(){return weightY},get liftReady(){return liftReady},get launchCount(){return launchCount}};
}
