/* global navigator, Blob, createImageBitmap, OffscreenCanvas, getComputedStyle */
import assert from 'node:assert/strict';
import process from 'node:process';
import console from 'node:console';
import {URL} from 'node:url';
// Optional test tool; never shipped in the application bundle.
const { chromium } = await import(process.env.SQUEEK_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.SQUEEK_CHROMIUM || undefined,
  args: ['--no-sandbox'] });
const base = process.env.SQUEEK_TEST_URL || 'http://127.0.0.1:5180';
const errors = [];
async function pixels(page, points) {
  // Decode the actual Chromium PNG, not CSS or an image of a checkerboard.
  const screenshot = await page.screenshot({omitBackground:true});
  return page.evaluate(async ({bytes,points}) => {
    const bitmap=await createImageBitmap(new Blob([new Uint8Array(bytes)],{type:'image/png'}));
    const canvas=new OffscreenCanvas(bitmap.width,bitmap.height);
    const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);
    const result=points.map(([x,y])=>Array.from(ctx.getImageData(x,y,1,1).data));
    bitmap.close();return result;
  },{bytes:Array.from(screenshot),points});
}
try {
  const context=await browser.newContext({viewport:{width:1280,height:720},permissions:['clipboard-read','clipboard-write']});
  const panel=await context.newPage();panel.on('pageerror',e=>errors.push(e.message));
  await panel.goto(base);
  await panel.getByRole('heading',{name:'Customize your look'}).waitFor();
  await panel.selectOption('#theme','light');await panel.selectOption('#position','top-right');
  await panel.locator('#font-size').fill('30');await panel.locator('#duration').fill('3');await panel.locator('#gap').fill('1');
  await panel.getByRole('button',{name:'Accent color #ffadce',exact:true}).click();
  await panel.getByLabel('Settlement completed',{exact:true}).uncheck();
  await panel.getByRole('button',{name:'Copy',exact:true}).click();
  await panel.getByText('Link copied.',{exact:true}).waitFor();
  const url=await panel.evaluate(()=>navigator.clipboard.readText());
  const settings=JSON.parse(decodeURIComponent(new URL(url).hash.slice(1)));
  assert.deepEqual(settings,{version:1,mode:'demo',theme:'light',color:'#ffadce',position:'top-right',fontSize:30,duration:3,gap:1,settlement:false,milestone:true});
  assert.equal((await pixels(panel,[[10,10]]))[0][3],255,'normal panel stays opaque');
  await panel.selectOption('#theme','dark');
  assert.equal((await pixels(panel,[[10,10]]))[0][3],255,'dark panel stays opaque');
  const independent=await browser.newContext({viewport:{width:1280,height:720}});
  const overlay=await independent.newPage();overlay.on('pageerror',e=>errors.push(e.message));
  await overlay.clock.install();await overlay.goto(url);await panel.close();
  await overlay.getByText('DEMO — sample data',{exact:true}).waitFor();
  const blankPoints=[[640,360],[1270,710],[10,710],[1270,10]];
  for(const rgba of await pixels(overlay,blankPoints))assert.equal(rgba[3],0,'blank overlay pixels must have alpha 0');
  await overlay.clock.runFor(8300);
  await overlay.getByText('Hamster at work!',{exact:true}).waitFor();
  assert.equal(await overlay.locator('.event-card strong').evaluate(e=>getComputedStyle(e).fontSize),'30px');
  assert.ok((await overlay.locator('.alert-position').getAttribute('class')).includes('top-right'));
  assert.equal(await overlay.locator('.scene').evaluate(e=>getComputedStyle(e).getPropertyValue('--accent')),'#ffadce');
  await overlay.clock.runFor(500); // Let the intentional fade-in finish before sampling the card.
  const rect=await overlay.locator('.event-card').boundingBox();
  assert.ok((await pixels(overlay,[[Math.floor(rect.x+100),Math.floor(rect.y+50)]]))[0][3] > 0,'notification is rendered in the PNG');
  for(const rgba of await pixels(overlay,blankPoints))assert.equal(rgba[3],0,'blank space remains transparent during notification');
  await overlay.reload();await overlay.getByText('DEMO — sample data',{exact:true}).waitFor();
  for(const rgba of await pixels(overlay,blankPoints))assert.equal(rgba[3],0);
  // Both root route spellings, no settings, still transparent.
  await overlay.goto(base+'/overlay/');await overlay.getByText('DEMO — sample data',{exact:true}).waitFor();
  for(const rgba of await pixels(overlay,blankPoints))assert.equal(rgba[3],0);
  const apiPage=await independent.newPage();
  await apiPage.route('https://api.squeekchain.com/**',route=>route.fulfill({status:403,headers:{'Access-Control-Allow-Origin':'*'},body:'blocked'}));
  const liveUrl=new URL(url);liveUrl.hash=encodeURIComponent(JSON.stringify({...settings,mode:'live'}));
  await apiPage.goto(liveUrl.href);await apiPage.getByText(/API request rejected: HTTP 403/).waitFor();
  await apiPage.getByText('API connection not verified',{exact:true}).waitFor();
  assert.equal(await apiPage.locator('.event-card').count(),0);
  for(const rgba of await pixels(apiPage,blankPoints))assert.equal(rgba[3],0);
  assert.deepEqual(errors,[]);
  console.log('PASS: Chromium PNG alpha=0 in blank overlay areas (before/during demo, reload, /overlay/, API error); panel alpha=255 and notification visible. Copied URL roundtrip, independent demo, colors/theme/position/font/duration/gap/trigger settings, mocked API failure passed.');
} finally { await browser.close(); }
