import {useEffect,useRef,useState} from 'react';
import {boost,createGame,step} from './arena';
import {useLive} from './useLive';
import './arena.css';
const directions = [{label:'Yukarı',key:'ArrowUp',symbol:'↑'},{label:'Sol',key:'ArrowLeft',symbol:'←'},{label:'Aşağı',key:'ArrowDown',symbol:'↓'},{label:'Sağ',key:'ArrowRight',symbol:'→'}];
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
 return <main className="arena"><a href="/">← Yayın paneli</a><h1>Hamster Event Arena</h1><p id="arena-help">60 saniyede tohumları topla. Ok tuşları / WASD veya yön düğmelerini basılı tut. Klavye için oyun alanına odaklan.</p>
 <label>Olay kaynağı <select value={demo?'demo':'live'} onChange={e=>{setDemo(e.target.value==='demo');reset();}}><option value="demo">DEMO — örnek olaylar</option><option value="live">Canlı API</option></select></label>
 <p role="status">{demo?'DEMO — bonusları örnek olay düğmeleriyle tetikle.':live.message+' Oyun bağlantıdan bağımsız oynanır.'}</p>
 <p className="arena-score">Puan: <strong data-testid="score">{game.score}</strong> · Kalan: <span data-testid="time">{Math.ceil(game.time)}</span> sn · <span role="status">{game.time<=0?'Tur bitti':game.running?'Oynanıyor':'Hazır / duraklatıldı'}</span></p>
 <p>Puan ×{game.bonus>0?2:1} ({Math.ceil(game.bonus)} sn) · Hız {game.speed>0?'güçlendirilmiş':'normal'} ({Math.ceil(game.speed)} sn)</p>
 <div ref={field} tabIndex={0} role="group" aria-label="Hamster oyun alanı" aria-describedby="arena-help" className="arena-field"><span className="arena-seed" aria-label="Tohum" style={{left:game.targetX+'%',top:game.targetY+'%'}}>🌻</span><span className="arena-hamster" aria-label="Hamster" style={{left:game.x+'%',top:game.y+'%'}}>🐹</span></div>
 <div className="arena-actions"><button disabled={game.time<=0} onClick={()=>{keys.current.clear();setGame(g=>({...g,running:!g.running}));field.current?.focus();}}>{game.running?'Duraklat':'Başlat / devam et'}</button><button onClick={reset}>Yeniden başlat</button></div>
 <div className="arena-actions" aria-label="Yön kontrolleri">{directions.map(({label,key,symbol})=><button className="arena-direction" key={key} aria-label={label} disabled={!game.running} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keys.current.add(key);}} onPointerUp={()=>keys.current.delete(key)} onPointerCancel={()=>keys.current.delete(key)} onLostPointerCapture={()=>keys.current.delete(key)} onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();keys.current.add(key);}}} onKeyUp={()=>keys.current.delete(key)} onBlur={()=>keys.current.delete(key)}>{symbol}</button>)}</div>
 {demo&&<div className="arena-actions"><button disabled={!game.running} onClick={()=>setGame(g=>boost(g,'system.settlement_completed'))}>DEMO: 8 sn çift puan</button><button disabled={!game.running} onClick={()=>setGame(g=>boost(g,'measurement.daily_distance_milestone'))}>DEMO: 8 sn hız</button></div>}
 <p>OBS: Tarayıcı Kaynağı → /arena → sağ tık → Etkileşim (Interact). Odak kaybolunca oyun duraklar. Gerçek OBS ve canlı olay testi beklemede.</p></main>;
}
