import {W,H,R,springVelocity} from './physics.js';
const TAU=Math.PI*2;
function oval(c,x,y,rx,ry,fill){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}
function box(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.6;c.stroke();}}
function line(c,points,stroke,width=2){c.strokeStyle=stroke;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.stroke();}
function grad(c,y,h,a,b){let g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function radial(c,x,y,r,a,b){let g=c.createRadialGradient(x-r*.25,y-r*.4,1,x,y,r);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function rng(i,j=0){let n=Math.imul(i+173,374761393)^Math.imul(j+83,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296;}
function leaf(c,x,y,s,rot,color='#70d633'){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);c.fillStyle=radial(c,0,0,15,'#d5ff75',color);c.strokeStyle='#368f48';c.lineWidth=1.2;c.beginPath();c.moveTo(-12,0);c.quadraticCurveTo(-5,-15,12,0);c.quadraticCurveTo(4,12,-12,0);c.fill();c.stroke();line(c,[[-10,0],[10,0]],'#eaffab',.85);c.restore();}
function fern(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);for(let i=-2;i<=2;i++){c.save();c.rotate(i*.31);line(c,[[0,0],[0,-25]],'#4bac4a',2);for(let j=0;j<3;j++){leaf(c,-5,-7-j*6,.52,-.7);leaf(c,5,-10-j*5,.52,.7);}c.restore();}c.restore();}
function flower(c,x,y,s,hue=0){c.save();c.translate(x,y);c.scale(s,s);line(c,[[0,0],[1,-11],[0,-22]],'#319c57',2.8);leaf(c,-5,-7,.52,.25);leaf(c,5,-14,.44,-.7);const colors=[['#ff8bd8','#e43b9c'],['#fff69c','#ffb330'],['#b2d8ff','#7662dc'],['#fff1e1','#ff6d64']][hue%4];for(let k=0;k<5;k++){let a=k*Math.PI*2/5;oval(c,Math.sin(a)*7,-22+Math.cos(a)*7,5.5,5.5,radial(c,Math.sin(a)*7,-22+Math.cos(a)*7,7,colors[0],colors[1]));}oval(c,0,-22,4.2,4.2,radial(c,0,-22,5,'#fffbd1','#ffbd2a'));c.restore();}
function cap(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);oval(c,0,1,11,3,'#23534b55');box(c,-4,-15,8,16,4,grad(c,-15,16,'#fff5dc','#e8b383'),'#c68b62');c.fillStyle=radial(c,-3,-20,20,'#ffb0a0','#ed465e');c.strokeStyle='#af3d57';c.lineWidth=1.3;c.beginPath();c.moveTo(-15,-12);c.bezierCurveTo(-18,-31,17,-32,16,-12);c.quadraticCurveTo(0,-5,-15,-12);c.fill();c.stroke();for(let i=0;i<5;i++)oval(c,-10+i*5,-17-rng(i)*7,2.2,1.7,'#fff5d2');oval(c,-6,-24,4,2,'#ffffff77');c.restore();}
function jewel(c,x,y,s,color='#84ddff'){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=color;c.strokeStyle='#4777a5';c.lineWidth=1.1;c.beginPath();c.moveTo(-5,-7);c.lineTo(4,-8);c.lineTo(8,-2);c.lineTo(0,8);c.lineTo(-8,-2);c.closePath();c.fill();c.stroke();line(c,[[-5,-7],[0,8],[4,-8]],'#ffffff99',1);line(c,[[-8,-2],[8,-2]],'#ffffff99',1);c.restore();}
function terrain(c,x,y,w,h){
 oval(c,x+w*.5,y+h+13,w*.52,8,'#204d6555');
 c.fillStyle=grad(c,y,h+24,'#e8ae62','#b26754');c.strokeStyle='#965a56';c.lineWidth=2.2;c.beginPath();c.moveTo(x+2,y+5);c.lineTo(x+w-2,y+5);c.quadraticCurveTo(x+w+2,y+h*.8,x+w-9,y+h+11);c.lineTo(x+13,y+h+11);c.quadraticCurveTo(x-1,y+h*.7,x+2,y+5);c.fill();c.stroke();
 c.save();c.clip();for(let j=0;j<3;j++){c.strokeStyle=['#f6cf84aa','#c1785466','#92555366'][j];c.lineWidth=2.5;c.beginPath();c.moveTo(x,y+12+j*8);for(let k=0;k<=w;k+=5)c.lineTo(x+k,y+12+j*8+Math.sin(k*.11+j)*2.8);c.stroke();}
 for(let i=0;i<w/6;i++){let xx=x+4+i*6,yy=y+12+rng(i,x)*h*.7;if(i%7===0)jewel(c,xx,yy,.43,i%2?'#f6c677':'#bba5ff');else oval(c,xx,yy,1.5+rng(i,3)*2,1.2,i%2?'#ffe0a677':'#a75b5555');}c.restore();
 // Candy-green turf with a beveled lip and rounded grassy scallops.
 box(c,x-1,y-1,w+2,11,5,grad(c,y-2,13,'#d5ff62','#51bf3f'),'#378b43');
 for(let i=0;i<w/9;i++){let xx=x+5+i*9;oval(c,xx,y+7,5.4,2.7+rng(i,x)*2,'#53b83e');oval(c,xx,y+1,3.4,1.1,'#edff9c');}
 line(c,[[x+5,y+1],[x+w-5,y+1]],'#f0ffa6',1.5);
 if(w>60){fern(c,x+8,y,.8);cap(c,x+w-8,y,.65);flower(c,x+16,y,.67,Math.floor(x)%4);flower(c,x+w-19,y,.54,(Math.floor(y)+1)%4);}
}
function plank(c,x,y,length,angle){c.save();c.translate(x,y);c.rotate(angle);
 box(c,-1,3,length+2,17,6,'#9b5140','#763d49');
 box(c,0,-1,length,14,5,grad(c,-1,14,'#ffe6a1','#e6a250'),'#ab6745');
 for(let i=0;i<length;i+=15){let w=Math.min(14,length-i);if(w<2)continue;box(c,i+1,1,w-1,10,3,grad(c,1,10,i%2?'#ffd47e':'#ffe8ae',i%2?'#d99a48':'#e7b060'));line(c,[[i+3,3],[i+w-3,3]],'#fff5cc99',.9);if(w>10){oval(c,i+4,8,1.25,1.25,'#a35e40');oval(c,i+w-4,8,1.25,1.25,'#a35e40');}}
 line(c,[[1,0],[length-1,0]],'#fff4bb',1.5);c.restore();}
