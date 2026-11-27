import test from 'node:test';
import assert from 'node:assert/strict';
import {fitCamera,clampCamera,zoomAt,screenToWorld,WIDTH,HEIGHT} from '../critter-rescue/renderer.js';
import {tools,toolIcon,names,palettes,rand} from '../critter-rescue/assets.js';
test('all six original tools have unique authored vector icons',()=>{assert.equal(tools.length,6);assert.equal(new Set(tools.map(t=>t.id)).size,6);for(const t of tools){assert.match(toolIcon(t),/<svg/);assert.match(t.art,/<path/);assert.ok(t.desc.length>10);}});
test('four level palettes and names remain in sync',()=>{assert.equal(names.length,4);assert.equal(palettes.length,names.length);assert.equal(rand(9,4),rand(9,4));assert.notEqual(rand(9,4),rand(9,5));});
test('camera fits the board and round-trips logical coordinates',()=>{for(const [w,h] of [[390,480],[844,290],[768,780],[1024,600],[1280,700]]){const c=fitCamera(w,h);assert.ok(WIDTH*c.scale<=w+1e-8);assert.ok(HEIGHT*c.scale<=h+1e-8);const p=screenToWorld(c.x+WIDTH*.4*c.scale,c.y+HEIGHT*.6*c.scale,c);assert.ok(Math.abs(p.x-WIDTH*.4)<1e-7);assert.ok(Math.abs(p.y-HEIGHT*.6)<1e-7);}});
test('zoom preserves a central focal point and stays within bounds',()=>{let c=fitCamera(1000,500);let p=screenToWorld(500,250,c);zoomAt(c,c.scale*2,500,250,1000,500);assert.deepEqual(screenToWorld(500,250,c),p);c.x=900;c.y=900;clampCamera(c,1000,500);assert.equal(c.x,0);assert.equal(c.y,0);zoomAt(c,.001,500,250,1000,500);assert.equal(c.scale,fitCamera(1000,500).scale);});
