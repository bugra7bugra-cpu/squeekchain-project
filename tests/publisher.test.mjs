import {test} from 'node:test';
import assert from 'node:assert/strict';
import {NotificationQueue} from '../src/queue.ts';
import {parseSettings,defaults} from '../src/settings.ts';
const e=(id,kind='settlement')=>({id,kind});
const all=()=>true;
test('queue shows in order, observes duration then minimum silent interval',()=>{
 const q=new NotificationQueue();q.enqueue([e('a'),e('b')]);
 assert.equal(q.tick(0,3000,2000,all).event.id,'a');
 assert.equal(q.tick(2999,3000,2000,all).event.id,'a');
 assert.equal(q.tick(3000,3000,2000,all).event,null);
 assert.equal(q.tick(4999,3000,2000,all).event,null);
 assert.equal(q.tick(5000,3000,2000,all).event.id,'b');
});
test('five waiting slots preserve active item and drop oldest waiting on overflow',()=>{
 const q=new NotificationQueue();q.enqueue([e('active')]);q.tick(0,3000,0,all);
 q.enqueue(Array.from({length:7},(_,i)=>e(String(i))));
 assert.deepEqual(q.tick(1,3000,0,all),{event:e('active'),waiting:5});
 assert.equal(q.tick(3000,3000,0,all).event.id,'2');
});
test('duplicates never queue twice; clear drops active and waiting',()=>{
 const q=new NotificationQueue();q.enqueue([e('a'),e('a')]);assert.equal(q.tick(0,3000,0,all).waiting,0);
 q.clear();q.enqueue([e('a'),e('b')]);assert.equal(q.tick(1,3000,0,all).event.id,'b');
});
test('disabled trigger removed from active and pending',()=>{
 const q=new NotificationQueue();q.enqueue([e('a'),e('b','milestone')]);q.tick(0,3000,0,all);
 assert.equal(q.tick(1,3000,0,item=>item.kind==='milestone').event.id,'b');
});
test('old v1 settings migrate new fields and preserve appearance',()=>{
 const {duration,gap,settlement,milestone,...old}=defaults;
 assert.deepEqual(parseSettings(JSON.stringify(old)),defaults);
 assert.equal(duration,5);assert.equal(gap,2);assert.ok(settlement&&milestone);
});
test('invalid settings and unknown fields rejected',()=>{
 for(const patch of [{duration:null},{settlement:null},{duration:2},{duration:11},{gap:-1},{gap:31},{gap:'2'},{settlement:'yes'},{milestone:0},{version:99},{unknown:1}]) {
  assert.throws(()=>parseSettings(JSON.stringify({...defaults,...patch})));
 }
 assert.throws(()=>parseSettings('broken'));
});
test('notification configuration roundtrips independently of local storage',()=>{
 const s={...defaults,mode:'live',duration:10,gap:0,settlement:false};
 assert.deepEqual(parseSettings(decodeURIComponent(encodeURIComponent(JSON.stringify(s)))),s);
});