function bolt(c,x,y,r=6){oval(c,x,y,r+2,r+2,'#9c653f');oval(c,x,y,r,r,radial(c,x,y,r,'#fff8bd','#e5a52d'));oval(c,x-r*.22,y-r*.3,r*.34,r*.21,'#fff9db99');line(c,[[x-2,y+2],[x+2,y-2]],'#a36b39',1.5);}

function door(c,x,ground,home,t){c.save();c.translate(x,ground);oval(c,0,1,34,7,'#28635855');
 // A rounded, collectible-toy acorn cottage with individually modeled roof scales.
 c.fillStyle=radial(c,-6,-24,38,'#ffe6a4','#db9051');c.strokeStyle='#a96346';c.lineWidth=2;c.beginPath();c.moveTo(-28,1);c.bezierCurveTo(-32,-16,-23,-46,0,-46);c.bezierCurveTo(24,-46,32,-16,28,1);c.closePath();c.fill();c.stroke();
 for(let i=-2;i<=2;i++)line(c,[[i*10,0],[i*9,-20],[i*4,-39]],'#b7744888',1.6);
 box(c,-16,-31,32,32,[16,16,3,3],grad(c,-31,32,'#ffc86d','#b97739'),'#a6623d');
 box(c,-11,-26,22,27,[11,11,2,2],home?grad(c,-26,27,'#fff1a3','#ffb750'):'#80504b');
 if(home){oval(c,0,-10,13,14,'#ffe68d66');oval(c,0,-12,4+Math.sin(t*3)*.7,4,'#fffbe0');}
 for(const xx of [-22,22]){box(c,xx-4,-22,8,10,3,home?'#84e8f4':'#e7b2fc','#9d6344');line(c,[[xx,-21],[xx,-13]],'#fff2bc',.9);}
 c.fillStyle=radial(c,-5,-45,40,home?'#bbf75e':'#9cd5ff',home?'#42ad56':'#537cdc');c.strokeStyle=home?'#3f9850':'#5266bd';c.lineWidth=2;c.beginPath();c.moveTo(-34,-34);c.quadraticCurveTo(-26,-59,-3,-58);c.quadraticCurveTo(23,-61,34,-34);c.quadraticCurveTo(1,-24,-34,-34);c.fill();c.stroke();
 for(let j=0;j<2;j++)for(let i=0;i<6-j;i++){let xx=-25+i*10+j*5,yy=-39-j*9+Math.abs(xx)*.12;oval(c,xx,yy,5,2.6,home?'#d0ff8155':'#c8eaff77');}
 line(c,[[-3,-58],[0,-65],[5,-68]],'#8b6642',4);leaf(c,10,-65,.7,-.6);
 box(c,-22,-73,44,13,5,'#fff0ba','#ad8759');c.fillStyle='#805339';c.textAlign='center';c.font='800 9px system-ui';c.fillText(home?'HOME':'NEST',0,-64);flower(c,-31,-1,.55,0);flower(c,31,-1,.55,1);c.restore();}
