export interface LiveEvent { id: string; type: string; occurredAt: string }
export interface LiveContract {
  schemaVersion: string | number;
  eventTypes: readonly string[];
  pollMs: number;
  staleMs: number;
}
// No official version, event type names or polling cadence could be read.
// Leave disabled rather than guess. Tests inject a synthetic contract.
export const verifiedContract: LiveContract | null = null;
export const liveBlocker = 'Canlı mod bloke: şema sürümü, olay türleri ve polling kuralı henüz doğrulanmadı.';
export type LiveState = 'blocked' | 'loading' | 'ready' | 'empty' | 'unavailable' | 'stale' | 'error' | 'rate-limited';
export interface LiveSnapshot { state: LiveState; message: string; events: LiveEvent[]; lastChecked?: number }
function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
export function parseEvents(value: unknown, contract: LiveContract): LiveEvent[] | null {
  if (!record(value) || value.schemaVersion !== contract.schemaVersion) throw new Error('Desteklenmeyen şema sürümü.');
  if (value.status === 'unavailable') return null;
  if (!Array.isArray(value.events)) throw new Error('Olay listesi geçersiz.');
  return value.events.map(event => {
    if (!record(event) || typeof event.id !== 'string' || !event.id ||
        typeof event.type !== 'string' || !event.type || typeof event.occurredAt !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}T/.test(event.occurredAt) || !Number.isFinite(Date.parse(event.occurredAt))) {
      throw new Error('Olay alanları geçersiz.');
    }
    return { id: event.id, type: event.type, occurredAt: event.occurredAt };
  });
}
export function retryDelay(value: string | null, now: number, fallback: number): number {
  if (!value) return fallback;
  const delay = /^\d+$/.test(value) ? Number(value) * 1000 : Date.parse(value) - now;
  return Number.isFinite(delay) ? Math.max(fallback, delay) : fallback;
}

export class LiveDataProvider {
  private contract: LiveContract | null;
  private request: typeof fetch;
  private seen = new Set<string>();
  private baseline = false;
  private etag: string | null = null;
  private cache: LiveEvent[] | null = null;
  private lastChecked?: number;
  private running = false;
  private controller?: AbortController;
  constructor(contract: LiveContract | null = verifiedContract, request: typeof fetch = fetch) {
    this.contract = contract;
    this.request = request;
  }
  start(onSnapshot: (snapshot: LiveSnapshot) => void): () => void {
    const c = this.contract;
    if (!c || c.eventTypes.length < 1 || c.eventTypes.length > 2 || c.pollMs <= 0 || c.staleMs < c.pollMs) {
      onSnapshot({ state: 'blocked', message: liveBlocker, events: [] });
      return () => {};
    }
    this.running = true;
    let timer: ReturnType<typeof setTimeout>;
    let failures = 0;
    let current: LiveSnapshot = { state: 'loading', message: 'Canlı veriye bağlanılıyor.', events: [] };
    onSnapshot(current);
    const publish = (state: LiveState, message: string, events: LiveEvent[] = []) => {
      current = { state, message, events, lastChecked: this.lastChecked };
      if (this.running) onSnapshot(current);
    };
    const staleTimer = setInterval(() => {
      if (this.lastChecked !== undefined && Date.now() - this.lastChecked >= c.staleMs && current.state !== 'stale') {
        this.baseline = false;
        publish('stale', 'Son veri kontrolü gecikti; bildirimler durduruldu.');
      }
    }, Math.min(c.staleMs, 1000));
    const poll = async () => {
      let delay = c.pollMs;
      this.controller = new AbortController();
      const timeout = setTimeout(() => this.controller?.abort(), Math.min(c.pollMs, 15000));
      try {
        const response = await this.request('https://api.squeekchain.com/v1/events', {
          method: 'GET', credentials: 'omit', signal: this.controller.signal,
          headers: this.etag ? { 'If-None-Match': this.etag } : {},
        });
        if (!this.running) return;
        if (response.status === 429) {
          failures++;
          delay = retryDelay(response.headers.get('Retry-After'), Date.now(), Math.min(c.pollMs * 2 ** Math.min(failures, 6), 3600000));
          this.baseline = false;
          publish('rate-limited', 'İstek sınırı; Retry-After süresi bekleniyor.');
        } else {
          if (response.status !== 304 && !response.ok) throw new Error(`HTTP ${response.status}`);
          const events = response.status === 304 ? this.cache : parseEvents(await response.json(), c);
          if (response.status === 304 && !this.cache) throw new Error('304 için geçerli önbellek yok.');
          if (!events) {
            this.cache = null; this.etag = null; this.baseline = false;
            publish('unavailable', 'API veriyi şu an sunamıyor; bildirim yok.');
          } else {
            const newEvents: LiveEvent[] = [];
            for (const event of [...events].sort((a,b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt))) {
              if (this.baseline && !this.seen.has(event.id) && c.eventTypes.includes(event.type)) newEvents.push(event);
              this.seen.add(event.id);
            }
            this.baseline = true;
            this.cache = events;
            this.etag = response.status === 304 ? this.etag : response.headers.get('ETag');
            this.lastChecked = Date.now(); failures = 0;
            publish(events.length ? 'ready' : 'empty', events.length ? 'Son kontrol başarılı.' : 'Henüz olay yok.', newEvents.slice(-5));
          }
        }
      } catch (error) {
        if (!this.running) return;
        failures++;
        this.baseline = false;
        delay = Math.min(c.pollMs * 2 ** Math.min(failures, 6), 3600000);
        publish('error', error instanceof Error ? error.message : 'Bağlantı hatası.');
      } finally {
        clearTimeout(timeout);
        if (this.running) timer = setTimeout(poll, Math.min(delay, 2147483647));
      }
    };
    void poll();
    return () => { this.running = false; clearTimeout(timer); clearInterval(staleTimer); this.controller?.abort(); };
  }
}
