// Internal example events, not a claimed representation of the public API.
export interface DemoEvent {
  id: string;
  source: 'demo';
  kind: 'sample-block' | 'sample-hamster';
  title: string;
  message: string;
  timestamp: string;
}
export interface DemoDataSource { next(): DemoEvent }
const samples = [
  { kind: 'sample-block', title: 'Yeni bir ritim!', message: 'Örnek blok olayı yayınına ulaştı.' },
  { kind: 'sample-hamster', title: 'Hamster iş başında!', message: 'Örnek hamster hareketi algılandı.' },
] as const;
export function createDemoSource(): DemoDataSource {
  let sequence = 0;
  return { next() {
    const sample = samples[sequence % samples.length];
    sequence += 1;
    return { ...sample, id: `demo-${sequence}`, source: 'demo', timestamp: new Date().toISOString() };
  } };
}