function mouse(c,x,y,id,t,air=false,dir=1){
 const coats=[['#ffdda1','#eea455','#b86942'],['#f9f5ff','#b6b7e3','#8583b2'],['#ffd2c3','#e697a1','#af6579'],['#ffed9d','#ecc45b','#c78c40']],p=coats[id%4],step=air?0:Math.sin(t*18+id*2),bob=air?0:Math.abs(step)*2;
 c.save();c.translate(x,y-bob);c.scale(dir,1);
 oval(c,0,R,17,4,'#28526455');
 c.save();if(air)c.rotate(Math.sin(t*6+id)*.13);
 c.strokeStyle=p[2];c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(-12,6);c.bezierCurveTo(-32,11,-32,-8,-23,-11+Math.sin(t*7)*2);c.stroke();c.strokeStyle='#ffd4ad';c.lineWidth=1.3;c.stroke();
 for(const j of [-1,1]){let xx=j*8+step*j*2;oval(c,xx,11,6.5,3.7,p[2]);oval(c,xx,10,5.5,2.5,p[1]);}
 oval(c,-1,1,14,14,radial(c,-1,1,18,p[0],p[1]));oval(c,2,5,9,8,'#fff2d4');
 for(const j of [-1,1]){oval(c,j*10,-23,8.9,10.5,p[2]);oval(c,j*10,-24,8,9.2,radial(c,j*10,-24,11,p[0],p[1]));oval(c,j*10,-24,5.5,6.7,radial(c,j*10,-24,8,'#ffcbe1','#ed90af'));oval(c,j*10-1.5,-27,2,2,'#fff2f377');}
 oval(c,1,-12,17.5,16.5,p[2]);oval(c,1,-13,16.5,15.5,radial(c,1,-13,20,p[0],p[1]));
 oval(c,-3,-22,5,2,'#ffffff77');oval(c,-6,-8,5.5,3.6,'#ff9baa88');oval(c,10,-7,5.5,3.6,'#ff9baa99');
 oval(c,6,-4,10.5,7,'#fff0d3');oval(c,13,-6,3.6,2.9,'#a45168');oval(c,12,-7,1.5,1,'#ffc1c5');
 const blink=Math.floor(t*1.3+id*.7)%9===0;
 for(const xx of [-4,8]){if(blink){line(c,[[xx-3,-14],[xx+3,-14]],'#634450',1.9);}else{oval(c,xx,-15,5,6.4,'#fffef3');oval(c,xx+1,-14.5,3.7,4.8,'#4c3653');oval(c,xx+2,-15,2.7,3.8,'#20263f');oval(c,xx+1,-17,1.5,1.6,'#fff');oval(c,xx+3,-12,0.8,0.8,'#b3d5ff');}}
 c.strokeStyle='#784f51';c.lineWidth=1.5;c.beginPath();c.moveTo(3,-1);c.quadraticCurveTo(8,3,12,-1);c.stroke();if(air)oval(c,8,0,3.7,4.2,'#87435f');
 for(let j=0;j<2;j++)line(c,[[11,0],[19,-2+j*5]],'#aa776b',.8);
 const scarf=['#ff5d6b','#36c7ee','#9b70ed','#ffad2c'][id%4];line(c,[[-12,-1],[-4,3],[10,1]],'#87506b66',6.5);line(c,[[-12,-2],[-4,2],[10,0]],scarf,5.5);line(c,[[-10,0],[-15,10]],scarf,5);oval(c,-8,0,3,2,'#fff8c999');
 oval(c,10,5+step,4.2,4.2,p[0]);
 if(id%4===0){oval(c,-1,-28,9,3.3,'#a26945');oval(c,-1,-31,7,5.5,radial(c,-1,-31,8,'#ffdc82','#bf8245'));leaf(c,4,-35,.44,-.7);}else if(id%4===1){for(let j=0;j<5;j++)oval(c,-10+Math.sin(j*TAU/5)*3,-29+Math.cos(j*TAU/5)*3,2.7,2.7,'#ff83cf');oval(c,-10,-29,2,2,'#ffec83');}else if(id%4===2){box(c,-11,-25,17,4,2,'#46d5bd');oval(c,4,-24,3.5,3,'#6ae4cf');}else{box(c,-9,-29,18,5,3,'#6c8cf5');oval(c,0,-31,6,5,'#8ebaff');}
 c.restore();c.restore();}

