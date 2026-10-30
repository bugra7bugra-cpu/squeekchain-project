import {useEffect,useRef,useState} from 'react';
import {boost,createGame,step} from './arena';
import {useLive} from './useLive';
import './arena.css';
export function Arena(){
 const [game,setGame]=useState(createGame);
 const [demo,setDemo]=useState(true);
 const keys=useRef(new Set<string>());
 const live=useLive(!demo);
 useEffect(()=>{if(!demo)setGame(g=>live.events.reduce((s,e)=>boost(s,e.type),g));},[live,demo]);
 useEffect(()=>{
  const down=(e:KeyboardEvent)=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){e.preventDefault();keys.current.add(e.key);}};
  const up=(e:KeyboardEvent)=>{keys.current.delete(e.key);};
  const blur=()=>{keys.current.clear();setGame(g=>({...g,running:false}));};
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
  let last=performance.now();
  const timer=setInterval(()=>{const now=performance.now();const dt=Math.min(.1,(now-last)/1000);last=now;const k=keys.current;setGame(g=>step(g,Number(k.has('ArrowRight')||k.has('d'))-Number(k.has('ArrowLeft')||k.has('a')),Number(k.has('ArrowDown')||k.has('s'))-Number(k.has('ArrowUp')||k.has('w')),dt));},20);
  return()=>{clearInterval(timer);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);};
 },[]);
 const reset=()=>{keys.current.clear();setGame(createGame());};
 return <main className="arena"><a href="/">← Yayın paneli</a><h1>Hamster Event Arena</h1><p>60 saniyede tohumları topla. Ok tuşları / WASD veya yön düğmeleri.</p>
 <label>Olay kaynağı <select value={demo?'demo':'live'} onChange={e=>{setDemo(e.target.value==='demo');reset();}}><option value="demo">DEMO — örnek olaylar</option><option value="live">Canlı API</option></select></label>
 <p role="status">{demo?'DEMO — bonusları örnek olay düğmeleriyle tetikle.':live.message+' Oyun bağlantıdan bağımsız oynanır.'}</p>
 <p>Puan: <strong>{game.score}</strong> · Kalan: {Math.ceil(game.time)} sn · {game.time<=0?'Tur bitti':game.running?'Oynanıyor':'Hazır / duraklatıldı'}</p>
 <p>Puan ×{game.bonus>0?2:1} ({Math.ceil(game.bonus)} sn) · Hız {game.speed>0?'güçlendirilmiş':'normal'} ({Math.ceil(game.speed)} sn)</p>
 <div className="arena-field" aria-label="Hamster oyun alanı"><span style={{left:game.targetX+'%',top:game.targetY+'%'}}>🌻</span><span style={{left:game.x+'%',top:game.y+'%'}}>🐹</span></div>
 <div className="arena-actions"><button disabled={game.time<=0} onClick={()=>setGame(g=>({...g,running:!g.running}))}>{game.running?'Duraklat':'Başlat / devam et'}</button><button onClick={reset}>Yeniden başlat</button></div>
 <div className="arena-actions">{[['↑',0,-1],['←',-1,0],['↓',0,1],['→',1,0]].map(([label,x,y])=><button key={label} aria-label={'Hareket '+label} onClick={()=>setGame(g=>step(g,Number(x),Number(y),.15))}>{label}</button>)}</div>
 {demo&&<div className="arena-actions"><button disabled={!game.running} onClick={()=>setGame(g=>boost(g,'system.settlement_completed'))}>DEMO: 8 sn çift puan</button><button disabled={!game.running} onClick={()=>setGame(g=>boost(g,'measurement.daily_distance_milestone'))}>DEMO: 8 sn hız</button></div>}
 <p>OBS: Tarayıcı Kaynağı → /arena → sağ tık → Etkileşim (Interact). Odak kaybolunca oyun duraklar.</p></main>;
}
