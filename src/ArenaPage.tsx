import {useEffect,useRef,useState} from 'react';
import {boost,createGame,step} from './arena';
import {useLive} from './useLive';
import './arena.css';
const directions = [{label:'Up',key:'ArrowUp',symbol:'↑'},{label:'Left',key:'ArrowLeft',symbol:'←'},{label:'Down',key:'ArrowDown',symbol:'↓'},{label:'Right',key:'ArrowRight',symbol:'→'}];
export function Arena(){
 const [game,setGame]=useState(createGame);
 const [demo,setDemo]=useState(true);
 const keys=useRef(new Set<string>());
 const field=useRef<HTMLDivElement>(null);
 const live=useLive(!demo);
 useEffect(()=>{
  if(demo)return;
  setGame(g=>['ready','empty'].includes(live.state)?live.events.reduce((s,e)=>boost(s,e.type),g):{...g,bonus:0,speed:0});
 },[live,demo]);
 useEffect(()=>{
  const down=(e:KeyboardEvent)=>{
   if(e.target instanceof HTMLElement && e.target.closest('button,select,input,a'))return;
   const key=e.key.length===1?e.key.toLowerCase():e.key;
   if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(key)){e.preventDefault();keys.current.add(key);}
  };
  const up=(e:KeyboardEvent)=>{keys.current.delete(e.key.length===1?e.key.toLowerCase():e.key);};
  const pause=()=>{keys.current.clear();setGame(g=>({...g,running:false}));};
  const visibility=()=>{if(document.hidden)pause();};
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',pause);document.addEventListener('visibilitychange',visibility);
  let last=performance.now();
  const timer=setInterval(()=>{const now=performance.now();const dt=Math.max(0,(now-last)/1000);last=now;const k=keys.current;setGame(g=>step(g,Number(k.has('ArrowRight')||k.has('d'))-Number(k.has('ArrowLeft')||k.has('a')),Number(k.has('ArrowDown')||k.has('s'))-Number(k.has('ArrowUp')||k.has('w')),dt));},20);
  return()=>{clearInterval(timer);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',pause);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 const reset=()=>{keys.current.clear();setGame(createGame());};
 return <main className="arena"><a href="/">← Stream control panel</a><h1>Hamster Event Arena</h1><p id="arena-help">Collect seeds in 60 seconds. Use arrow keys / WASD or hold the direction buttons. Focus the game area to use the keyboard.</p>
 <label>Event source <select value={demo?'demo':'live'} onChange={e=>{setDemo(e.target.value==='demo');reset();}}><option value="demo">DEMO — sample events</option><option value="live">Live API</option></select></label>
 <p role="status">{demo?'DEMO — trigger bonuses with the sample event buttons.':live.message+' You can play without an API connection.'}</p>
 <p className="arena-score">Score: <strong data-testid="score">{game.score}</strong> · Time left: <span data-testid="time">{Math.ceil(game.time)}</span> s · <span role="status">{game.time<=0?'Round over':game.running?'Playing':'Ready / paused'}</span></p>
 <p>Score ×{game.bonus>0?2:1} ({Math.ceil(game.bonus)} s) · Speed {game.speed>0?'boosted':'normal'} ({Math.ceil(game.speed)} s)</p>
 <div ref={field} tabIndex={0} role="group" aria-label="Hamster game area" aria-describedby="arena-help" className="arena-field"><span className="arena-seed" aria-label="Seed" style={{left:game.targetX+'%',top:game.targetY+'%'}}>🌻</span><span className="arena-hamster" aria-label="Hamster" style={{left:game.x+'%',top:game.y+'%'}}>🐹</span></div>
 <div className="arena-actions"><button disabled={game.time<=0} onClick={()=>{keys.current.clear();setGame(g=>({...g,running:!g.running}));field.current?.focus();}}>{game.running?'Pause':'Start / resume'}</button><button onClick={reset}>Restart</button></div>
 <div className="arena-actions" aria-label="Direction controls">{directions.map(({label,key,symbol})=><button className="arena-direction" key={key} aria-label={label} disabled={!game.running} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keys.current.add(key);}} onPointerUp={()=>keys.current.delete(key)} onPointerCancel={()=>keys.current.delete(key)} onLostPointerCapture={()=>keys.current.delete(key)} onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();keys.current.add(key);}}} onKeyUp={()=>keys.current.delete(key)} onBlur={()=>keys.current.delete(key)}>{symbol}</button>)}</div>
 {demo&&<div className="arena-actions"><button disabled={!game.running} onClick={()=>setGame(g=>boost(g,'system.settlement_completed'))}>DEMO: 8s double score</button><button disabled={!game.running} onClick={()=>setGame(g=>boost(g,'measurement.daily_distance_milestone'))}>DEMO: 8s speed boost</button></div>}
 <p>OBS: Browser Source → /arena → right-click → Interact. The game pauses when focus is lost. Real OBS and live event testing are pending.</p></main>;
}
