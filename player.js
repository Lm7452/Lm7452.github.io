const content=document.querySelector('#content'),loaded=document.querySelector('#loaded'),statusLine=document.querySelector('#status');
let active=null,busy=false,version=0;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function tape(p){return `<svg class="cassette-art" viewBox="0 0 320 200" aria-hidden="true"><defs><linearGradient id="shell-${p.id}" x2="0" y2="1"><stop stop-color="#e98653"/><stop offset="1" stop-color="#b74e2c"/></linearGradient></defs><rect x="3" y="3" width="314" height="194" rx="15" fill="url(#shell-${p.id})" stroke="#20271f" stroke-width="5"/><rect x="12" y="12" width="296" height="174" rx="10" fill="none" stroke="#f6aa79" stroke-opacity=".6"/><path d="M22 26H298V139H22Z" fill="#f1dfaf" stroke="#723f29" stroke-width="2"/><path d="M22 30H298V39H22M22 128H298V136H22" stroke="#b34e30" stroke-width="5"/><text x="35" y="56" fill="#27352c" font-family="monospace" font-size="10">${p.side}</text><text x="35" y="85" fill="#1d2a24" font-family="'Segoe Print','Bradley Hand','Comic Sans MS',cursive" font-weight="bold" font-style="italic" font-size="29" transform="rotate(-2 35 85)">${p.name}</text><rect x="40" y="96" width="240" height="48" rx="22" fill="#333b32" stroke="#a39672" stroke-width="3"/><path d="M79 103H241M79 137H241" stroke="#a47545" stroke-width="3"/><rect x="127" y="106" width="66" height="28" rx="3" fill="#7b846e" stroke="#171e18" stroke-width="2"/><path d="M134 109V131M140 109V131M180 109V131M186 109V131" stroke="#4a5143"/><g fill="#e4d7b2" stroke="#1e2921" stroke-width="3"><circle cx="80" cy="120" r="21"/><circle cx="240" cy="120" r="21"/></g><g fill="#27342a" stroke="#e4d7b2" stroke-width="2"><circle cx="80" cy="120" r="10"/><circle cx="240" cy="120" r="10"/></g><g class="hub hub-left" stroke="#29372b" stroke-width="4"><path d="M80 100V110M80 130V140M60 120H70M90 120H100"/></g><g class="hub hub-right" stroke="#29372b" stroke-width="4"><path d="M240 100V110M240 130V140M220 120H230M250 120H260"/></g><path d="M94 155H226L243 190H77Z" fill="#b85a36" stroke="#7b3a27" stroke-width="2"/><g fill="#263229"><circle cx="105" cy="177" r="6"/><circle cx="215" cy="177" r="6"/><circle cx="132" cy="179" r="3"/><circle cx="188" cy="179" r="3"/></g><path d="M143 172H177V185H143Z" fill="#433b2c"/><text x="35" y="163" fill="#3b3425" font-family="monospace" font-size="10">LM</text><text x="268" y="163" fill="#3b3425" font-family="monospace" font-size="10">C60</text>${[[18,18],[302,18],[18,181],[302,181]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#c7b78d" stroke="#593c2a"/><path d="M${x-3} ${y}h6" stroke="#493c2d"/>`).join('')}</svg>`}

function controls(on){for(const id of ['prev','play','next','eject'])document.getElementById(id).disabled=!on}
function render(id,focus=false){const p=projects.find(p=>p.id===id);active=p||null;controls(!!p);document.querySelector('#play').innerHTML=p?.id==='dejavu'?'▶<small>PLAY GAME ↗</small>':p?'▶<small>READ WORK</small>':'▶<small>PLAY</small>';document.querySelector('#play').setAttribute('aria-label',p?.id==='dejavu'?'Play Deja Vu game in this tab':p?'Read '+p.name+' case study':'Play');
 if(p){loaded.innerHTML=`<div class="tape">${tape(p)}</div>`;statusLine.textContent=`LOADED / ${p.name.toUpperCase()} / ${p.side}`;content.innerHTML=stories[p.id];content.querySelector('h1').tabIndex=-1;document.title=`${p.name} · Lynn Morris`;}
 else{loaded.innerHTML='<span class="empty">INSERT A PROJECT<br>↓ SELECT A TAPE</span>';statusLine.textContent='READY / NO TAPE LOADED';content.innerHTML=`<div class="collection-intro"><span class="eyebrow">GAMES + AI / ML · SELECTED WORK</span><h1>Lynn Morris<span class="accent">.</span></h1><p class="lead">A collection worth playing.</p><p>Pick a cassette to load the project. The deck stays with you as you explore.</p></div><div class="shelf">${projects.map(p=>`<article><a class="tape" href="#${p.id}" aria-label="Load ${p.name}">${tape(p)}</a><p class="tape-caption">${p.summary}</p></article>`).join('')}</div>`;document.title='Lynn Morris · Tape collection';}
 content.scrollTop=0;updatePosition();requestAnimationFrame(updatePosition);
 if(focus){(content.querySelector('h1')||content).focus({preventScroll:true});}}
async function load(id){if(busy)return;const p=projects.find(p=>p.id===id);if(!p){location.hash='collection';return}busy=true;const v=++version;controls(false);statusLine.textContent=`LOADING / ${p.name.toUpperCase()}`;loaded.innerHTML=`<div class="tape inserting">${tape(p)}</div>`;await new Promise(r=>setTimeout(r,reduced()?0:500));if(v!==version)return;busy=false;if(location.hash==='#'+id)render(id,true);else location.hash=id;}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);if(projects.some(p=>p.id===id)){e.preventDefault();load(id)}});
window.addEventListener('hashchange',()=>{version++;busy=false;render(location.hash.slice(1),true)});
document.querySelector('#prev').onclick=()=>load(projects[(projects.indexOf(active)+projects.length-1)%projects.length].id);
document.querySelector('#next').onclick=()=>load(projects[(projects.indexOf(active)+1)%projects.length].id);
document.querySelector('#eject').onclick=()=>{location.hash='collection'};
document.querySelector('#play').onclick=()=>{if(active?.id==='dejavu')location.href='https://simothy03.github.io/dejavu-hosted/';else if(active){const heading=content.querySelector('h2');if(heading){heading.tabIndex=-1;heading.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});heading.focus({preventScroll:true});statusLine.textContent='READING / '+active.name.toUpperCase();}}};
// Recordings are opt-in; return to stills when reduced motion is requested.
document.addEventListener('click',e=>{const button=e.target.closest('.recording');if(!button)return;const on=button.getAttribute('aria-pressed')!=='true';button.parentElement.querySelector('img').src=on?button.dataset.recording:button.dataset.still;button.setAttribute('aria-pressed',String(on));button.textContent=on?'Stop recording':'Play recording';});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches)document.querySelectorAll('.recording[aria-pressed="true"]').forEach(b=>b.click());});

render(location.hash.slice(1));

function updatePosition(){
 const range=content.scrollHeight-content.clientHeight;
 const progress=range>1?Math.min(1,Math.max(0,content.scrollTop/range)):0;
 document.querySelector('#position').value=progress*100;
 document.querySelector('#position-value').textContent=String(Math.round(progress*100)).padStart(3,'0')+' / 100';
 document.querySelector('.deck').style.setProperty('--reel-angle',(reduced()?0:progress*1080)+'deg');
}
content.addEventListener('scroll',updatePosition,{passive:true});
new ResizeObserver(updatePosition).observe(content);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',updatePosition);
window.addEventListener('resize',updatePosition);
content.addEventListener('load',updatePosition,true);


// Preserve the deck face's aspect ratio while fitting the available shell.
function fitPlayer(){
 const layout=document.querySelector('.deck-layout');
 if(matchMedia('(max-width:800px)').matches){layout.style.removeProperty('--player-width');return;}
 const gap=parseFloat(getComputedStyle(layout).columnGap)||34;
 const scale=Math.max(.1,Math.min((layout.clientHeight-10)/510,(layout.clientWidth-gap-300)/360));
 layout.style.setProperty('--player-scale',scale);
 layout.style.setProperty('--player-width',360*scale+'px');
 layout.style.setProperty('--player-height',510*scale+'px');
}
new ResizeObserver(fitPlayer).observe(document.querySelector('.deck-layout'));
window.addEventListener('resize',fitPlayer);
fitPlayer();
