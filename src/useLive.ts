import { useEffect, useState } from 'react';
import { LiveDataProvider } from './live';
import type { LiveSnapshot } from './live';
export function useLive(enabled: boolean) {
  const [snapshot, setSnapshot] = useState<LiveSnapshot>({state:'loading', message:'Waiting for a connection.',events:[]});
  useEffect(() => {
    if (!enabled) return;
    return new LiveDataProvider().start(setSnapshot);
  }, [enabled]);
  return snapshot;
}
