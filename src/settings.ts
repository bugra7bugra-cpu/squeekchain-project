export const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
export type Position = typeof positions[number];
export interface Settings {
  version: 1;
  mode: 'demo' | 'live';
  theme: 'dark' | 'light';
  color: string;
  position: Position;
  fontSize: number;
  duration: number;
  gap: number;
  settlement: boolean;
  milestone: boolean;
}
export const defaults: Settings = {
  version: 1, mode: 'demo', theme: 'dark', color: '#b9f568',
  position: 'bottom-left', fontSize: 24, duration: 5, gap: 2, settlement: true, milestone: true,
};
export const storageKey = 'squeek-companion.settings.v1';

export function parseSettings(raw: string): Settings {
  if (raw.length > 1500) throw new Error('Settings link is too long.');
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object') throw new Error('Invalid settings format.');
  const s = value as Record<string, unknown>;
  const allowed = Object.keys(defaults);
  if (Object.keys(s).some(key => !allowed.includes(key)) ||
      s.version !== 1 || (s.mode !== 'demo' && s.mode !== 'live') ||
      (s.theme !== 'dark' && s.theme !== 'light') ||
      typeof s.color !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(s.color) ||
      !positions.includes(s.position as Position) ||
      typeof s.fontSize !== 'number' || !Number.isInteger(s.fontSize) ||
      s.fontSize < 16 || s.fontSize > 36) {
    throw new Error('Invalid settings or unsupported version. Create a new URL from the panel.');
  }
  // Missing new fields migrate old v1 URLs/settings without losing appearance.
  const duration = s.duration === undefined ? defaults.duration : s.duration;
  const gap = s.gap === undefined ? defaults.gap : s.gap;
  const settlement = s.settlement === undefined ? defaults.settlement : s.settlement;
  const milestone = s.milestone === undefined ? defaults.milestone : s.milestone;
  if (typeof duration !== 'number' || !Number.isInteger(duration) || duration < 3 || duration > 10 ||
      typeof gap !== 'number' || !Number.isInteger(gap) || gap < 0 || gap > 30 ||
      typeof settlement !== 'boolean' || typeof milestone !== 'boolean') throw new Error('Invalid notification settings.');
  return { version: 1, mode: s.mode, theme: s.theme, color: s.color,
    position: s.position as Position, fontSize: s.fontSize, duration, gap, settlement, milestone };
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