function label(c,x,y,text,small=false){c.font=(small?'800 9px':'800 11px')+' system-ui';let w=c.measureText(text).width+19;box(c,x-w/2,y-10,w,23,8,'#23487f66');box(c,x-w/2,y-12,w,22,8,grad(c,y-12,22,'#826bef','#5949c8'),'#fff0b6');c.fillStyle='#fffdf2';c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y-1);c.textBaseline='alphabetic';}
function cloud(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);const g=grad(c,-22,34,'#ffffff','#d5f1ff');for(const a of [[-23,2,18,12],[-4,-8,22,20],[17,-4,18,15],[34,4,15,10]])oval(c,...a,g);c.restore();}
function hill(c,x,y,w,h,a,b){c.fillStyle=grad(c,y-h,h,a,b);c.beginPath();c.moveTo(x-w,y);c.bezierCurveTo(x-w*.8,y-h*.85,x-w*.3,y-h,x,y-h);c.bezierCurveTo(x+w*.45,y-h,x+w*.86,y-h*.65,x+w,y);c.lineTo(x+w,600);c.lineTo(x-w,600);c.closePath();c.fill();}
function tree(c,x,y,s,hue=0,alpha=1){c.save();c.globalAlpha=alpha;c.translate(x,y);c.scale(s,s);c.fillStyle=grad(c,-145,145,'#e1af72','#a66d59');c.beginPath();c.moveTo(-15,5);c.quadraticCurveTo(-6,-50,-12,-110);c.lineTo(10,-110);c.quadraticCurveTo(8,-52,18,5);c.closePath();c.fill();for(let i=0;i<3;i++)line(c,[[-8+i*6,-89],[-7+i*6,-45],[-10+i*7,-3]],'#9e705966',1.5);
 const p=[['#c5f875','#5ebc65'],['#91edbe','#40b89c'],['#c6b6ff','#837fdd']][hue%3];
 for(const [xx,yy,r] of [[-28,-116,31],[0,-143,39],[30,-122,32],[-1,-105,36]]){oval(c,xx,yy,r,r*.83,radial(c,xx,yy,r,p[0],p[1]));oval(c,xx-r*.2,yy-r*.33,r*.36,r*.12,'#ffffff24');}
 c.restore();}
