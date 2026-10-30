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

const positionNames = { 'top-left': 'Sol üst', 'top-right': 'Sağ üst', 'bottom-left': 'Sol alt', 'bottom-right': 'Sağ alt' };
const isOverlay = window.location.pathname.replace(/\/$/, '') === '/overlay';
document.body.classList.toggle('overlay-body', isOverlay);

function DemoBadge() { return <span className="demo-badge"><i />DEMO — örnek veri</span>; }
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
      title:item.type === 'system.settlement_completed' ? 'Hesaplaşma tamamlandı' : 'Günlük mesafe kilometre taşı',
      message:'Squeekchain üzerinde yeni bir olay.', timestamp:item.occurredAt })));
  }, [live, settings.mode]);
  useEffect(() => {
    const update = () => setFrame(queue.current.tick(Date.now(), settings.duration * 1000, settings.gap * 1000,
      item => item.kind === 'system.settlement_completed' ? settings.settlement : settings.milestone));
    update();
    const timer = window.setInterval(update, 100);
    return () => clearInterval(timer);
  }, [settings.duration, settings.gap, settings.settlement, settings.milestone]);
  const healthy = settings.mode === 'live' && ['ready', 'empty'].includes(live.state);
  const label = settings.mode === 'demo' ? 'DEMO — örnek veri' : healthy ? 'Son API kontrolü başarılı' : 'API bağlantısı doğrulanmadı';
  return <div className={preview ? 'data-scene preview-data' : 'data-scene overlay-data'}>
    <Scene settings={settings} event={settings.mode === 'live' && !healthy ? null : frame.event} preview={preview} label={label} />
    <div className="scene-status" role="status">
      {settings.mode === 'demo' ? `Örnek veri · ${frame.waiting}/5 bekliyor` : live.message}
      {settings.mode === 'live' && live.lastChecked && <span> Son kontrol: {new Date(live.lastChecked).toLocaleTimeString('tr-TR')}</span>}
    </div>
  </div>;
}

