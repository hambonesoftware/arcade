import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const port=8765,server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
const base='http://127.0.0.1:'+port+'/critter-rescue/';
await mkdir('test-results/critter-rescue',{recursive:true});
let browser;
try{
 for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true});
 const modes=[['desktop',1440,900,false],['iphone-portrait',390,844,true],['iphone-landscape',844,390,true],['ipad-portrait',820,1180,true],['ipad-landscape',1180,820,true]];
 for(const [name,width,height,touch] of modes){
  const page=await browser.newPage({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(base,{waitUntil:'networkidle'});await page.locator('#world').waitFor({state:'visible'});
  await page.locator('#closeHint').click();await page.locator('#fit').click();
  const check=await page.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,w:innerWidth,h:innerHeight,tools:[...document.querySelectorAll('.tool')].map(e=>{let r=e.getBoundingClientRect();return {x:r.left,y:r.top,r:r.right,b:r.bottom,w:r.width,h:r.height};}),canvas:document.querySelector('#world').getBoundingClientRect().toJSON()}));
  assert.ok(check.width<=check.w+1&&check.height<=check.h+1,name+' has no page overflow');
  assert.ok(check.tools.every(t=>t.x>=0&&t.y>=0&&t.r<=width+1&&t.b<=height+1&&t.w>=30&&t.h>=40),name+' all tools reachable');
  assert.ok(check.canvas.width>100&&check.canvas.height>100,name+' canvas is visible');
  await page.screenshot({path:'test-results/critter-rescue/'+name+'.png'});
  await page.locator('#zoomIn').click();await page.locator('#fit').click();
  await page.locator('#map').click();assert.equal(await page.locator('.map-card').count(),4);
  await page.locator('.map-card[data-level="1"]').click();assert.equal(await page.locator('#levelName').textContent(),'The Old Oak');
  await page.locator('#closeHint').click();await page.screenshot({path:'test-results/critter-rescue/'+name+'-oak.png'});
  await page.locator('#map').click();await page.screenshot({path:'test-results/critter-rescue/'+name+'-map.png'});
  await page.locator('.map-card[data-level="0"]').click();
  await page.locator('#fit').click();
  // Actual input against rendered terrain, not direct engine calls.
  const r=await page.locator('#world').boundingBox();const s=Math.min(r.width/1440,r.height/720),ox=r.x+(r.width-1440*s)/2,oy=r.y+(r.height-720*s)/2;
  const x1=ox+45.5*12*s,x2=ox+62.5*12*s,y=oy+35.5*12*s;
  // Touch emulation still accepts desktop pointer input; test native tap on touch layouts.
  if(touch){const session=await page.context().newCDPSession(page);const points=[{x:x1,y,id:1},{x:x1+32,y:y-30,id:2}];await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x1-10,y:y+5,id:1},{x:x1+42,y:y-35,id:2}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();assert.equal(await page.locator('[data-tool="bridge"] .count').textContent(),'24 left',name+' pinch does not place tools');await page.locator('#fit').click();await page.touchscreen.tap(x1,y);assert.equal(await page.locator('[data-tool="bridge"] .count').textContent(),'23 left');await page.locator('#undo').click();}
  await page.mouse.move(x1,y);await page.mouse.down();await page.mouse.move(x2,y,{steps:20});await page.mouse.up();
  assert.equal(await page.locator('[data-tool="bridge"] .count').textContent(),'6 left',name+' bridge consumed correct budget');
  await page.locator('#undo').click();assert.equal(await page.locator('[data-tool="bridge"] .count').textContent(),'24 left');
  await page.mouse.move(x1,y);await page.mouse.down();await page.mouse.move(x2,y,{steps:20});await page.mouse.up();
  if(name==='desktop'){await page.locator('#speed').click();await page.locator('#speed').click();await page.locator('#play').click();await page.waitForTimeout(850);await page.screenshot({path:'test-results/critter-rescue/desktop-flock.png'});await page.locator('#play').click();assert.match(await page.locator('#play').textContent(),/Resume/);await page.locator('#play').click();await page.locator('#result').waitFor({state:'visible',timeout:18000});assert.equal(await page.locator('#saved').textContent(),'12');assert.equal(await page.locator('#stars').textContent(),'★★★');await page.screenshot({path:'test-results/critter-rescue/desktop-rescued.png'});await page.reload();await page.locator('#map').click();assert.equal(await page.locator('.map-card[data-level="0"] .rating').textContent(),'★★★');}
  assert.deepEqual(errors,[],name+' no browser errors');await page.close();console.log('PASS '+name);
 }
}finally{await browser?.close();server.kill();}
