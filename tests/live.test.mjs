import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LiveDataProvider, parseEvents, retryDelay } from '../src/live.ts';
// Synthetic contract: these are not official API values.
const contract = {schemaVersion:'test-only',eventTypes:['test-event'],pollMs:20,staleMs:100};
const event = id => ({id,type:'test-event',occurredAt:'2026-10-30T12:00:00Z'});
const body = events => ({schemaVersion:'test-only',events});
const response = (events,headers={}) => new Response(JSON.stringify(body(events)),{headers});
const wait = ms => new Promise(resolve=>setTimeout(resolve,ms));
async function until(check) { for(let i=0;i<100;i++){ if(check()) return; await wait(5); } throw new Error('Timeout'); }
test('reject unknown versions and malformed fields; unavailable is distinct',()=>{
  assert.throws(()=>parseEvents({schemaVersion:1,events:[]},contract));
  assert.throws(()=>parseEvents(body([{...event('1'),id:1}]),contract));
  assert.throws(()=>parseEvents(body([{...event('1'),occurredAt:'bad'}]),contract));
  assert.equal(parseEvents({schemaVersion:'test-only',status:'unavailable'},contract),null);
});
test('missing official contract blocks all network requests',()=>{
  let requests=0;let state;
  new LiveDataProvider(null,async()=>{requests++;}).start(s=>state=s.state)();
  assert.equal(state,'blocked');assert.equal(requests,0);
});
test('baseline, deduplication, ETag and 304',async()=>{
  const states=[]; const calls=[];
  const replies=[response([event('old')],{ETag:'v1'}),response([event('old'),event('new'),event('new')],{ETag:'v2'}),new Response(null,{status:304})];
  const stop=new LiveDataProvider(contract,async(_url,options)=>{calls.push(options);return replies.shift() ?? new Response(null,{status:304});}).start(s=>states.push(s));
  try {
    await until(()=>states.filter(s=>s.state==='ready').length>=3);
    assert.deepEqual(states.flatMap(s=>s.events.map(e=>e.id)),['new']);
    assert.equal(calls[1].headers['If-None-Match'],'v1');
    assert.equal(calls[2].headers['If-None-Match'],'v2');
  } finally {stop();}
});
test('unavailable and recovery establish new baseline',async()=>{
  const states=[];
  const replies=[response([event('old')]),new Response(JSON.stringify({schemaVersion:'test-only',status:'unavailable'})),response([event('recovery')]),response([event('recovery'),event('next')])];
  const stop=new LiveDataProvider(contract,async()=>replies.shift() ?? response([event('next')])).start(s=>states.push(s));
  try {await until(()=>states.some(s=>s.events.length));assert.ok(states.some(s=>s.state==='unavailable'));assert.deepEqual(states.flatMap(s=>s.events.map(e=>e.id)),['next']);}finally{stop();}
});
test('429 honors Retry-After; cancellation prevents further polling',async()=>{
  let calls=0;const states=[];
  const stop=new LiveDataProvider(contract,async()=>{calls++;return new Response(null,{status:429,headers:{'Retry-After':'1'}});}).start(s=>states.push(s));
  await until(()=>states.some(s=>s.state==='rate-limited'));await wait(60);stop();assert.equal(calls,1);
  assert.equal(retryDelay('2',0,20),2000);assert.equal(retryDelay(new Date(5000).toUTCString(),0,20),5000);
});
test('errors stop effects; old successful checks become stale',async()=>{
  const states=[];let calls=0;
  const stop=new LiveDataProvider(contract,async()=>{if(calls++===0)return response([event('old')]);throw new Error('offline');}).start(s=>states.push(s));
  try {await until(()=>states.some(s=>s.state==='stale'));assert.ok(states.some(s=>s.state==='error'));assert.deepEqual(states.flatMap(s=>s.events),[]);}finally{stop();}
});
