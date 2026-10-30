import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createGame,step,boost} from '../src/arena.ts';
test('paused games freeze; sixty seconds ends the round',()=>{const g=createGame();assert.deepEqual(step(g,1,0,1),g);const end=step({...g,running:true},0,0,90);assert.equal(end.time,0);assert.equal(end.running,false);});
test('movement clamps and diagonals are normalized',()=>{const g={...createGame(),running:true};const a=step(g,1,0,1);const b=step(g,1,1,1);assert.ok(Math.abs(Math.hypot(b.x-50,b.y-50)-25)<.001);assert.equal(a.x,75);assert.equal(step(g,1,0,10).x,97);});
test('settlement doubles collected score and speed changes movement; effects expire',()=>{const g={...createGame(),running:true,targetX:75};assert.equal(step(boost(g,'system.settlement_completed'),1,0,1).score,20);assert.equal(step(g,1,0,1).score,10);assert.equal(step(boost(g,'measurement.daily_distance_milestone'),1,0,1).x,90);assert.equal(step(boost(g,'system.settlement_completed'),0,0,9).bonus,0);assert.deepEqual(boost(g,'unknown'),g);});
test('reset clears score and all event effects',()=>{const g=createGame();assert.equal(g.score+g.bonus+g.speed,0);assert.equal(g.time,60);});