function Scene({ settings, event, preview = false, label }: { settings: Settings; event: DemoEvent | null; preview?: boolean; label: string }) {
  const style = { '--accent': settings.color, '--alert-size': `${settings.fontSize}px` } as CSSProperties;
  return <div className={`scene ${preview ? 'scene-preview' : 'scene-overlay'} ${settings.theme}`} style={style}>
    <div className="scene-label">{settings.mode === 'demo' ? <><DemoBadge /><small>Canlı değil</small></> : <span className="demo-badge connection-badge">{label}</span>}</div>
    {preview && !event && <div className="scene-placeholder"><PixelHamster /><span>{settings.mode === 'demo' ? 'Sahne senin. Bir demo olayı tetikle.' : 'Yeni Squeekchain olayı bekleniyor.'}</span></div>}
    <div className={`alert-position ${settings.position}`} role="status" aria-live="polite">
      {event && <article className="event-card" key={event.id}>
        <PixelHamster /><div><span className="event-eyebrow">{event.source === 'live' ? 'ZİNCİR OLAYI' : 'ÖRNEK OLAY'} / {event.kind}</span>
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
    return { settings: defaults, error: error instanceof Error ? error.message : 'Bağlantı okunamadı.' };
  }
}
function ControlPanel() {
  const [initial] = useState(() => {
    try { return { settings: readStoredSettings(), warning: '' }; }
    catch { return { settings: { ...defaults }, warning: 'Kayıtlı ayarlar okunamadı; varsayılan görünüm kullanılıyor.' }; }
  });
  const [settings, setSettings] = useState(initial.settings);
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  const [copyStatus, setCopyStatus] = useState('');
  const { event, trigger } = useDemo(false, settings.mode);
  const url = overlayUrl(settings);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); }
    catch { setStorageWarning('Tarayıcı ayarları saklayamadı. OBS bağlantısı yine kullanılabilir.'); }
  }, [settings]);
  function change<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings(current => ({ ...current, [key]: value }));
    setCopyStatus('');
  }
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopyStatus('Bağlantı kopyalandı.'); }
    catch { setCopyStatus('Otomatik kopyalanamadı. Bağlantı alanını seçip elle kopyala.'); }
  }
  return <div className={`app ${settings.theme}`}>
    <header className="topbar"><a className="brand" href="/"><PixelHamster /><span>SQUEEK<span className="brand-light"> / LIVE COMPANION</span></span></a><span className="version">YAYIN STÜDYOSU · v0.1</span></header>
    <main>
      <div className="intro"><div><p className="eyebrow">ZİNCİRİN RİTMİ, YAYININDA.</p><h1>Yayınına biraz<br /><em>Squeek</em> kat.</h1><p>Olayları görsel tepkilere dönüştür. Sahneni tasarla, OBS'ye ekle.</p></div>
        <div className="mode-card"><label htmlFor="data-mode">Veri kaynağı</label><select id="data-mode" value={settings.mode} onChange={e => change('mode', e.target.value as Settings['mode'])}><option value="demo">Demo — örnek veri</option><option value="live">Canlı — Squeekchain olayları</option></select>{settings.mode === 'demo' && <DemoBadge />}<p>Canlı hata durumunda demo açılmaz.</p></div></div>
      {storageWarning && <p className="warning" role="status">{storageWarning}</p>}
      <div className="workspace">
        <section className="settings panel" aria-labelledby="settings-title"><div className="section-heading"><span className="step">01</span><h2 id="settings-title">Görünümünü ayarla</h2></div>
          <label htmlFor="theme">Tema</label><select id="theme" value={settings.theme} onChange={e => change('theme', e.target.value as Settings['theme'])}><option value="dark">Koyu / gece vardiyası</option><option value="light">Açık / gün ışığı</option></select>
          <label htmlFor="color">Vurgu rengi <span className="value">{settings.color}</span></label><div className="color-row"><input id="color" type="color" value={settings.color} onChange={e => change('color', e.target.value)} /><div className="swatches">{['#b9f568', '#83cfff', '#ffadce', '#f7cd73'].map(color => <button key={color} aria-label={`Vurgu rengi ${color}`} aria-pressed={settings.color === color} style={{ backgroundColor: color }} onClick={() => change('color', color)} />)}</div></div>
          <label htmlFor="position">Bildirim konumu</label><select id="position" value={settings.position} onChange={e => change('position', e.target.value as Settings['position'])}>{positions.map(p => <option key={p} value={p}>{positionNames[p]}</option>)}</select>
          <label htmlFor="font-size">Yazı boyutu <span className="value">{settings.fontSize} px</span></label><input id="font-size" type="range" min="16" max="36" value={settings.fontSize} onChange={e => change('fontSize', Number(e.target.value))} />
          <fieldset className="notification-settings"><legend>Bildirim davranışı</legend>
            <label htmlFor="duration">Ekranda kalma <span className="value">{settings.duration} sn</span></label>
            <input id="duration" type="range" min="3" max="10" value={settings.duration} onChange={e => change('duration', Number(e.target.value))} />
            <label htmlFor="gap">Bildirimler arası bekleme <span className="value">{settings.gap} sn</span></label>
            <input id="gap" type="range" min="0" max="30" value={settings.gap} onChange={e => change('gap', Number(e.target.value))} />
            <label className="toggle"><input type="checkbox" checked={settings.settlement} onChange={e => change('settlement', e.target.checked)} /> Hesaplaşma tamamlandı</label>
            <label className="toggle"><input type="checkbox" checked={settings.milestone} onChange={e => change('milestone', e.target.checked)} /> Günlük mesafe kilometre taşı</label>
          </fieldset>
          <p className="hint">Ayarlar bu tarayıcıda saklanır. Ses ve cüzdan bağlantısı kullanılmaz.</p>
        </section>
        <section className="preview-section" aria-labelledby="preview-title"><div className="preview-heading"><div className="section-heading"><span className="step">02</span><h2 id="preview-title">Sahnede nasıl duruyor?</h2></div><span className="preview-size">16:9 ÖNİZLEME</span></div>
          <div className="preview-frame"><DataScene key={settings.mode} settings={settings} event={event} preview /></div>
          <div className="test-bar"><div><strong>Biraz hareket katalım.</strong><p>İki örnek olay, seçtiğin süre ve tetikleyici ayarlarıyla sıraya alınır.</p></div><button className="primary" disabled={settings.mode !== 'demo'} onClick={trigger}>▶ Demo olayını dene</button></div>
        </section>
      </div>
      <section className="obs panel" aria-labelledby="obs-title"><div className="section-heading"><span className="step">03</span><h2 id="obs-title">OBS'ye taşı</h2><span className="tag">BROWSER SOURCE</span></div>
        <div className="obs-grid"><div><p>OBS'de <strong>Kaynaklar → + → Tarayıcı</strong> seç. Bağlantıyı URL alanına yapıştır; genişliği <strong>1920</strong>, yüksekliği <strong>1080</strong> yap.</p><p className="hint">Bağımsız overlay, 8 saniyede bir demo olayı oynatır. Ayar değiştirdiğinde yeni URL'yi OBS'ye yapıştır. Paneli açık tutman gerekmez.</p></div><div><label htmlFor="obs-url">Overlay bağlantısı</label><div className="url-row"><input id="obs-url" readOnly value={url} onFocus={e => e.currentTarget.select()} /><button onClick={copy}>Kopyala</button></div><div className="link-row"><a href={url} target="_blank" rel="noreferrer">Overlay'i yeni sekmede aç ↗</a><span role="status">{copyStatus}</span></div></div></div>
      </section>
      <footer><span>SQUEEK LIVE COMPANION</span><span>Demo ve canlı veri ayrı tutulur. Cüzdan veya rozet işlemi içermez.</span></footer>
    </main>
  </div>;
}
createRoot(document.getElementById('root')!).render(<StrictMode>{isOverlay ? <OverlayPage /> : <ControlPanel />}</StrictMode>);
