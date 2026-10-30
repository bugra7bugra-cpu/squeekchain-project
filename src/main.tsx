import { Arena } from './ArenaPage';
import { StrictMode, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { createDemoSource } from './demo';
import type { DemoEvent } from './demo';
import { defaults, overlayUrl, parseSettings, positions, readStoredSettings, storageKey } from './settings';
import type { Settings } from './settings';
import { useLive } from './useLive';
import { NotificationQueue } from './queue';
import './styles.css';

const positionNames = { 'top-left': 'Top left', 'top-right': 'Top right', 'bottom-left': 'Bottom left', 'bottom-right': 'Bottom right' };
const isOverlay = window.location.pathname.replace(/\/$/, '') === '/overlay';
document.documentElement.classList.toggle('overlay-root', isOverlay);
document.body.classList.toggle('overlay-body', isOverlay);

function DemoBadge() { return <span className="demo-badge"><i />DEMO — sample data</span>; }
function PixelHamster() {
  return <svg className="hamster" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
    <path fill="currentColor" d="M3 2h3v2h4V2h3v3h1v7h-2v2H4v-2H2V5h1z" />
    <path fill="#161b18" d="M5 6h2v2H5zm5 0h2v2h-2zM7 10h3v1H7z" />
    <path fill="#f7adab" d="M3 9h3v2H3zm8 0h3v2h-3z" />
  </svg>;
}
function useDemo(auto: boolean, mode: Settings['mode']) {
  const source = useRef(createDemoSource());
  const [event, setEvent] = useState<DemoEvent | null>(null);
  useEffect(() => {
    setEvent(null);
    if (!auto || mode !== 'demo') return;
    const first = window.setTimeout(() => setEvent(source.current.next()), 800);
    const interval = window.setInterval(() => setEvent(source.current.next()), 8000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, [auto, mode]);
  return { event, trigger: () => setEvent(source.current.next()) };
}
function DataScene({ settings, event, preview = false }: { settings: Settings; event: DemoEvent | null; preview?: boolean }) {
  const live = useLive(settings.mode === 'live');
  const queue = useRef(new NotificationQueue<DemoEvent>());
  const [frame, setFrame] = useState<{event: DemoEvent | null; waiting: number}>({event:null,waiting:0});
  useEffect(() => {
    if (settings.mode === 'demo' && event) queue.current.enqueue([event]);
  }, [event, settings.mode]);
  useEffect(() => {
    if (settings.mode !== 'live') return;
    if (!['ready', 'empty'].includes(live.state)) { queue.current.clear(); return; }
    queue.current.enqueue(live.events.map(item => ({ id:item.id, source:'live', kind:item.type,
      title:item.type === 'system.settlement_completed' ? 'Settlement completed' : 'Daily distance milestone',
      message:'A new event on Squeekchain.', timestamp:item.occurredAt })));
  }, [live, settings.mode]);
  useEffect(() => {
    const update = () => setFrame(queue.current.tick(Date.now(), settings.duration * 1000, settings.gap * 1000,
      item => item.kind === 'system.settlement_completed' ? settings.settlement : settings.milestone));
    update();
    const timer = window.setInterval(update, 100);
    return () => clearInterval(timer);
  }, [settings.duration, settings.gap, settings.settlement, settings.milestone]);
  const healthy = settings.mode === 'live' && ['ready', 'empty'].includes(live.state);
  const label = settings.mode === 'demo' ? 'DEMO — sample data' : healthy ? 'Last API check successful' : 'API connection not verified';
  return <div className={preview ? 'data-scene preview-data' : 'data-scene overlay-data'}>
    <Scene settings={settings} event={settings.mode === 'live' && !healthy ? null : frame.event} preview={preview} label={label} />
    <div className="scene-status" role="status">
      {settings.mode === 'demo' ? `Sample data · ${frame.waiting}/5 queued` : live.message}
      {settings.mode === 'live' && live.lastChecked && <span> Last checked: {new Date(live.lastChecked).toLocaleTimeString('en-US')}</span>}
    </div>
  </div>;
}

function Scene({ settings, event, preview = false, label }: { settings: Settings; event: DemoEvent | null; preview?: boolean; label: string }) {
  const style = { '--accent': settings.color, '--alert-size': `${settings.fontSize}px` } as CSSProperties;
  return <div className={`scene ${preview ? 'scene-preview' : 'scene-overlay'} ${settings.theme}`} style={style}>
    <div className="scene-label">{settings.mode === 'demo' ? <><DemoBadge /><small>Not live</small></> : <span className="demo-badge connection-badge">{label}</span>}</div>
    {preview && !event && <div className="scene-placeholder"><PixelHamster /><span>{settings.mode === 'demo' ? 'Your stage is ready. Try a demo event.' : 'Waiting for a new Squeekchain event.'}</span></div>}
    <div className={`alert-position ${settings.position}`} role="status" aria-live="polite">
      {event && <article className="event-card" key={event.id}>
        <PixelHamster /><div><span className="event-eyebrow">{event.source === 'live' ? 'CHAIN EVENT' : 'DEMO EVENT'} / {event.kind}</span>
          <strong>{event.title}</strong><p>{event.message}</p></div>
      </article>}
    </div>
  </div>;
}
function OverlayPage() {
  const [config, setConfig] = useState<{ settings: Settings; error?: string }>(() => loadOverlay());
  const { event } = useDemo(!config.error, config.settings.mode);
  useEffect(() => {
    const update = () => setConfig(loadOverlay());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  if (config.error) return <div className="overlay-error"><DemoBadge /><p role="alert">{config.error}</p></div>;
  return <DataScene key={window.location.hash} settings={config.settings} event={event} />;
}
function loadOverlay(): { settings: Settings; error?: string } {
  try {
    return { settings: window.location.hash ? parseSettings(decodeURIComponent(window.location.hash.slice(1))) : { ...defaults } };
  } catch (error) {
    return { settings: defaults, error: error instanceof Error ? error.message : 'Could not read the link.' };
  }
}
function ControlPanel() {
  const [initial] = useState(() => {
    try { return { settings: readStoredSettings(), warning: '' }; }
    catch { return { settings: { ...defaults }, warning: 'Could not read saved settings. Using the default appearance.' }; }
  });
  const [settings, setSettings] = useState(initial.settings);
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  const [copyStatus, setCopyStatus] = useState('');
  const { event, trigger } = useDemo(false, settings.mode);
  const url = overlayUrl(settings);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); }
    catch { setStorageWarning('Your browser could not save settings. You can still use the OBS link.'); }
  }, [settings]);
  function change<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings(current => ({ ...current, [key]: value }));
    setCopyStatus('');
  }
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopyStatus('Link copied.'); }
    catch { setCopyStatus('Could not copy automatically. Select the link and copy it manually.'); }
  }
  return <div className={`app ${settings.theme}`}>
    <header className="topbar"><a className="brand" href="/"><PixelHamster /><span>SQUEEK<span className="brand-light"> / LIVE COMPANION</span></span></a><span className="version">STREAM STUDIO · v0.1</span></header>
    <main>
      <div className="intro"><div><p className="eyebrow">BRING THE CHAIN TO YOUR STREAM.</p><a href="/arena">🐹 Play Hamster Event Arena →</a><h1>Add a little<br /><em>Squeek</em> to your stream.</h1><p>Turn events into visual reactions. Design your scene and add it to OBS.</p></div>
        <div className="mode-card"><label htmlFor="data-mode">Data source</label><select id="data-mode" value={settings.mode} onChange={e => change('mode', e.target.value as Settings['mode'])}><option value="demo">DEMO — sample data</option><option value="live">Live — Squeekchain events</option></select>{settings.mode === 'demo' && <DemoBadge />}<p>Live errors never switch you to demo mode.</p></div></div>
      {storageWarning && <p className="warning" role="status">{storageWarning}</p>}
      <div className="workspace">
        <section className="settings panel" aria-labelledby="settings-title"><div className="section-heading"><span className="step">01</span><h2 id="settings-title">Customize your look</h2></div>
          <label htmlFor="theme">Theme</label><select id="theme" value={settings.theme} onChange={e => change('theme', e.target.value as Settings['theme'])}><option value="dark">Dark / night shift</option><option value="light">Light / daylight</option></select>
          <label htmlFor="color">Accent color <span className="value">{settings.color}</span></label><div className="color-row"><input id="color" type="color" value={settings.color} onChange={e => change('color', e.target.value)} /><div className="swatches">{['#b9f568', '#83cfff', '#ffadce', '#f7cd73'].map(color => <button key={color} aria-label={`Accent color ${color}`} aria-pressed={settings.color === color} style={{ backgroundColor: color }} onClick={() => change('color', color)} />)}</div></div>
          <label htmlFor="position">Notification position</label><select id="position" value={settings.position} onChange={e => change('position', e.target.value as Settings['position'])}>{positions.map(p => <option key={p} value={p}>{positionNames[p]}</option>)}</select>
          <label htmlFor="font-size">Font size <span className="value">{settings.fontSize} px</span></label><input id="font-size" type="range" min="16" max="36" value={settings.fontSize} onChange={e => change('fontSize', Number(e.target.value))} />
          <fieldset className="notification-settings"><legend>Notification behavior</legend>
            <label htmlFor="duration">Display duration <span className="value">{settings.duration} s</span></label>
            <input id="duration" type="range" min="3" max="10" value={settings.duration} onChange={e => change('duration', Number(e.target.value))} />
            <label htmlFor="gap">Gap between notifications <span className="value">{settings.gap} s</span></label>
            <input id="gap" type="range" min="0" max="30" value={settings.gap} onChange={e => change('gap', Number(e.target.value))} />
            <label className="toggle"><input type="checkbox" checked={settings.settlement} onChange={e => change('settlement', e.target.checked)} /> Settlement completed</label>
            <label className="toggle"><input type="checkbox" checked={settings.milestone} onChange={e => change('milestone', e.target.checked)} /> Daily distance milestone</label>
          </fieldset>
          <p className="hint">Settings are saved in this browser. No audio or wallet connection is used.</p>
        </section>
        <section className="preview-section" aria-labelledby="preview-title"><div className="preview-heading"><div className="section-heading"><span className="step">02</span><h2 id="preview-title">Preview your scene</h2></div><span className="preview-size">16:9 PREVIEW</span></div>
          <div className="preview-frame"><DataScene key={settings.mode} settings={settings} event={event} preview /></div>
          <div className="test-bar"><div><strong>Bring your scene to life.</strong><p>Two sample event types use your duration and trigger settings.</p></div><button className="primary" disabled={settings.mode !== 'demo'} onClick={trigger}>▶ Try a demo event</button></div>
        </section>
      </div>
      <section className="obs panel" aria-labelledby="obs-title"><div className="section-heading"><span className="step">03</span><h2 id="obs-title">Add to OBS</h2><span className="tag">BROWSER SOURCE</span></div>
        <div className="obs-grid"><div><p>In OBS, select <strong>Sources → + → Browser</strong>. Paste the link into the URL field. Set the width to <strong>1920</strong> and the height to <strong>1080</strong>.</p><p className="hint">In demo mode, the independent overlay plays a sample event every 8 seconds. After changing settings, paste the new URL into OBS. You can close this panel.</p></div><div><label htmlFor="obs-url">Overlay link</label><div className="url-row"><input id="obs-url" readOnly value={url} onFocus={e => e.currentTarget.select()} /><button onClick={copy}>Copy</button></div><div className="link-row"><a href={url} target="_blank" rel="noreferrer">Open overlay in a new tab ↗</a><span role="status">{copyStatus}</span></div></div></div>
      </section>
      <footer><span>SQUEEK LIVE COMPANION</span><span>Demo and live data stay separate. No wallet or badge transactions.</span></footer>
    </main>
  </div>;
}
createRoot(document.getElementById('root')!).render(<StrictMode>{window.location.pathname.replace(/\/$/, "") === "/arena" ? <Arena /> : isOverlay ? <OverlayPage /> : <ControlPanel />}</StrictMode>);

