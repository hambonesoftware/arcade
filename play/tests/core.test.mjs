import test from "node:test";
import assert from "node:assert/strict";
import { PLAY_VERSION, calculateSafeRect, shouldAnnounceChange, createPlayHUD } from "../v1/hambone-play.js";

test("semver contract is pinned", () => assert.equal(PLAY_VERSION, "1.0.0"));
test("full view has safe margins when there are no overlays", () => {
  assert.deepEqual(calculateSafeRect(400,800), {x:10,y:10,width:380,height:780,centerX:200,centerY:400});
});
test("top scorebug and bottom controls reduce available gameplay bounds", () => {
  const rect=calculateSafeRect(400,800, [
    {left:10,right:310,top:0,bottom:80},
    {left:0,right:400,top:735,bottom:800}
  ]);
  assert.equal(rect.y,90);
  assert.equal(rect.height,635);
  assert.equal(rect.centerX,200);
});
test("large sidebar occupies the side, not the entire width", () => {
  const rect=calculateSafeRect(1000,600,[{left:690,right:1000,top:65,bottom:600}]);
  assert.equal(rect.width,670);
  assert.equal(rect.centerX,345);
});
test("offscreen or invalid bounds never produce negative dimensions", () => {
  const r=calculateSafeRect(240,350,[{left:0,right:600,top:0,bottom:500},{left:NaN,right:0,top:0,bottom:0}],12);
  assert.ok(r.width>0 && r.height>0);
  assert.ok(Number.isFinite(r.centerY));
});
test("only important state transitions trigger announcements", () => {
  assert.equal(shouldAnnounceChange("ready","editing"),false);
  assert.equal(shouldAnnounceChange("ready","playing"),true);
  assert.equal(shouldAnnounceChange("playing","result"),true);
  assert.equal(shouldAnnounceChange("result","result"),false);
});
test("DOM creation has an explicit contract", () => {
  assert.throws(() => createPlayHUD({}),TypeError);
});
