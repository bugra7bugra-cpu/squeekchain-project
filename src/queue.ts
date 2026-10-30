export interface QueueEvent { id: string; kind: string }
// Five waiting notifications plus the one currently on screen. Oldest waiting
// notification is discarded on overflow; the active notification is never cut off.
export class NotificationQueue<T extends QueueEvent> {
  private pending: T[] = [];
  private seen = new Set<string>();
  private active: T | null = null;
  private endsAt = 0;
  private nextAt = 0;
  enqueue(events: T[]) {
    for (const event of events) {
      if (this.seen.has(event.id)) continue;
      this.seen.add(event.id);
      if (this.seen.size > 2000) this.seen.delete(this.seen.values().next().value!);
      this.pending.push(event);
      if (this.pending.length > 5) this.pending.shift();
    }
  }
  clear() { this.pending = []; this.active = null; this.endsAt = 0; this.nextAt = 0; }
  tick(now: number, durationMs: number, gapMs: number, allowed: (event: T) => boolean) {
    this.pending = this.pending.filter(allowed);
    if (this.active && (!allowed(this.active) || now >= this.endsAt)) {
      this.active = null;
      this.nextAt = now + gapMs;
    }
    if (!this.active && now >= this.nextAt && this.pending.length) {
      this.active = this.pending.shift()!;
      this.endsAt = now + durationMs;
    }
    return { event: this.active, waiting: this.pending.length };
  }
}
