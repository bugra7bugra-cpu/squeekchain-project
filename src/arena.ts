export const createGame = () => ({ x: 50, y: 50, targetX: 70, targetY: 50, score: 0, time: 60, bonus: 0, speed: 0, running: false });
export type Game = ReturnType<typeof createGame>;
export function boost(g: Game, type: string): Game {
 if (!g.running) return g;
 return type === 'system.settlement_completed' ? {...g, bonus: 8} : type === 'measurement.daily_distance_milestone' ? {...g, speed: 8} : g;
}
export function step(g: Game, dx: number, dy: number, seconds: number, random = Math.random): Game {
 if (!g.running || g.time <= 0) return g;
 const dt = Math.max(0, Math.min(seconds, g.time));
 const length = Math.hypot(dx, dy) || 1;
 const rate = g.speed > 0 ? 40 : 25;
 const x = Math.max(3, Math.min(97, g.x + dx / length * rate * dt));
 const y = Math.max(3, Math.min(97, g.y + dy / length * rate * dt));
 const hit = Math.hypot(x - g.targetX, y - g.targetY) < 6;
 return {...g, x, y, time: g.time-dt, running: g.time > dt, bonus: Math.max(0,g.bonus-dt), speed: Math.max(0,g.speed-dt), score:g.score+(hit?(g.bonus>0?20:10):0), targetX:hit?8+random()*84:g.targetX, targetY:hit?8+random()*84:g.targetY};
}
