import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,levels,DT,segmentsHit} from '../critter-rescue/pocket/physics.js';
function run(g,n=3500){for(let i=0;i<n&&!g.done;i++)g.tick(DT);return g;}
for(let i=0;i<levels.length;i++){
 test(levels[i].name+' requires its mechanism and rescues every explorer when solved',()=>{
  const bad=createGame(i);bad.release();run(bad);assert.equal(bad.saved,0);
  const g=createGame(i);
  if(i===0){const r=g.rope();assert.equal(g.swipe({x:0,y:0},{x:10,y:10}),false);assert.ok(g.swipe(r.a,r.b));run(g,400);}
  if(i===1)g.setCharge(.85);
  if(i===2)assert.ok(g.pullPin());
  g.release();run(g);assert.equal(g.saved,levels[i].count);assert.equal(g.lost,0);
 });
}
test('rope hit test handles crossings and misses',()=>{assert.ok(segmentsHit({x:0,y:5},{x:10,y:5},{x:5,y:0},{x:5,y:10},0));assert.equal(segmentsHit({x:0,y:0},{x:10,y:0},{x:0,y:30},{x:10,y:30},2),false);});
test('spring charge is bounded and fires once per creature',()=>{const g=createGame(1);g.setCharge(12);assert.equal(g.charge,1);g.setCharge(-5);assert.equal(g.charge,0);g.setCharge(.85);g.release();run(g);assert.equal(g.launchCount,3);});
test('lift waits until the whole flock is aboard',()=>{const g=createGame(2);g.pullPin();run(g,300);assert.equal(g.liftY,420);g.release();run(g);assert.equal(g.liftY,238);assert.equal(g.saved,4);});
