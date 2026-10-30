// Internal example events, not a claimed representation of the public API.
export interface DemoEvent {
  id: string;
  source: 'demo' | 'live';
  kind: string;
  title: string;
  message: string;
  timestamp: string;
}
export interface DemoDataSource { next(): DemoEvent }
const samples = [
  { kind: 'system.settlement_completed', title: 'A new rhythm!', message: 'A sample block event reached your stream.' },
  { kind: 'measurement.daily_distance_milestone', title: 'Hamster at work!', message: 'Sample hamster activity detected.' },
] as const;
export function createDemoSource(): DemoDataSource {
  let sequence = 0;
  return { next() {
    const sample = samples[sequence % samples.length];
    sequence += 1;
    return { ...sample, id: `demo-${sequence}`, source: 'demo', timestamp: new Date().toISOString() };
  } };
}
