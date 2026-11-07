'use strict';
/*
  Detailed nest cross-section renderer for COLONY.
  Each chamber is part of a shared tunnel graph; every displayed moving ant
  corresponds to a living member of the player's colony. No external art.
*/
(() => {
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const round = v => Math.round(v);
  let cached = null;
  const landscape = {
    width: 980, height: 680, surface: 106,
    entrance: {x: 490, y: 142},
    chambers: [
      {id: 'queen', name: 'ROYAL CHAMBER', x: 478, y: 266, rx: 113, ry: 69},
      {id: 'storage', name: 'GRANARY', x: 193, y: 310, rx: 128, ry: 69},
      {id: 'nursery', name: 'EGG NURSERY', x: 763, y: 310, rx: 133, ry: 72},
      {id: 'barracks', name: 'SOLDIER GALLERY', x: 220, y: 515, rx: 127, ry: 68},
      {id: 'larvae', name: 'LARVAE + PUPAE', x: 520, y: 520, rx: 133, ry: 76},
      {id: 'refuse', name: 'WASTE CHAMBER', x: 822, y: 539, rx: 100, ry: 60}
    ],
    edges: [['entrance','queen'], ['queen','storage'], ['queen','nursery'],
            ['storage','barracks'],['queen','larvae'],['nursery','larvae'],
            ['nursery','refuse'],['larvae','barracks']]
  };
  const portrait = {
    width: 610, height: 930, surface: 108,
    entrance: {x: 305, y: 142},
    chambers: [
      {id: 'queen', name: 'ROYAL CHAMBER', x: 305, y: 265, rx: 127, ry: 66},
      {id: 'storage', name: 'GRANARY', x: 155, y: 446, rx: 126, ry: 71},
      {id: 'nursery', name: 'EGG NURSERY', x: 457, y: 450, rx: 128, ry: 71},
      {id: 'barracks', name: 'SOLDIER GALLERY', x: 151, y: 652, rx: 123, ry: 71},
      {id: 'larvae', name: 'LARVAE + PUPAE', x: 454, y: 655, rx: 127, ry: 74},
      {id: 'refuse', name: 'WASTE CHAMBER', x: 304, y: 830, rx: 125, ry: 58}
    ],
    edges: [['entrance','queen'], ['queen','storage'], ['queen','nursery'],
            ['storage','barracks'], ['nursery','larvae'], ['barracks','refuse'],
            ['larvae','refuse'], ['storage','larvae']]
  };
  const rooms = new Map();
  function configuration(w, h) {
    const model = w / h > 1.12 ? landscape : portrait;
    const scale = Math.min(w / model.width, h / model.height);
    return { model, scale, dx: (w-model.width*scale)/2, dy: (h-model.height*scale)/2 };
  }
  function mapPoint(name, model) {
    if (name === 'entrance') return model.entrance;
    return model.chambers.find(room => room.id === name);
  }
  function segmentCurve(ctx, a, b) {
    const dy = b.y - a.y, dx = b.x - a.x;
    const bend = Math.min(90, Math.abs(dx)*0.26+Math.abs(dy)*0.12);
    ctx.moveTo(a.x,a.y);
    ctx.bezierCurveTo(a.x + Math.sign(dx)*bend, a.y+dy*.44,
                      b.x - Math.sign(dx)*bend, b.y-dy*.44, b.x,b.y);
  }
  function tunnelPosition(a,b,t) {
    const dx=b.x-a.x,dy=b.y-a.y;
    const bend=Math.min(90,Math.abs(dx)*.26+Math.abs(dy)*.12);
    const p1={x:a.x+Math.sign(dx)*bend,y:a.y+dy*.44};
    const p2={x:b.x-Math.sign(dx)*bend,y:b.y-dy*.44};
    const u=1-t;
    const x=u*u*u*a.x+3*u*u*t*p1.x+3*u*t*t*p2.x+t*t*t*b.x;
    const y=u*u*u*a.y+3*u*u*t*p1.y+3*u*t*t*p2.y+t*t*t*b.y;
    const vx=3*u*u*(p1.x-a.x)+6*u*t*(p2.x-p1.x)+3*t*t*(b.x-p2.x);
    const vy=3*u*u*(p1.y-a.y)+6*u*t*(p2.y-p1.y)+3*t*t*(b.y-p2.y);
    return {x,y,angle:Math.atan2(vy,vx)};
  }
  function seedRandom(seed) {
    let s = seed >>> 0;
    return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  }
  function oval(ctx,x,y,rx,ry,fill) {
    ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);
    if (fill) {ctx.fillStyle=fill;ctx.fill();}
  }
  function rock(ctx,x,y,r,rand) {
    const height=r*.72;
    ctx.fillStyle='#3c2e258a';ctx.beginPath();ctx.ellipse(x+2,y+4,r*1.16,height,0,0,TAU);ctx.fill();
    const g=ctx.createLinearGradient(x-r,y-r,x+r,y+r);
    g.addColorStop(0,'#c2aa80');g.addColorStop(.6,'#897054');g.addColorStop(1,'#624b3b');
    ctx.fillStyle=g;ctx.beginPath();
    ctx.moveTo(x-r*.9,y+height*.1);ctx.lineTo(x-r*.6,y-height*.65);
    ctx.lineTo(x+r*.25,y-height);ctx.lineTo(x+r,y-height*.14);
    ctx.lineTo(x+r*.8,y+height*.8);ctx.lineTo(x-r*.4,y+height);ctx.closePath();ctx.fill();
    if(rand>.5){ctx.strokeStyle='#eee2ba76';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-r*.45,y-height*.37);ctx.lineTo(x+r*.1,y-height*.62);ctx.stroke();}
  }
  function background(ctx, model, state) {
    const w=model.width,h=model.height,random=seedRandom(8013);
    const earth=ctx.createLinearGradient(0,0,0,h);
    earth.addColorStop(0,'#b78b5e');earth.addColorStop(.22,'#916748');
    earth.addColorStop(.65,'#6d4735');earth.addColorStop(1,'#463124');
    ctx.fillStyle=earth;ctx.fillRect(0,0,w,h);
    for(let i=0;i<14500;i++){
      const x=random()*w,y=model.surface+random()*(h-model.surface);
      const size=.4+random()*2.2;
      ctx.fillStyle=i%3===0?'#ffe4a711':i%3===1?'#2e1d181d':'#f3c88c15';
      ctx.fillRect(x,y,size,size);
    }
    ctx.lineWidth=6;ctx.strokeStyle='#322d2560';
    for(let layer=0;layer<6;layer++){
      const y=model.surface+58+layer*(h-model.surface-90)/6;
      ctx.beginPath();ctx.moveTo(-20,y);
      for(let x=0;x<w+45;x+=36)ctx.quadraticCurveTo(x+14,y-8+random()*16,x+36,y+random()*7);
      ctx.stroke();
    }
    for(let i=0;i<150;i++){
      const x=15+random()*(w-30),y=model.surface+18+random()*(h-model.surface-30);
      const r=1.7+random()*8;
      rock(ctx,x,y,r,random());
    }
    // Surface grass and skylight.
    const sky=ctx.createLinearGradient(0,0,0,model.surface);
    sky.addColorStop(0,'#a4c0a3');sky.addColorStop(1,'#d5d6ac');
    ctx.fillStyle=sky;ctx.fillRect(0,0,w,model.surface-16);
    ctx.fillStyle='#536a3d';ctx.fillRect(0,model.surface-16,w,16);
    ctx.fillStyle='#779447';ctx.fillRect(0,model.surface-18,w,7);
    for(let i=0;i<300;i++){
      const x=random()*w,y=model.surface-12;
      ctx.strokeStyle=random()>.4?'#5e8d43':'#759e50';ctx.lineWidth=.7+random()*1.6;
      ctx.beginPath();ctx.moveTo(x,y);
      ctx.quadraticCurveTo(x-7+random()*14,y-7,x-7+random()*14,y-5-random()*18);
      ctx.stroke();
    }
    // Surface mound: soil excavated by the workers.
    const en=model.entrance;
    ctx.beginPath();ctx.moveTo(en.x-86,model.surface-16);
    ctx.quadraticCurveTo(en.x-63,model.surface-51,en.x,model.surface-48);
    ctx.quadraticCurveTo(en.x+60,model.surface-48,en.x+88,model.surface-16);
    ctx.closePath();ctx.fillStyle='#866143';ctx.fill();
    oval(ctx,en.x,model.surface-38,21,9,'#2c211b');
    // Roots branch downward around the outside of the excavation.
    for(let i=0;i<26;i++){
      const x=random()*w,y=model.surface-18,len=32+random()*(h*.38);
      if(Math.abs(x-en.x)<80)continue;
      ctx.beginPath();ctx.moveTo(x,y);
      ctx.bezierCurveTo(x-12+random()*24,y+len*.30,
                        x-35+random()*70,y+len*.65,
                        x-25+random()*50,y+len);
      ctx.strokeStyle=i%3?'#4e3528':'#6b4c31';
      ctx.lineWidth=1.5+random()*3;ctx.stroke();
    }
  }
  function tunnel(ctx,a,b){
    ctx.lineJoin='round';ctx.lineCap='round';
    const widths=[51,43,30],colors=['#39251d','#b58b5d','#5a3d2a'];
    for(let i=0;i<widths.length;i++){
      ctx.beginPath();segmentCurve(ctx,a,b);
      ctx.strokeStyle=colors[i];ctx.lineWidth=widths[i];ctx.stroke();
    }
    ctx.beginPath();segmentCurve(ctx,a,b);ctx.lineWidth=5;ctx.strokeStyle='#e4bc7b22';ctx.stroke();
  }
  function chamberPath(ctx,room,seed=0){
    const {x,y,rx,ry}=room;
    ctx.beginPath();
    ctx.moveTo(x-rx,y-ry*.15);
    ctx.bezierCurveTo(x-rx*1.08,y-ry*.87,x-rx*.60,y-ry*1.05,x,y-ry*.99);
    ctx.bezierCurveTo(x+rx*.81,y-ry*1.12,x+rx*1.1,y-ry*.65,x+rx,y+ry*.13);
    ctx.bezierCurveTo(x+rx*.94,y+ry*.94,x+rx*.30,y+ry*1.10,x-rx*.1,y+ry);
    ctx.bezierCurveTo(x-rx*.77,y+ry*.96,x-rx*1.07,y+ry*.54,x-rx,y-ry*.15);
    ctx.closePath();
  }
  function drawChamber(ctx,room,highlight){
    ctx.save();
    ctx.shadowBlur=20;ctx.shadowColor='#22170fbb';ctx.shadowOffsetY=8;
    chamberPath(ctx,room);
    ctx.fillStyle='#39261d';ctx.fill();
    ctx.restore();
    chamberPath(ctx,room);ctx.strokeStyle='#c3a477';ctx.lineWidth=13;ctx.stroke();
    chamberPath(ctx,room);
    const lit=ctx.createRadialGradient(room.x-room.rx*.2,room.y-room.ry*.25,4,room.x,room.y,room.rx*1.15);
    lit.addColorStop(0,'#c39660');lit.addColorStop(.55,'#a57a50');lit.addColorStop(1,'#62412f');
    ctx.fillStyle=lit;ctx.fill();
    ctx.save();chamberPath(ctx,room);ctx.clip();
    const rng=seedRandom(room.x*99+room.y*11);
    for(let i=0;i<50;i++){
      const x=room.x+(rng()-.5)*room.rx*2,y=room.y+(rng()-.5)*room.ry*2;
      oval(ctx,x,y,1+rng()*2,1+rng()*1.5,i%3?'#e8bc7d30':'#5e34242b');
    }
    ctx.restore();
    if(highlight){chamberPath(ctx,room);ctx.strokeStyle='#e7f0a7';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);}
  }
  function ant(ctx,x,y,scale,angle,color,carry=false,isQueen=false){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);
    const leg=isQueen?'#4e2b20':color;
    ctx.strokeStyle=leg;ctx.lineCap='round';ctx.lineWidth=1.75;
    for(let i=-1;i<=1;i++){
      ctx.beginPath();ctx.moveTo(-3,i*3);ctx.lineTo(-10,i*7-7);
      ctx.moveTo(2,i*3);ctx.lineTo(6,i*7+7);ctx.stroke();
    }
    ctx.lineWidth=1.35;ctx.beginPath();
    ctx.moveTo(9,-3);ctx.quadraticCurveTo(15,-11,19,-12);
    ctx.moveTo(9,3);ctx.quadraticCurveTo(15,11,19,12);ctx.stroke();
    const shiny=ctx.createLinearGradient(-14,-7,11,8);
    shiny.addColorStop(0,isQueen?'#82553b':'#6f4737');
    shiny.addColorStop(.48,color);
    shiny.addColorStop(1,'#241e18');
    oval(ctx,-10,0,isQueen?10:7,isQueen?7:5,shiny);
    oval(ctx,0,0,isQueen?7:5,4,color);
    oval(ctx,10,0,isQueen?8:6,isQueen?7:5,shiny);
    oval(ctx,12,-2,1.3,1.3,'#ffe2a1');
    if(carry){oval(ctx,-20,-9,5,4,'#c5e187');oval(ctx,-21,-10,2,1,'#f5eaa5');}
    ctx.restore();
  }
  function label(ctx,room,value){
    const title=room.name;
    const x=room.x,y=room.y-room.ry-17;
    ctx.font='800 12px system-ui,sans-serif';ctx.textAlign='center';
    const width=ctx.measureText(title).width+25;
    ctx.fillStyle='#1c2721db';
    ctx.beginPath();ctx.roundRect(x-width/2,y-15,width,25,7);ctx.fill();
    ctx.fillStyle='#f1e8ca';ctx.fillText(title,x,y+2);
    if(value){
      ctx.font='700 10px system-ui,sans-serif';
      ctx.fillStyle='#f2d899';ctx.fillText(value,room.x,room.y+room.ry-12);
    }
  }
  function content(ctx,room,state){
    const cx=room.x,cy=room.y;
    const ants=state.ants||[],workers=ants.filter(a=>a.side==='black'&&a.caste==='worker'&&a.health>0).length;
    const soldiers=ants.filter(a=>a.side==='black'&&a.caste==='soldier'&&a.health>0).length;
    const levels=state.upgrades||{};
    if(room.id==='queen'){
      // Crowned queen has enlarged gaster and attendants on both sides.
      ant(ctx,cx-8,cy+5,2.05,-.14,'#39271e',false,true);
      for(let i=0;i<5;i++)ant(ctx,cx-70+i*30,cy+34+(i%2)*7,.61,(i%2)*1.1,'#2b231e');
      for(let i=0;i<11;i++)oval(ctx,cx+20+(i%5)*8,cy-32+Math.floor(i/5)*9,3.5,5.6,'#f9e5b4');
      label(ctx,room,round(state.queen)+'% queen health');
    }else if(room.id==='storage'){
      const piles=Math.min(55,Math.ceil(state.food/5));
      for(let i=0;i<piles;i++){
        const row=Math.floor(i/11),col=i%11;
        const x=cx-63+col*12+(row%2)*5,y=cy-3+row*7;
        oval(ctx,x,y,3.2,5.2,i%3===0?'#e8bc64':'#a8b966');
        ctx.strokeStyle='#735b35';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(x-1,y-1);ctx.lineTo(x+1,y+2);ctx.stroke();
      }
      if(levels.storage){for(let i=0;i<levels.storage;i++){ctx.strokeStyle='#e0cb8c';ctx.lineWidth=3;ctx.strokeRect(cx-91+i*10,cy-40,8,21);}}
      label(ctx,room,Math.floor(state.food)+' / '+(250+(levels.storage||0)*150)+' food');
    }else if(room.id==='nursery'){
      const eggs=Math.max(6,Math.min(33,(state.eggs||[]).filter(e=>e.side==='black').length*3+8));
      for(let i=0;i<eggs;i++){
        const row=Math.floor(i/9),col=i%9;
        const x=cx-61+col*15+(row%2)*5,y=cy-19+row*14;
        oval(ctx,x,y,5.1,7.6,i%4===0?'#f6ddb3':'#f9ead2');
        oval(ctx,x-1,y-2,1.7,3,'#fff8e7');
      }
      for(let i=0;i<Math.min(5,workers/4);i++)ant(ctx,cx-59+i*30,cy+35,.65,Math.sin(state.phase+i)*.5,'#2c2924');
      label(ctx,room,(state.eggs||[]).filter(e=>e.side==='black').length+' incubating');
    }else if(room.id==='barracks'){
      for(let i=0;i<Math.min(10,soldiers);i++){
        const x=cx-69+(i%5)*35,y=cy-20+Math.floor(i/5)*31;
        ant(ctx,x,y,.95,Math.cos(state.phase*.5+i)*.35,'#3a2925');
      }
      // Stone barricades reflect entrance reinforcement.
      const stacks=1+(levels.gate||0)*2;
      for(let i=0;i<stacks;i++)rock(ctx,cx-54+i*18,cy+43,8,i*.23);
      label(ctx,room,soldiers+' soldiers');
    }else if(room.id==='larvae'){
      for(let i=0;i<13;i++){
        const x=cx-70+(i%7)*22,y=cy-16+Math.floor(i/7)*33;
        ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(i)*.2);
        const pale=ctx.createLinearGradient(0,-10,0,10);
        pale.addColorStop(0,'#fff0d0');pale.addColorStop(1,'#dec6a5');
        oval(ctx,0,0,9,13,pale);
        ctx.strokeStyle='#b7a486';ctx.lineWidth=.75;
        for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(-7,k*5);ctx.lineTo(7,k*5);ctx.stroke();}
        ctx.restore();
      }
      label(ctx,room,'Growing brood');
    }else if(room.id==='refuse'){
      for(let i=0;i<13;i++){
        const x=cx-45+(i%5)*22,y=cy+(Math.floor(i/5))*11;
        rock(ctx,x,y,3+i%4,i*.1);
      }
      label(ctx,room,'Waste & soil');
    }
  }
  function buildCache(ctx,model,state) {
    const picture=document.createElement('canvas');
    picture.width=model.width;picture.height=model.height;
    const g=picture.getContext('2d');
    background(g,model,state);
    for(const [start,end] of model.edges)tunnel(g,mapPoint(start,model),mapPoint(end,model));
    for(const room of model.chambers)drawChamber(g,room,false);
    return picture;
  }
  function drawTraffic(ctx,model,state){
    const members=(state.ants||[]).filter(a=>a.side==='black'&&a.health>0);
    const paths=model.edges;
    const count=Math.min(45,members.length);
    const phase=state.phase||0;
    for(let i=0;i<count;i++){
      const antState=members[i],id=antState.id||i;
      const edge=paths[Math.abs(id)%paths.length];
      const a=mapPoint(edge[0],model),b=mapPoint(edge[1],model);
      let t=(phase*(antState.caste==='soldier'?.09:.12)+(id*.137))%2;
      if(t>1)t=2-t;
      const pos=tunnelPosition(a,b,t);
      const tangent=pos.angle+(Math.sin(phase*.38+id)>0?0:Math.PI);
      ant(ctx,pos.x,pos.y,antState.caste==='soldier'?.74:.61,tangent,'#33271f',!!antState.carry);
    }
    // Scouts/foragers march across the mound, visible from inside the cutaway.
    const en=model.entrance;
    for(let i=0;i<Math.min(5,members.length);i++){
      const progress=((phase*.035+i*.21)%1);
      ant(ctx,progress*model.width,en.y-63+Math.sin(progress*12+i)*2,.72,progress<.5?0:Math.PI,'#302720',i===1);
    }
  }
  function draw(ctx,w,h,state){
    if(w<40||h<40)return;
    const layout=configuration(w,h),model=layout.model,up=state.upgrades||{};
    const key=[model.width,model.height,up.nursery||0,up.storage||0,up.gate||0].join(':');
    if(!cached||cached.key!==key){
      cached={key,image:buildCache(ctx,model,state)};
    }
    ctx.save();
    ctx.fillStyle='#312b22';ctx.fillRect(0,0,w,h);
    ctx.translate(layout.dx,layout.dy);ctx.scale(layout.scale,layout.scale);
    ctx.drawImage(cached.image,0,0);
    for(const room of model.chambers)content(ctx,room,state);
    drawTraffic(ctx,model,state);
    const highlight=model.chambers.find(r=>r.id===state.highlight);
    if(highlight)drawChamberOutline(ctx,highlight);
    ctx.restore();
  }
  function drawChamberOutline(ctx,room){
    ctx.save();chamberPath(ctx,room);
    ctx.strokeStyle='#f0e59a';ctx.lineWidth=4;ctx.setLineDash([10,6]);ctx.stroke();
    ctx.setLineDash([]);ctx.restore();
  }
  function pick(x,y,w,h){
    const layout=configuration(w,h),mx=(x-layout.dx)/layout.scale,my=(y-layout.dy)/layout.scale;
    let found=null;
    for(const room of layout.model.chambers){
      const dx=(mx-room.x)/room.rx,dy=(my-room.y)/room.ry;
      if(dx*dx+dy*dy<=1.15)found=room.id;
    }
    return found;
  }
  window.ColonyNest={draw,pick};
})();