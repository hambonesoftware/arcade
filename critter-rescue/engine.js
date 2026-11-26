function createGame(level){
 const W=120,H=60,ground=new Uint8Array(W*H),leaf=new Set(),rocks=[],creatures=[];
 let time=0,spawn=0,saved=0,lost=0,done=false;
 const stock={bridge:level.bridge,dig:level.dig,leaf:level.leaf,signal:level.signal,glide:level.glide,push:level.push};
 const idx=(x,y)=>y*W+x;
 const tile=(x,y)=>x<0||x>=W||y<0?1:y>=H?0:ground[idx(x,y)];
 function set(x,y,v){if(x>=0&&x<W&&y>=0&&y<H)ground[idx(x,y)]=v;}
 function rect(x,y,w,h,v){for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++)set(a,b,v);}
 for(const r of level.land)rect(...r,1);
 for(const r of level.water||[])rect(...r,3);
 for(const r of level.stone||[])rect(...r,4);
 for(const r of level.rocks||[])rocks.push({x:r[0],y:r[1],dir:0,steps:0,t:0});
 const rockAt=(x,y,except)=>rocks.some(r=>r!==except&&x>=r.x&&x<r.x+2&&y>=r.y&&y<r.y+2);
 function solid(x,y,except){const t=tile(x,y);return t===1||t===2||t===4||rockAt(x,y,except);}
 function paint(tool,x,y){
  if(done||x<1||x>=W-1||y<1||y>=H-1)return false;
  if(tool==='signal'||tool==='glide'){
   let best=null,dist=4.5;for(const c of creatures){if(c.state!=='live')continue;let d=Math.hypot(c.x-x,c.y-1-y);if(d<dist){best=c;dist=d;}}
   if(!best)return false;
   if(tool==='signal'&&best.block){best.block=false;stock.signal++;return true;}
   if(stock[tool]<=0)return false;
   if(tool==='signal'){best.block=true;stock.signal--;}
   else{if(best.glide)return false;best.glide=true;stock.glide--;}
   return true;
  }
  if(!stock[tool])return false;
  if(tool==='bridge'){if(tile(x,y)!==0||rockAt(x,y))return false;set(x,y,2);stock.bridge--;return true;}
  if(tool==='dig'){let changed=false;for(let b=y-1;b<=y+1;b++)for(let a=x-1;a<=x+1;a++){if(stock.dig>0&&tile(a,b)===1){set(a,b,0);stock.dig--;changed=true;}}return changed;}
  if(tool==='leaf'){if(!solid(x,y)||leaf.has(idx(x,y)))return false;leaf.add(idx(x,y));stock.leaf--;return true;}
  if(tool==='push'){const r=rocks.find(r=>Math.abs(x-r.x-.5)<3&&Math.abs(y-r.y-.5)<3);if(!r)return false;r.dir=x<r.x+.5?1:-1;r.steps=12;stock.push--;return true;}
  return false;
 }
 function tick(dt){
  if(done)return;time+=dt;
  if(spawn<level.count&&time>=.7+spawn*.72){creatures.push({id:spawn,x:level.start[0]+.5,y:level.start[1],dir:1,vy:0,fall:0,state:'live',block:false,glide:false});spawn++;}
  for(const r of rocks){r.t+=dt;if(r.t<.12)continue;r.t=0;
   if(!solid(r.x,r.y+2,r)&&!solid(r.x+1,r.y+2,r)&&r.y<H-3){r.y++;continue;}
   if(r.steps>0){const nx=r.x+r.dir,edge=r.dir>0?nx+1:nx;if(nx>0&&nx<W-2&&!solid(edge,r.y,r)&&!solid(edge,r.y+1,r)){r.x=nx;r.steps--;}else r.steps=0;}
  }
  for(const c of creatures){if(c.state!=='live')continue;
   let cx=Math.floor(c.x),fy=Math.floor(c.y+.0001);
   if(c.y>H-1||tile(cx,Math.floor(c.y-.5))===3){c.state='lost';lost++;continue;}
   if(Math.abs(c.x-level.exit[0])<2.1&&Math.abs(c.y-level.exit[1])<2.2){c.state='saved';saved++;continue;}
   if(solid(cx,fy)&&c.vy>=0){
    if(c.fall>10&&!c.glide&&!leaf.has(idx(cx,fy))){c.state='lost';lost++;continue;}
    c.y=fy;c.vy=0;c.fall=0;
    if(c.block)continue;
    let nx=c.x+c.dir*4.6*dt,ix=Math.floor(nx);
    const other=creatures.find(o=>o!==c&&o.state==='live'&&o.block&&Math.abs(o.y-c.y)<1.4&&Math.abs(o.x-nx)<.72&&Math.sign(o.x-c.x)===c.dir);
    if(other){c.dir*=-1;continue;}
    if(solid(ix,fy-1)||solid(ix,fy-2)){
     if(solid(ix,fy-1)&&!solid(ix,fy-2)&&!solid(ix,fy-3)){c.x=nx;c.y=fy-1;}else c.dir*=-1;
    }else c.x=nx;
   }else{
    c.vy=Math.min(c.glide?3.4:24,c.vy+32*dt);let ny=c.y+c.vy*dt;
    const ix=Math.floor(c.x);let landed=false;
    for(let yy=Math.ceil(c.y);yy<=Math.floor(ny);yy++)if(solid(ix,yy)){c.fall+=yy-c.y;c.y=yy;c.vy=0;landed=true;break;}
    if(!landed){c.fall+=ny-c.y;c.y=ny;}
    let nx=c.x+c.dir*(c.glide?2.2:1.5)*dt;
    if(!solid(Math.floor(nx),Math.floor(c.y-.5))&&!solid(Math.floor(nx),Math.floor(c.y-1.5)))c.x=nx;
   }
  }
  if(time>=level.limit||saved+lost===level.count)done=true;
 }
 return {W,H,ground,leaf,rocks,creatures,stock,paint,tick,tile,get time(){return time},get spawn(){return spawn},get saved(){return saved},get lost(){return lost},get done(){return done}};
}
const levels=[{"name":"A little leap","desc":"Draw a twig bridge across the creek, then release the flock.","count":12,"goal":10,"limit":55,"start":[10,35],"exit":[109,35],"land":[[0,35,45,25],[63,35,57,25]],"water":[[45,48,18,12]],"bridge":24,"dig":0,"leaf":0,"signal":2,"glide":0,"push":0},{"name":"Under the old oak","desc":"Excavate a two-cell-high passage through the root bank. Stone is too hard to dig.","count":16,"goal":13,"limit":65,"start":[10,36],"exit":[109,36],"land":[[0,36,120,24],[47,23,15,13]],"stone":[[47,22,15,1]],"rocks":[[53,20]],"bridge":0,"dig":48,"leaf":0,"signal":2,"glide":0,"push":2},{"name":"The great drop","desc":"Pad the landing with soft leaves, then bridge the stream. You can plan while paused.","count":18,"goal":15,"limit":70,"start":[10,19],"exit":[109,39],"land":[[0,19,39,41],[39,39,35,21],[88,39,32,21]],"water":[[74,50,14,10]],"bridge":20,"dig":0,"leaf":12,"signal":2,"glide":3,"push":0},{"name":"Mossy maze","desc":"Build across the first gap, dig through the bank, and cushion the final drop.","count":24,"goal":20,"limit":90,"start":[9,23],"exit":[110,40],"land":[[0,23,30,37],[42,23,40,37],[82,40,38,20],[58,13,11,10]],"stone":[[58,12,11,1]],"rocks":[[62,10]],"bridge":18,"dig":36,"leaf":12,"signal":3,"glide":3,"push":3}];
export {createGame,levels};
