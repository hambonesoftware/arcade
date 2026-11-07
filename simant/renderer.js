'use strict';
/* COLONY: First Light — original procedural surface + physically excavated underground renderer. */
(() => {
  const K=window.ColonyEngine.constants,TAU=Math.PI*2;
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),dst=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const views={surface:{w:K.SW,h:K.SH},nest:{w:K.C*K.CELL,h:K.R*K.CELL}};
  const backgrounds={};
  function random(seed){let n=seed>>>0;return()=>((n=(Math.imul(1664525,n)+1013904223)>>>0)/4294967296);}
  function fit(view,w,h,camera){
    const world=views[view],scale=Math.max(w/world.w,h/world.h)*camera.zoom;
    return {scale,offsetX:w*.5-world.w*scale*.5+camera.x,offsetY:h*.5-world.h*scale*.5+camera.y};
  }
  function locate(x,y,view,w,h,camera){const t=fit(view,w,h,camera);return{x:(x-t.offsetX)/t.scale,y:(y-t.offsetY)/t.scale};}
  function pan(camera,dx,dy,view,w,h){camera.x+=dx;camera.y+=dy;limit(camera,view,w,h);}
  function limit(camera,view,w,h){
    const world=views[view],sc=Math.max(w/world.w,h/world.h)*camera.zoom;
    const spanW=world.w*sc,spanH=world.h*sc;
    camera.x=clamp(camera.x,-Math.max(0,(spanW-w)/2)-70,Math.max(0,(spanW-w)/2)+70);
    camera.y=clamp(camera.y,-Math.max(0,(spanH-h)/2)-70,Math.max(0,(spanH-h)/2)+70);
  }
  function zoom(camera,factor,p,view,w,h){
    const old=locate(p.x,p.y,view,w,h,camera);
    camera.zoom=clamp(camera.zoom*factor,1,3.8);
    const next=fit(view,w,h,camera);
    camera.x+=p.x-(old.x*next.scale+next.offsetX);
    camera.y+=p.y-(old.y*next.scale+next.offsetY);
    limit(camera,view,w,h);
  }
  function circ(ctx,x,y,r,fill){ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=fill;ctx.fill();}
  function ellipse(ctx,x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=color;ctx.fill();}
  function surfaceBackground(s){
    const canvas=document.createElement('canvas');canvas.width=K.SW;canvas.height=K.SH;
    const g=canvas.getContext('2d'),r=random(s.seed+571);
    let bg=g.createLinearGradient(0,0,K.SW,K.SH);bg.addColorStop(0,'#9a835a');bg.addColorStop(.48,'#a68a5c');bg.addColorStop(1,'#716949');
    g.fillStyle=bg;g.fillRect(0,0,K.SW,K.SH);
    for(let i=0;i<16000;i++){
      const x=r()*K.SW,y=r()*K.SH,v=r();
      g.fillStyle=v>.7?'#302b202a':v>.35?'#f1c99223':'#4060341c';
      const width=1+r()*3;g.fillRect(x,y,width,width);
    }
    for(let i=0;i<260;i++){
      const x=r()*K.SW,y=r()*K.SH,size=3+r()*14;
      g.fillStyle='#1e2b1933';g.beginPath();g.ellipse(x+3,y+5,size+2,size*.65,0,0,TAU);g.fill();
      g.fillStyle=i%3===0?'#9d9c80':'#aaa17e';g.beginPath();g.ellipse(x,y,size,size*.6,r()*TAU,0,TAU);g.fill();
      g.strokeStyle='#ffffff36';g.lineWidth=.8;g.beginPath();g.moveTo(x-size*.4,y-size*.2);g.lineTo(x+size*.25,y-size*.4);g.stroke();
    }
    for(let i=0;i<600;i++){
      const x=r()*K.SW,y=r()*K.SH,size=4+r()*18;
      g.strokeStyle=i%4===0?'#a5b274':'#4c6a39';
      g.lineWidth=1+r()*2;g.lineCap='round';g.beginPath();g.moveTo(x,y);
      g.quadraticCurveTo(x+size*.3,y-size*.7,x-size*.2+r()*size*.5,y-size);g.stroke();
      if(i%5===0){ellipse(g,x,y-5,4.8,2.8,'#728344');ellipse(g,x+4,y-9,4.5,2.5,'#82964e');}
    }
    const sh=g.createRadialGradient(K.PORTAL.x,K.PORTAL.y,5,K.PORTAL.x,K.PORTAL.y,156);
    sh.addColorStop(0,'#e3c38d65');sh.addColorStop(1,'#d9b47f00');g.fillStyle=sh;g.fillRect(K.PORTAL.x-156,K.PORTAL.y-156,312,312);
    return canvas;
  }
  function nestBackground(s){
    const canvas=document.createElement('canvas');canvas.width=views.nest.w;canvas.height=views.nest.h;
    const g=canvas.getContext('2d'),r=random(s.seed+803),w=canvas.width,h=canvas.height;
    const fill=g.createLinearGradient(0,0,0,h);
    fill.addColorStop(0,'#a98058');fill.addColorStop(.5,'#765139');fill.addColorStop(1,'#4b342a');g.fillStyle=fill;g.fillRect(0,0,w,h);
    for(let i=0;i<16000;i++){
      const x=r()*w,y=r()*h,size=r()*2+1;
      g.fillStyle=i%3===0?'#f0bf7222':i%3===1?'#2e201a2e':'#f8e1ad13';
      g.fillRect(x,y,size,size);
    }
    for(let i=0;i<8;i++){
      const y=30+i*55;g.beginPath();g.moveTo(0,y);
      for(let x=0;x<=w;x+=34)g.lineTo(x,y+Math.sin(x*.047+i)*4);
      g.lineWidth=3;g.strokeStyle=i%2?'#38291e45':'#e7b78217';g.stroke();
    }
    for(let i=0;i<110;i++){
      const x=r()*w,y=r()*h,sz=3+r()*8;ellipse(g,x+2,y+2,sz,sz*.65,'#2e241b3c');
      ellipse(g,x,y,sz,sz*.61,i%3===0?'#af9570':'#826e57');
    }
    for(let i=0;i<26;i++){
      const x=r()*w,y=0,len=40+r()*220;
      g.strokeStyle=i%3?'#533523':'#674126';g.lineWidth=1.5+r()*3;g.beginPath();g.moveTo(x,y);
      g.bezierCurveTo(x-20+r()*40,len*.3,x-22+r()*44,len*.7,x-35+r()*70,len);g.stroke();
    }
    return canvas;
  }
  function ant(ctx,a,time,selected=false){
    const scout=a.role==='scout',soldier=a.role==='soldier',enemy=a.side==='red';
    const size=scout?1.25:soldier?1.12:a.role==='raider'?1.08:1;
    ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.angle||Math.sin(time*.5+a.id)*.2);ctx.scale(size,size);
    ctx.lineCap='round';ctx.strokeStyle=enemy?'#a44932':scout?'#b28f3c':'#221c18';ctx.lineWidth=1.8;
    for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(-3,i*3);ctx.lineTo(-12,i*8-5);ctx.moveTo(2,i*3);ctx.lineTo(8,i*8+5);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(10,-3);ctx.lineTo(17,-10);ctx.moveTo(10,3);ctx.lineTo(17,10);ctx.stroke();
    const g=ctx.createLinearGradient(-12,-9,12,9);
    if(enemy){g.addColorStop(0,'#ef8062');g.addColorStop(.6,'#a53f36');g.addColorStop(1,'#5b2622');}
    else if(scout){g.addColorStop(0,'#fff1a7');g.addColorStop(.6,'#e9bc53');g.addColorStop(1,'#92702d');}
    else{g.addColorStop(0,'#72604a');g.addColorStop(.6,'#2a2925');g.addColorStop(1,'#161b18');}
    ellipse(ctx,-9,0,soldier?7.5:6.5,soldier?6:5.2,g);
    ellipse(ctx,0,0,5,4.8,g);ellipse(ctx,9,0,soldier?7:6,5.3,g);
    circ(ctx,12,-2,1.25,'#fff0b3');circ(ctx,12,2,1.25,'#fff0b3');
    if(a.carry){ellipse(ctx,-17,-7,6,5,'#c1d970');circ(ctx,-18,-9,2,'#f5ed9e');}
    ctx.restore();
    if(selected){ctx.save();ctx.strokeStyle='#ffec94';ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(a.x,a.y,23,17,0,0,TAU);ctx.stroke();
      ctx.fillStyle='#231b17';ctx.fillRect(a.x-17,a.y-26,34,4);ctx.fillStyle='#aadd7e';ctx.fillRect(a.x-17,a.y-26,34*Math.max(0,a.hp/a.maxHP),4);ctx.restore();}
  }
  function food(ctx,node,time){
    if(node.amount<=0)return;
    circ(ctx,node.x+3,node.y+6,24,'#3345214a');
    for(let i=0;i<Math.min(24,Math.ceil(node.amount/5));i++){
      const angle=i*2.399,rad=Math.sqrt(i)*4.3,x=node.x+Math.cos(angle)*rad,y=node.y+Math.sin(angle)*rad;
      ellipse(ctx,x,y,5,3.2,i%4===0?'#c7d78b':'#8eae5f');
      ctx.strokeStyle='#4c6533';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-2,y);ctx.lineTo(x+3,y);ctx.stroke();
    }
    ctx.fillStyle='#192619d6';ctx.font='bold 11px system-ui';ctx.textAlign='center';
    ctx.fillText(Math.ceil(node.amount),node.x,node.y-30);
  }
  function surface(ctx,s,time){
    if(!backgrounds.surface||backgrounds.surface.seed!==s.seed)backgrounds.surface={seed:s.seed,image:surfaceBackground(s)};
    ctx.drawImage(backgrounds.surface.image,0,0);
    // Large navigational landmarks are readable at phone zoom.
    ctx.save();ctx.translate(K.PORTAL.x,K.PORTAL.y);
    ellipse(ctx,2,11,77,53,'#362c1f45');ellipse(ctx,0,2,65,44,'#927450');
    ellipse(ctx,0,0,48,27,'#4b3728');ellipse(ctx,0,1,28,16,'#1f211b');
    for(let i=0;i<13;i++){const a=i*2.4,r=25+(i%4)*8;circ(ctx,Math.cos(a)*r,Math.sin(a)*r,3+i%4,'#bea076');}
    ctx.font='800 15px system-ui';ctx.textAlign='center';ctx.strokeStyle='#392c19';ctx.lineWidth=4;
    ctx.strokeText('YOUR NEST',0,-64);ctx.fillStyle='#f6f1c9';ctx.fillText('YOUR NEST',0,-64);
    ctx.restore();
    for(const node of s.foodNodes)food(ctx,node,time);
    if(s.mission.step>=2){
      ctx.save();ctx.setLineDash([13,9]);ctx.strokeStyle='#ecdc84';ctx.lineWidth=4;
      ctx.beginPath();ctx.arc(K.BORDER.x,K.BORDER.y,K.BORDER.r+Math.sin(time*3)*3,0,TAU);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#fff6c9';ctx.font='800 16px system-ui';ctx.textAlign='center';ctx.fillText('BORDER CACHE',K.BORDER.x,K.BORDER.y-103);ctx.restore();
    }
    if(s.mission.step>=4){
      ctx.save();ctx.translate(K.OUTPOST.x,K.OUTPOST.y);
      const alive=s.mission.outpostHealth>0;
      ellipse(ctx,4,9,57,49,'#23171655');ellipse(ctx,0,0,48,39,alive?'#974f39':'#6d5e47');
      ellipse(ctx,0,0,32,23,alive?'#431e1b':'#2c3624');
      if(alive){for(let i=0;i<10;i++){let a=i*TAU/10;ellipse(ctx,Math.cos(a)*39,Math.sin(a)*30,8,5,i%2?'#c86953':'#6b2d2b');}}
      ctx.strokeStyle=alive?'#e2785b':'#bde792';ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(0,0,59+Math.sin(time*3)*2,0,TAU);ctx.stroke();
      ctx.textAlign='center';ctx.font='800 14px system-ui';ctx.fillStyle='#ffe8cf';
      ctx.fillText(alive?'RED OUTPOST':'CAPTURE SITE',0,-65);
      if(alive){ctx.fillStyle='#43201c';ctx.fillRect(-37,-50,74,6);ctx.fillStyle='#e17e59';ctx.fillRect(-37,-50,74*s.mission.outpostHealth/95,6);}
      ctx.restore();
    }else{
      ctx.save();ctx.globalAlpha=.85;ctx.translate(K.OUTPOST.x,K.OUTPOST.y);
      ellipse(ctx,0,0,46,29,'#9b624f');ellipse(ctx,0,0,22,11,'#6a3b33');
      ctx.restore();
    }
    drawEntities(ctx,s,'surface',time);
    if(s.mission.step===3){ctx.fillStyle='#f9b78b';ctx.font='900 18px system-ui';ctx.textAlign='center';
      ctx.fillText('RED RAID IN PROGRESS',K.PORTAL.x+130,K.PORTAL.y-145);}
  }
  function underground(ctx,s,time){
    if(!backgrounds.nest||backgrounds.nest.seed!==s.seed)backgrounds.nest={seed:s.seed,image:nestBackground(s)};
    const cell=K.CELL,cells=s.nest.cells,queue=s.nest.digQueue;
    ctx.drawImage(backgrounds.nest.image,0,0);
    // Light excavated passages, with unexcavated matrix visible between them.
    const g=ctx.createLinearGradient(0,0,0,K.R*cell);g.addColorStop(0,'#c8a26c');g.addColorStop(.8,'#b08153');g.addColorStop(1,'#876044');
    for(let row=0;row<K.R;row++)for(let col=0;col<K.C;col++){
      if(!cells[row*K.C+col])continue;
      const x=col*cell,y=row*cell,openLeft=col>0&&cells[row*K.C+col-1],openTop=row>0&&cells[(row-1)*K.C+col];
      ctx.fillStyle='#301f1780';ctx.fillRect(x-1,y-1,cell+2,cell+2);
      ctx.fillStyle=g;ctx.fillRect(x+1,y+1,cell-2,cell-2);
      if(openLeft){ctx.fillRect(x-4,y+3,7,cell-6);}
      if(openTop){ctx.fillRect(x+3,y-4,cell-6,7);}
      if(!openTop){ctx.strokeStyle='#e5bd7e88';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+4,y+2);ctx.lineTo(x+cell-3,y+2);ctx.stroke();}
      if(!openLeft){ctx.strokeStyle='#58382388';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+2,y+5);ctx.lineTo(x+2,y+cell-4);ctx.stroke();}
    }
    // The entrance is a real corridor between environments.
    circ(ctx,K.NEST_ENT.x,K.NEST_ENT.y,16,'#31271c');
    ctx.save();ctx.font='800 15px system-ui';ctx.fillStyle='#ffecc3';ctx.textAlign='center';
    ctx.fillText('SURFACE ENTRANCE',K.NEST_ENT.x,22);ctx.restore();
    // Royal queen: deliberately dominant in the cutaway.
    const q=K.QUEEN;
    ellipse(ctx,q.x,q.y,51,36,'#4b342687');ellipse(ctx,q.x,q.y,43,27,'#e5bf8760');
    ctx.save();ctx.translate(q.x,q.y);ctx.rotate(-.13);ctx.strokeStyle='#3d291f';ctx.lineWidth=4;
    for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-5,i*6);ctx.lineTo(-32,i*10-5);ctx.moveTo(6,i*6);ctx.lineTo(31,i*10+5);ctx.stroke();}
    ellipse(ctx,-15,0,25,16,'#574036');ellipse(ctx,7,0,13,10,'#49352a');ellipse(ctx,24,0,13,10,'#442b26');
    circ(ctx,29,-4,2,'#fff0b5');circ(ctx,29,4,2,'#fff0b5');
    ctx.restore();
    ctx.font='900 13px system-ui';ctx.fillStyle='#f5dba8';ctx.textAlign='center';ctx.fillText('QUEEN',q.x,q.y-42);
    // Granary: seeded stockpiles are connected to actual current food.
    const st=K.STORE;
    ellipse(ctx,st.x,st.y,52,31,'#3e2a2170');
    for(let i=0;i<Math.min(42,Math.ceil(s.food/5));i++){
      const a=i*2.399,r=Math.sqrt(i)*6;
      ellipse(ctx,st.x+Math.cos(a)*r,st.y+Math.sin(a)*r,5,3.5,i%4?'#adba75':'#e8c16c');
    }
    ctx.fillStyle='#e4efb8';ctx.fillText('GRANARY',st.x,st.y-40);
    // Nursery visibly changes when it is built; excavation targets guide the next step.
    const n=K.NURSERY;
    if(s.nest.nursery){
      ellipse(ctx,n.x,n.y,61,43,'#4933247d');ellipse(ctx,n.x,n.y,51,33,'#e7c39370');
      const eggs=s.eggs.filter(e=>e.side==='black');
      for(let i=0;i<Math.max(5,Math.min(24,eggs.length*4));i++){
        ellipse(ctx,n.x-32+(i%7)*11,n.y-16+Math.floor(i/7)*13,4.8,7,i%3?'#f3d8ab':'#fff1cf');
      }
      ctx.fillStyle='#f8e9c7';ctx.fillText('NURSERY',n.x,n.y-51);
    }else if(s.mission.step===1){
      ctx.strokeStyle='#f5df8e';ctx.lineWidth=2;ctx.setLineDash([7,5]);ctx.beginPath();ctx.ellipse(n.x,n.y,57,39,0,0,TAU);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#f8e9c7';ctx.fillText('FUTURE NURSERY',n.x,n.y-52);
    }
    for(const dig of queue){
      if(cells[dig.r*K.C+dig.c])continue;
      const x=dig.c*cell,y=dig.r*cell;
      ctx.fillStyle='#e2b9764f';ctx.fillRect(x+3,y+3,cell-6,cell-6);
      ctx.strokeStyle='#f7e9b2';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.strokeRect(x+4,y+4,cell-8,cell-8);ctx.setLineDash([]);
      ctx.fillStyle='#e5e9b9';ctx.fillRect(x+5,y+cell-7,(cell-10)*dig.progress,3);
    }
    if(s.mission.step===1&&queue.length===0){
      for(const [c,r] of K.recommended){
        if(cells[r*K.C+c])continue;
        ctx.strokeStyle='#e5dfa6a6';ctx.lineWidth=2;ctx.setLineDash([4,7]);ctx.strokeRect(c*cell+6,r*cell+6,cell-12,cell-12);ctx.setLineDash([]);
      }
    }
    drawEntities(ctx,s,'nest',time);
    ctx.fillStyle='#f7dfae';ctx.textAlign='left';ctx.font='700 13px system-ui';
    ctx.fillText('Tap dark soil to mark it for digging',20,K.R*cell-20);
  }
  function drawEntities(ctx,s,layer,time){
    for(const a of s.ants){if(a.hp<=0||a.layer!==layer)continue;
      const isSelected=s.selected.includes(a.id);
      ant(ctx,a,time,isSelected);
      if(isSelected&&a.moveOrder&&layer==='surface'){
        ctx.save();ctx.strokeStyle='#f8e6a3a9';ctx.lineWidth=1.5;ctx.setLineDash([7,10]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.moveOrder.x,a.moveOrder.y);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      }
      if(a.task==='dig'){ctx.strokeStyle='#f7db9c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.x+6,a.y-5);ctx.lineTo(a.x+15,a.y-13);ctx.stroke();}
    }
  }
  function draw(ctx,s,w,h,camera,time){
    const view=s.view==='nest'?'nest':'surface';
    const t=fit(view,w,h,camera[view]);
    ctx.fillStyle=view==='nest'?'#49382b':'#8c8059';ctx.fillRect(0,0,w,h);
    ctx.save();ctx.translate(t.offsetX,t.offsetY);ctx.scale(t.scale,t.scale);
    if(view==='surface')surface(ctx,s,time);else underground(ctx,s,time);
    ctx.restore();
    const edge=ctx.createRadialGradient(w*.5,h*.42,Math.min(w,h)*.1,w*.5,h*.5,Math.max(w,h)*.72);
    edge.addColorStop(0,'#090d0800');edge.addColorStop(1,'#15170d7a');
    ctx.fillStyle=edge;ctx.fillRect(0,0,w,h);
  }
  window.ColonyRender={draw,locate,fit,pan,zoom,limit};
})();