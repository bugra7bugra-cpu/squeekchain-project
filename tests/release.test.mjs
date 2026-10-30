import {URL} from 'node:url';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const config=JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));
test('direct overlay paths rewrite to app without rewriting assets',()=>{
 assert.deepEqual(config.rewrites,[{source:'/overlay',destination:'/index.html'},{source:'/overlay/',destination:'/index.html'}]);
 assert.equal(config.outputDirectory,'dist');
});
test('Vercel build command refuses production and other branches',()=>{
 for(const [environment,branch] of [['production','feat/faz4-demo'],['preview','main'],['','']]) {
  const result=spawnSync('sh',['-c',config.buildCommand],{env:{PATH:'/usr/bin:/bin',VERCEL_ENV:environment,VERCEL_GIT_COMMIT_REF:branch},encoding:'utf8'});
  assert.equal(result.status,1);assert.match(result.stdout,/Only feat/);
 }
 assert.equal(config.git.deploymentEnabled['*'],false);
 assert.equal(config.git.deploymentEnabled['feat/faz4-demo'],true);
});
test('release CSP limits scripts and API connections',()=>{
 const csp=config.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
 assert.ok(csp.includes("script-src 'self'"));
 assert.ok(csp.includes("connect-src 'self' https://api.squeekchain.com"));
 assert.ok(csp.includes("object-src 'none'"));
});
