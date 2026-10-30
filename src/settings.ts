export const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
export type Position = typeof positions[number];
export interface Settings {
  version: 1;
  mode: 'demo';
  theme: 'dark' | 'light';
  color: string;
  position: Position;
  fontSize: number;
}
export const defaults: Settings = {
  version: 1, mode: 'demo', theme: 'dark', color: '#b9f568',
  position: 'bottom-left', fontSize: 24,
};
export const storageKey = 'squeek-companion.settings.v1';

export function parseSettings(raw: string): Settings {
  if (raw.length > 1500) throw new Error('Ayar bağlantısı çok uzun.');
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object') throw new Error('Ayar biçimi geçersiz.');
  const s = value as Record<string, unknown>;
  const allowed = Object.keys(defaults);
  if (Object.keys(s).some(key => !allowed.includes(key)) ||
      s.version !== 1 || s.mode !== 'demo' ||
      (s.theme !== 'dark' && s.theme !== 'light') ||
      typeof s.color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(s.color) ||
      !positions.includes(s.position as Position) ||
      typeof s.fontSize !== 'number' || !Number.isInteger(s.fontSize) ||
      s.fontSize < 16 || s.fontSize > 36) {
    throw new Error('Ayarlar geçersiz veya sürüm desteklenmiyor. Panelden yeni URL oluştur.');
  }
  return { version: 1, mode: 'demo', theme: s.theme, color: s.color,
    position: s.position as Position, fontSize: s.fontSize };
}
export function readStoredSettings(): Settings {
  const saved = localStorage.getItem(storageKey);
  return saved ? parseSettings(saved) : { ...defaults };
}
export function overlayUrl(settings: Settings): string {
  const url = new URL('/overlay', window.location.origin);
  url.hash = encodeURIComponent(JSON.stringify(settings));
  return url.href;
}
