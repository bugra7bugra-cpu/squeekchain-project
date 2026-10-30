import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import assert from 'node:assert/strict';
import { LiveDataProvider, parseEvents, retryDelay, verifiedContract, EventHistory } from '../src/live.ts';
// Source-relayed real response structure. The missing actual ID is a synthetic fixture ID.
const fixture = JSON.parse(readFileSync(new URL('./fixtures/events.available.json', import.meta.url), 'utf8'));
// Polling durations alone are shortened for tests.
const contract = {...verifiedContract,pollMs:20,staleMs:100};
const event = id => ({...fixture.events[0], id});
const body = events => ({...fixture,events});
const response = (events,headers={}) => new Response(JSON.stringify(body(events)),{headers});
const wait = ms => new Promise(resolve=>setTimeout(resolve,ms));
async function until(check) { for(let i=0;i<100;i++){ if(check()) return; await wait(5); } throw new Error('Timeout'); }
test('reject unknown versions and malformed fields; unavailable is distinct',()=>{
  assert.throws(()=>parseEvents({schemaVersion:1,events:[]},contract));
  assert.throws(()=>parseEvents(body([{...event('1'),id:1}]),contract));
  assert.throws(()=>parseEvents(body([{...event('1'),occurredAt:'bad'}]),contract));
  assert.equal(parseEvents({schemaVersion:3,status:'unavailable'},contract),null);
});
test('missing official contract blocks all network requests',()=>{
  let requests=0;let state;
  new LiveDataProvider(null,async()=>{requests++;}).start(s=>state=s.state)();
  assert.equal(state,'blocked');assert.equal(requests,0);
});
test('baseline, deduplication, ETag and 304',async()=>{
  const states=[]; const calls=[]; const urls=[];
  const replies=[response([event('old')],{ETag:'v1'}),response([event('old'),event('new'),event('new')],{ETag:'v2'}),new Response(null,{status:304})];
  const stop=new LiveDataProvider(contract,async(url,options)=>{urls.push(url);calls.push(options);return replies.shift() ?? new Response(null,{status:304});}).start(s=>states.push(s));
  try {
    await until(()=>states.filter(s=>s.state==='ready').length>=3);
    assert.deepEqual(states.flatMap(s=>s.events.map(e=>e.id)),['new']);
    assert.ok(urls.every(url=>url==='https://api.squeekchain.com/v1/events?category=all&limit=40'));
    assert.ok(calls.every(call=>call.method==='GET' && call.credentials==='omit'));
    assert.equal(calls[1].headers['If-None-Match'],'v1');
    assert.equal(calls[2].headers['If-None-Match'],'v2');
  } finally {stop();}
});
test('unavailable and recovery establish new baseline',async()=>{
  const states=[];
  const replies=[response([event('old')]),new Response(JSON.stringify({schemaVersion:3,status:'unavailable'})),response([event('recovery')]),response([event('recovery'),event('next')])];
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

test('only selected event types and their supported versions trigger',async()=>{
  const states=[];let calls=0;
  const events=[{...event('wrong-version'),eventVersion:3},{...event('unknown'),type:'other'},
    {...event('daily'),type:'measurement.daily_distance_milestone',eventVersion:1},event('settlement')];
  const stop=new LiveDataProvider(contract,async()=>response(calls++===0?[]:events)).start(s=>states.push(s));
  try {await until(()=>states.some(s=>s.events.length));assert.deepEqual(states.flatMap(s=>s.events.map(e=>e.id)),['daily','settlement']);}finally{stop();}
});
test('strict number schema, status and event version validation',()=>{
  assert.throws(()=>parseEvents({schemaVersion:'3',status:'available',events:[]},contract));
  assert.throws(()=>parseEvents({schemaVersion:3,events:[]},contract));
  assert.throws(()=>parseEvents(body([{...event('x'),eventVersion:'2'}]),contract));
  assert.throws(()=>parseEvents(body([{...event('x'),occurredAt:'2026-10-30T12:00:00'}]),contract));
});
test('ID history is bounded and evicted old events cannot replay',()=>{
  const history=new EventHistory(10);
  const events=Array.from({length:100},(_,i)=>({...event(String(i)),occurredAt:new Date(i*1000).toISOString()}));
  events.forEach(e=>history.claim(e));
  assert.equal(history.size,10);assert.equal(history.claim(events[0]),false);assert.equal(history.claim(events[99]),false);
});
test('503 also honors Retry-After and publishes unavailable',async()=>{
  let calls=0;const states=[];
  const stop=new LiveDataProvider(contract,async()=>{calls++;return new Response(null,{status:503,headers:{'Retry-After':'1'}});}).start(s=>states.push(s));
  try {await until(()=>states.some(s=>s.state==='unavailable'));await wait(60);assert.equal(calls,1);}finally{stop();}
});

test('relayed real example parses and preserves the timestamp/version',()=>{
  assert.deepEqual(parseEvents(fixture,verifiedContract),fixture.events);
  for(const patch of [{category:'other'},{activeEventTypes:null},{activeEventTypes:[1]}]) {
    assert.throws(()=>parseEvents({...fixture,...patch},verifiedContract));
  }
});
test('invalid_query response is rejected, not treated as empty events',()=>{
  assert.throws(()=>parseEvents({error:'invalid_query'},verifiedContract));
});
test('304 without a validated cache is an error',async()=>{
  const states=[];
  const stop=new LiveDataProvider(contract,async()=>new Response(null,{status:304})).start(s=>states.push(s));
  try {await until(()=>states.some(s=>s.state==='error'));assert.deepEqual(states.flatMap(s=>s.events),[]);}finally{stop();}
});
test('connection recovery seeds a new baseline instead of replaying backlog',async()=>{
  const states=[];let calls=0;
  const stop=new LiveDataProvider(contract,async()=>{
    calls++;
    if(calls===2)throw new Error('connection lost');
    return response(calls===1?[event('initial')]:calls===3?[event('backlog')]:[event('backlog'),event('fresh')]);
  }).start(s=>states.push(s));
  try {await until(()=>states.some(s=>s.events.length));assert.ok(states.some(s=>s.state==='error'));assert.deepEqual(states.flatMap(s=>s.events.map(e=>e.id)),['fresh']);}finally{stop();}
});
