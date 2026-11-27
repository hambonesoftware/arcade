import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const port=8766,server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'}),base='http://127.0.0.1:'+port+'/critter-rescue/pocket/';
await mkdir('test-results/critter-rescue-pocket',{recursive:true});let browser;
try{
 for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true});
 const modes=[['iphone-portrait',390,844,true],['iphone-landscape',844,390,true],['ipad-portrait',820,1180,true],['desktop',1440,900,false]];
 for(const [name,width,height,touch] of modes){
  const p=await browser.newPage({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await p.goto(base,{waitUntil:'networkidle'});await p.locator('#board').waitFor({state:'visible'});await p.screenshot({path:'test-results/critter-rescue-pocket/'+name+'-bridge.png'});
  const r=await p.locator('#board').boundingBox(),s=Math.min(r.width/400,r.height/600),ox=r.x+(r.width-400*s)/2,oy=r.y+(r.height-600*s)/2;
  assert.ok(s>.4,name+' board is readable');assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=width+1&&r.y+r.height<=height+1);
  const xy=(x,y)=>({x:ox+x*s,y:oy+y*s});
  async function drag(x1,y1,x2,y2){const a=xy(x1,y1),b=xy(x2,y2);if(touch){const c=await p.context().newCDPSession(p);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...a,id:1}]});for(let i=1;i<=8;i++)await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/8,y:a.y+(b.y-a.y)*i/8,id:1}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach();}else{await p.mouse.move(a.x,a.y);await p.mouse.down();await p.mouse.move(b.x,b.y,{steps:8});await p.mouse.up();}}
  await drag(214,88,250,40);assert.match(await p.locator('#instruction').textContent(),/Bridge released/);
  await p.waitForTimeout(1800);await p.screenshot({path:'test-results/critter-rescue-pocket/'+name+'-bridge-released.png'});
  if(name==='iphone-portrait'){await p.locator('#go').click();await p.locator('#result').waitFor({state:'visible',timeout:18000});assert.equal(await p.locator('#saved').textContent(),'3 / 3');assert.equal(await p.locator('#stars').textContent(),'★★★');await p.locator('#next').click();await drag(191,414,191,367);await p.screenshot({path:'test-results/critter-rescue-pocket/'+name+'-spring.png'});await p.locator('#go').click();await p.locator('#result').waitFor({state:'visible',timeout:18000});assert.equal(await p.locator('#saved').textContent(),'3 / 3');await p.locator('#next').click();await drag(324,150,367,150);assert.match(await p.locator('#instruction').textContent(),/Pin removed/);await p.screenshot({path:'test-results/critter-rescue-pocket/'+name+'-lift.png'});await p.locator('#go').click();await p.locator('#result').waitFor({state:'visible',timeout:22000});assert.equal(await p.locator('#saved').textContent(),'4 / 4');}
  await p.locator('#map').click();assert.equal(await p.locator('.level-card').count(),3);await p.locator('.level-card[data-level="1"]').click();assert.equal(await p.locator('#title').textContent(),'The springboard');await p.locator('#retry').click();assert.equal(await p.locator('#saved').textContent(),'0 / 3');assert.deepEqual(errors,[],name+' browser errors');await p.close();console.log('PASS '+name);
 }
}finally{await browser?.close();server.kill();}