function butterfly(c,x,y,t,id){c.save();c.translate(x,y);let fl=.35+Math.abs(Math.sin(t*8+id))*.65;const cols=['#ff8ac5','#ffe275','#b7a4ff'];oval(c,-4*fl,-2,5*fl,3.7,cols[id%3]);oval(c,4*fl,-2,5*fl,3.7,cols[id%3]);oval(c,-3*fl,2,3*fl,2.7,cols[id%3]);oval(c,3*fl,2,3*fl,2.7,cols[id%3]);oval(c,0,0,1,4,'#795f8e');c.restore();}

export class Art{
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.bg=document.createElement('canvas');this.bg.width=W*2;this.bg.height=H*2;this.effects=[];this.index=-1;this.scale=1;this.x=0;this.y=0;this.w=0;this.h=0;this.trail=[];this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}
 resize(){const r=this.canvas.getBoundingClientRect();this.w=r.width;this.h=r.height;if(!r.width||!r.height)return;this.dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(r.width*this.dpr);this.canvas.height=Math.round(r.height*this.dpr);this.scale=Math.min(r.width/W,r.height/H);this.x=(r.width-W*this.scale)/2;this.y=(r.height-H*this.scale)/2;}
 point(e){const r=this.canvas.getBoundingClientRect();return {x:(e.clientX-r.left-this.x)/this.scale,y:(e.clientY-r.top-this.y)/this.scale};}
 reset(index){this.index=index;this.effects=[];this.trail=[];const c=this.bg.getContext('2d');c.setTransform(2,0,0,2,0,0);
 const worlds=[
 {sky:['#50caff','#c9f6ff'],hills:['#9be3ae','#68c9a2','#65cb78','#35b278'],trees:0,water:['#61e4ed','#278cd9']},
 {sky:['#7bd4ff','#e5fdff'],hills:['#b6e9ed','#75d7cf','#8ddbbb','#42b8b0'],trees:1,water:['#65f5ed','#428fdf']},
 {sky:['#b5a6ff','#ffe0d8'],hills:['#e0bfff','#b5a1e9','#b9a3ed','#828bd6'],trees:2,water:['#83dafa','#7771df']}
 ];const p=worlds[index];c.fillStyle=grad(c,0,H,p.sky[0],p.sky[1]);c.fillRect(0,0,W,H);
 oval(c,305,60,48,48,radial(c,305,60,54,'#fffbd0','#fff4ab55'));oval(c,305,60,28,28,'#fff9c2');
 cloud(c,41,67,.85);cloud(c,187,39,.62);cloud(c,352,117,.9);
 hill(c,38,440,140,260,p.hills[0],p.hills[1]);hill(c,285,470,190,280,p.hills[0],p.hills[1]);hill(c,149,500,165,220,p.hills[2],p.hills[3]);
 // Layered scenery has distinct silhouettes, but the puzzle remains in the foreground.
 for(let i=0;i<8;i++)tree(c,i*63-16,435+rng(i,2)*66,.94+rng(i,5)*.65,p.trees,.53);
 for(let i=0;i<6;i++)tree(c,i*84-34,500+rng(i,7)*38,1.05+rng(i,8)*.64,p.trees,.7);
 if(index===1){for(let i=0;i<4;i++){let x=77+i*66;box(c,x,315+i%2*25,15,212,8,grad(c,315,212,'#f6ffff77','#5feaff99'));line(c,[[x+4,333],[x+4,505]],'#ffffff55',2);}}
 if(index===2){for(let i=0;i<4;i++){let x=10+i*116,y=325+i%2*75;box(c,x,y,55,18,6,'#cf9b9b88','#a176ba88');for(let j=0;j<4;j++)bolt(c,x+7+j*13,y+8,3);}}
 for(let i=0;i<17;i++){let x=rng(i,10)*W,y=489+rng(i,11)*38;fern(c,x,y,.65+rng(i)*.95);if(i%3===0)flower(c,x+9,y,.65,i);}
 c.fillStyle=grad(c,529,71,p.water[0],p.water[1]);c.beginPath();c.moveTo(0,530);for(let x=0;x<=W;x+=5)c.lineTo(x,530+Math.sin(x*.075)*2.5);c.lineTo(W,H);c.lineTo(0,H);c.fill();line(c,Array.from({length:81},(_,i)=>[i*5,530+Math.sin(i*5*.075)*2.5]),'#e6ffff',2.4);
 for(let i=0;i<27;i++){let x=rng(i,20)*W,y=539+rng(i,21)*57;oval(c,x,y,3+rng(i)*7,1.3,'#ffffff42');}
 for(const x of [12,389]){fern(c,x,548,1.8);cap(c,x+(x<100?12:-12),561,1.1);flower(c,x+(x<100?17:-17),548,.95,2);}
 }
 spark(x,y,color='#ffe2a0',n=14){if(this.reduced)return;for(let i=0;i<n&&this.effects.length<130;i++){let a=Math.random()*TAU,v=25+Math.random()*85;this.effects.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-20,life:.45+Math.random()*.4,color,s:1.5+Math.random()*3});}}
 render(g,t,dt,drag){if(!this.w)return;const c=this.ctx,d=this.dpr,l=g.level;c.setTransform(d,0,0,d,0,0);c.fillStyle=['#78ceef','#8edce8','#b4a8ed'][this.index];c.fillRect(0,0,this.w,this.h);c.save();c.translate(this.x,this.y);c.scale(this.scale,this.scale);c.beginPath();c.rect(0,0,W,H);c.clip();c.drawImage(this.bg,0,0,W,H);
 if(!this.reduced){for(let i=0;i<14;i++)oval(c,(rng(i,7)*W+t*(3+rng(i)*7))%W,40+rng(i,8)*380+Math.sin(t+i)*5,1.5,1.5,'#fff9cdaa');for(let i=0;i<3;i++)butterfly(c,20+i*165+Math.sin(t*.65+i)*15,105+i*95+Math.cos(t*1.2+i)*12,t,i);for(let i=0;i<5;i++){let x=(t*10+i*90)%W;line(c,[[x,538+i*9],[x+18,538+i*9]],'#dcf1ce55',1.4);}}
 for(const f of l.floor)terrain(c,...f);
 door(c,l.start.x,l.floor[0][1],false,t);door(c,l.home.x,l.floor[1][1],true,t);
 if(l.kind==='bridge'){const p=l.pivot,ex=p.x+Math.cos(g.angle)*l.length,ey=p.y+Math.sin(g.angle)*l.length;plank(c,p.x,p.y,l.length,g.angle);bolt(c,p.x,p.y,8);const rope=g.rope();if(rope){line(c,[[rope.a.x,rope.a.y],[rope.b.x,rope.b.y]],'#6c4e33',5);line(c,[[rope.a.x,rope.a.y],[rope.b.x,rope.b.y]],'#e7bf81',2.5);bolt(c,rope.a.x,rope.a.y,6);let mx=(rope.a.x+rope.b.x)/2,my=(rope.a.y+rope.b.y)/2;c.strokeStyle='#fff0b5';c.lineWidth=2;c.setLineDash([4,5]);c.beginPath();c.arc(mx,my,20+Math.sin(t*3)*2,0,TAU);c.stroke();c.setLineDash([]);label(c,Math.min(324,mx+37),my+38,'SWIPE TO CUT');}else if(!g.running)label(c,200,315,'Bridge released',true);}
 if(l.kind==='spring'){let x=l.spring.x,y=l.spring.y,q=g.charge;box(c,x-18,y+1,36,9,4,'#724e34');let yy=y-12-30*(1-q);let pts=[[x,yy]];for(let i=0;i<7;i++)pts.push([x+(i%2?10:-10),yy+(y-yy)*(i+1)/8]);pts.push([x,y]);line(c,pts,'#6868b0',5);line(c,pts,'#f2f4ff',2);plank(c,x-19,yy,38,-.12);box(c,180,343,22,96,10,'#5676d7','#e2eaff');box(c,185,349+(1-q)*70,12,15+q*9,5,'#ffbf4f');bolt(c,191,352+(1-q)*70,6);label(c,229,454,'DRAG TO CHARGE',true);const v=springVelocity(q);for(let i=1;i<=19;i++){let tt=i*.065,px=x+v.vx*tt,py=y-R+v.vy*tt+265*tt*tt;if(px>390||py>528)break;oval(c,px,py,2.1,2.1,'#fff1a8cc');}label(c,218,331,Math.round(q*100)+'%');}
 if(l.kind==='lift'){const p=l.lift,yy=g.liftY;box(c,p.x-3,p.top-8,6,p.y-p.top+14,3,'#96734d');let pulleyY=133,wx=302,wy=155+g.weightY;line(c,[[p.x,yy],[p.x,pulleyY],[wx,pulleyY],[wx,wy]],'#785a36',4);line(c,[[p.x,yy],[p.x,pulleyY],[wx,pulleyY],[wx,wy]],'#e4bc7a',1.8);bolt(c,p.x,pulleyY,9);bolt(c,wx,pulleyY,9);plank(c,p.x-p.width/2,yy,p.width,0);oval(c,wx,wy+15,14,17,radial(c,wx,wy+15,19,'#dfb674','#94663c'));box(c,wx-13,wy,26,9,4,'#806345');if(g.pin){line(c,[[wx-12,150],[wx+18,150]],'#e3bf7c',6);oval(c,wx+22,150,8,8,'#ffca45');oval(c,wx+22,150,4,4,'#a66a43');label(c,279,110,'PULL PIN');}else if(!g.liftReady)label(c,201,yy+34,'Load the lift',true);}
 const live=g.agents.filter(a=>a.state==='live');if(!g.running){for(let i=0;i<Math.min(l.count,3);i++)mouse(c,l.start.x-32+i*32,l.floor[0][1]-R,i,t,false);}for(const a of live)mouse(c,a.x,a.y,a.id,t,!a.grounded&&!a.onLift,a.vx<0?-1:1);
 for(const ev of g.events.splice(0)){if(ev.type==='saved')this.spark(ev.x,ev.y,['#ffe44d','#ff72be','#7af6d2'][this.index],28);else if(ev.type==='lost')this.spark(ev.x,Math.min(ev.y,532),'#b6e6db',14);else if(ev.type!=='release')this.spark(ev.x,ev.y,ev.type==='cut'?'#f4d5a0':'#e5d0a0',12);}
 this.effects=this.effects.filter(p=>{p.life-=dt;if(p.life<=0)return false;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;c.globalAlpha=Math.min(1,p.life*2);oval(c,p.x,p.y,p.s,p.s*.7,p.color);c.globalAlpha=1;return true;});
 if(drag?.points?.length>1){c.globalAlpha=.85;line(c,drag.points.map(p=>[p.x,p.y]),'#fff6cb',3.5);c.globalAlpha=1;}c.restore();}
}
