import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,levels} from '../critter-rescue/engine.js';
const plans=[
 g=>{for(let x=45;x<63;x++)g.paint('bridge',x,35)},
 g=>{for(let x=47;x<62;x+=3)g.paint('dig',x+1,34)},
 g=>{for(let x=39;x<51;x++)g.paint('leaf',x,39);for(let x=74;x<88;x++)g.paint('bridge',x,39)},
 g=>{for(let x=30;x<42;x++)g.paint('bridge',x,23);for(let x=58;x<69;x+=3)g.paint('dig',x+1,21);for(let x=82;x<94;x++)g.paint('leaf',x,40)}
];
for(const [i,l] of levels.entries())test(l.name+' has a perfect rescue solution',()=>{const g=createGame(l);plans[i](g);for(let n=0;n<6000&&!g.done;n++)g.tick(1/60);assert.equal(g.saved,l.count);assert.equal(g.lost,0);assert.ok(g.done);});
test('bridge budget is finite and duplicate placements are free',()=>{const g=createGame(levels[0]);assert.ok(g.paint('bridge',45,35));assert.equal(g.stock.bridge,23);assert.equal(g.paint('bridge',45,35),false);assert.equal(g.stock.bridge,23);});
test('unbridged creek is hazardous',()=>{const g=createGame(levels[0]);for(let n=0;n<3600&&!g.done;n++)g.tick(1/60);assert.equal(g.saved,0);assert.ok(g.lost>0);});
test('stone cannot be excavated',()=>{const g=createGame(levels[1]);g.paint('dig',50,22);assert.equal(g.tile(50,22),4);});
test('guides can be released and their stock restored',()=>{const g=createGame(levels[0]);for(let i=0;i<60;i++)g.tick(1/60);const c=g.creatures[0],x=Math.floor(c.x),y=Math.floor(c.y-1);assert.ok(g.paint('signal',x,y));assert.ok(c.block);assert.equal(g.stock.signal,1);assert.ok(g.paint('signal',x,y));assert.equal(c.block,false);assert.equal(g.stock.signal,2);});
