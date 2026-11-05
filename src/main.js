import {advance,DOOR_X,DOOR_DEPTHS,enteredDoor,nearestDoor,steerTo} from './game/scenes/hub.js';
import {mirrorStrip} from './game/mirror.js';
import {mountRoom,doneToday,isDoneToday} from './rooms/index.js';
import {dateKey} from './rooms/daily.js';
import {IDS,records,stateOf,collection,streak,validDay} from './journey/model.js';
import {mountJournal} from './journey/view.js';
import {setSound,cue} from './journey/sound.js';
import {drawCarpet,salonObjects} from './game/salon.js';
const $=id=>document.getElementById(id);

const copy={
 'pt-BR':{soundOn:'Som ligado',soundOff:'Som desligado',keys:'ou setas para explorar',subtitle:'Quanto mais de perto você olha, menos você vê.',revealed:'Agora caminhe até seu destino.',rooms:['Raciocínio abstrato','Raciocínio verbal','Raciocínio numérico','Raciocínio espacial','Memória e velocidade','Criatividade divergente','Criatividade convergente','Personalidade e forças'],descriptions:['Descobrir a lógica escondida entre formas e padrões.','Explorar relações entre palavras, conceitos e ideias.','Encontrar ritmos e relações no universo dos números.','Imaginar formas, perspectivas e transformações no espaço.','Manter informações em mente e acompanhar o que muda.','Abrir possibilidades e criar conexões inesperadas.','Encontrar o ponto de encontro entre ideias distantes.','Conhecer tendências do seu jeito de ser e agir.'],room:'SALA',soon:'Esta sala ainda está sendo preparada. Por enquanto, você pode explorar a atmosfera e os caminhos do BOWLER TEST.',back:'Voltar ao espaço',close:'Fechar',audioError:'Não foi possível iniciar o áudio. Tente pelo controle de som.',enterKey:'Enter',enterPrompt:'para entrar',tapPrompt:'Toque na porta para entrar',locked:'Dê um passo atrás para revelar os caminhos.',progress:(n)=>`${n}/8 desafios de hoje`,visited:'visitada',loadError:'Falha ao carregar. Recarregue a página.',lines:[['Raciocínio','abstrato'],['Raciocínio','verbal'],['Raciocínio','numérico'],['Raciocínio','espacial'],['Memória','e velocidade'],['Criatividade','divergente'],['Criatividade','convergente'],['Personalidade','e forças']],switchLang:'Switch to English',joystick:'Controle de movimento',doorsLabel:'Salas de exploração'},
 en:{soundOn:'Sound on',soundOff:'Sound off',keys:'or arrow keys to explore',subtitle:'The closer you look, the less you see.',revealed:'Now walk toward your destination.',rooms:['Abstract reasoning','Verbal reasoning','Numerical reasoning','Spatial reasoning','Memory & speed','Divergent creativity','Convergent creativity','Personality & strengths'],descriptions:['Discover the hidden logic between shapes and patterns.','Explore relationships between words, concepts and ideas.','Find rhythms and relationships in the world of numbers.','Imagine shapes, perspectives and transformations in space.','Hold information in mind and follow what changes.','Open up possibilities and make unexpected connections.','Find the meeting point between distant ideas.','Explore tendencies in the way you think and act.'],room:'ROOM',soon:'This room is still being prepared. For now, explore the atmosphere and paths of BOWLER TEST.',back:'Back to the space',close:'Close',audioError:'Audio could not start. Try the sound control.',enterKey:'Enter',enterPrompt:'to step inside',tapPrompt:'Tap the door to step inside',locked:'Take a step back to reveal the paths.',progress:(n)=>`${n}/8 challenges today`,visited:'visited',loadError:'Loading failed. Reload the page.',lines:[['Abstract','reasoning'],['Verbal','reasoning'],['Numerical','reasoning'],['Spatial','reasoning'],['Memory','& speed'],['Divergent','creativity'],['Convergent','creativity'],['Personality','& strengths']],switchLang:'Mudar para português',joystick:'Movement control',doorsLabel:'Exploration rooms'}
};
const portalNames=['abstract','verbal','numerical','spatial','memory','divergent','convergent','personality'];
// Top of each portal's artwork inside its 1024×1536 canvas (bases always rest on the bottom edge).
const PORTAL_TOP=[102,74,113,65,65,113,74,102].map(v=>v/1536);
// Inner portals reveal first, outer ones last: the room "opens up" as you step back.
const REVEAL_ORDER=[3,2,1,0,0,1,2,3];

const store={get(k,f){try{const v=localStorage.getItem('bowlertest.'+k);return v===null?f:JSON.parse(v);}catch{return f;}},set(k,v){try{localStorage.setItem('bowlertest.'+k,JSON.stringify(v));}catch{}}};
let lang=store.get('lang','pt-BR');if(!copy[lang])lang='pt-BR';
let visited=new Set(store.get('visited',[]).filter(i=>Number.isInteger(i)&&i>=0&&i<8));
let started=false,muted=true;
let activeDay=dateKey(),clockDay=activeDay,journeyHistory=[],doorStates=[],keepsakes=[],journalTab=0,pendingPortrait=false;
const collectionImages={},arrivalTimes={};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,coarse=matchMedia('(pointer:coarse)').matches;
let state={x:0,y:0,reveal:0,moving:false,direction:'front',unlocked:false},idleDirection='front',elapsed=0,previous=0,displayReveal=0,modalView=null,focus=null,autoTarget=null,entering=false;
let width=innerWidth,height=innerHeight,cameraX=0,cameraY=0,walkTime=0,lastDirection='front';
let renderQuality=1,frameBudget=16.7,budgetSamples=0;
const keys=new Set(),touch={x:0,y:0},sprites={},portals=[],footprints=[];
const canvas=$('scene'),ctx=canvas.getContext('2d');
const t=()=>copy[lang];

/* ---------- Interface ---------- */
function renderCopy(){
 const c=t();document.documentElement.lang=lang;
 $('language').textContent=lang==='pt-BR'?'EN':'PT';$('language').setAttribute('aria-label',c.switchLang);
 $('sound').textContent=muted?c.soundOff:c.soundOn;$('sound').setAttribute('aria-pressed',String(!muted));
 $('key-label').textContent=c.keys;$('close').setAttribute('aria-label',c.close);$('doors').setAttribute('aria-label',c.doorsLabel);$('joystick').setAttribute('aria-label',c.joystick);
 journeyHistory=records(lang);doorStates=IDS.map(id=>stateOf(id,activeDay,lang));keepsakes=collection(journeyHistory.filter(r=>r.day<=activeDay));
 keepsakes.forEach(p=>{if(p.count&&!collectionImages[p.room]){const im=new Image();im.decoding='async';im.src=`/assets/collection/${p.room}.png`;collectionImages[p.room]=im;}});
 const today=doneToday(activeDay,lang);$('progress').textContent=today?c.progress(today).replace(lang==='pt-BR'?'de hoje':'today',activeDay===dateKey()?(lang==='pt-BR'?'de hoje':'today'):activeDay):'';
 const days=streak(journeyHistory);$('journal').textContent=(lang==='pt-BR'?'Diário':'Journal')+(days?` · ${days}`:'');
 $('archive-banner').hidden=activeDay===dateKey();$('archive-label').textContent=`${lang==='pt-BR'?'Arquivo':'Archive'} · ${activeDay}`;$('return-today').textContent=lang==='pt-BR'?'Voltar para hoje':'Return to today';
 const states=lang==='pt-BR'?{new:'por descobrir',active:'em andamento',done:'concluída'}:{new:'undiscovered',active:'in progress',done:'complete'};
 document.querySelectorAll('.door').forEach((b,i)=>{const strong=b.querySelector('strong');strong.replaceChildren(...c.lines[i].map(line=>{const s=document.createElement('span');s.textContent=line;return s;}));b.setAttribute('aria-label',`${c.room} ${i+1}: ${c.rooms[i]} (${states[doorStates[i]]})`);b.classList.toggle('in-progress',doorStates[i]==='active');b.classList.toggle('done-today',doorStates[i]==='done');});
 renderPrompt(true);if(modalView!==null)renderModal();
}
// Each portal opens its daily challenge (src/rooms). Mounted once per opening; progress is saved per day.
let roomCleanup=null,mountedView=null;
function renderModal(){
 if(mountedView===modalView)return;
 roomCleanup?.();roomCleanup=null;mountedView=modalView;
 const content=$('modal-content'),view=modalView;
 if(view==='journal'){roomCleanup=mountJournal(content,{lang,day:activeDay,initial:journalTab,onBack:()=>$('modal').close(),onDay:selectDay});return;}
 mountRoom(view,content,{lang,day:activeDay,onBack:()=>$('modal').close(),onChange:()=>renderCopy(),onPortrait:()=>{pendingPortrait=true;$('modal').close();},onFinish:i=>{cue('finish');arrivalTimes[IDS[i]]=null;pendingPortrait=doneToday(activeDay,lang)===8;renderCopy();}}).then(fn=>{if(mountedView===view)roomCleanup=fn;else fn();});
}
function openJournal(tab=0){if($('modal').open||entering)return;keys.clear();resetTouch();autoTarget=null;journalTab=tab;modalView='journal';renderModal();$('modal').showModal();}
function selectDay(day){if(!validDay(day))return;activeDay=day;pendingPortrait=false;if($('modal').open)$('modal').close();renderCopy();}
$('journal').onclick=()=>openJournal();$('return-today').onclick=()=>selectDay(dateKey());
let promptKey='';
function renderPrompt(force){
 const c=t(),i=focus,key=i===null?'':`${lang}${i}`;
 if(!force&&key===promptKey)return;promptKey=key;
 const el=$('prompt');if(i===null||modalView!==null){el.hidden=true;return;}
 el.replaceChildren();
 if(coarse){el.textContent=c.tapPrompt;}else{const k=document.createElement('kbd');k.textContent=c.enterKey;el.append(k,' ',c.enterPrompt);}
 const name=document.createElement('strong');name.textContent=c.rooms[i];el.prepend(name);el.hidden=false;
}
function openRoom(i){
 if(entering||modalView!==null)return;entering=true;autoTarget=null;keys.clear();resetTouch();
 cue('wind');
 const finish=()=>{cue('key');entering=false;modalView=i;visited.add(i);store.set('visited',[...visited]);renderCopy();renderModal();$('modal').showModal();$('veil').classList.remove('on');};
 if(reduced)finish();else{$('veil').classList.add('on');setTimeout(finish,420);}
}
$('modal').addEventListener('close',()=>{const i=modalView;roomCleanup?.();roomCleanup=null;mountedView=null;$('modal-content').replaceChildren();modalView=null;renderCopy();keys.clear();renderPrompt(true);if(typeof i==='number')document.querySelectorAll('.door')[i]?.focus({preventScroll:true});else $('journal').focus({preventScroll:true});if(pendingPortrait){pendingPortrait=false;openJournal();}});
$('close').onclick=()=>$('modal').close();
$('language').onclick=()=>{lang=lang==='pt-BR'?'en':'pt-BR';store.set('lang',lang);renderCopy();};

/* ---------- Sound ---------- */
let audioErrorUntil=0;
// The user's soundtrack stays on the explicit local-preview route, outside public/assets.
const soundtrack=new Audio('/preview/music.mp3');soundtrack.loop=true;soundtrack.volume=.24;soundtrack.preload='none';
let soundChosen=false,soundStarting=false,soundRequest=0;
async function changeSound(enabled){
 const request=++soundRequest;
 if(!enabled){soundStarting=false;soundtrack.pause();muted=true;await setSound(false);renderCopy();return;}
 soundStarting=true;
 try{const effects=setSound(true);await soundtrack.play();await effects;if(request!==soundRequest)return;muted=false;soundChosen=true;}
 catch{if(request!==soundRequest)return;soundtrack.pause();await setSound(false);muted=true;audioErrorUntil=elapsed+5;}
 finally{if(request===soundRequest){soundStarting=false;renderCopy();}}
}
function movementSound(){if(!soundChosen&&!soundStarting)void changeSound(true);}
$('sound').onclick=()=>{soundChosen=true;void changeSound(muted&&!soundStarting);};
$('modal-content').addEventListener('click',e=>{if(e.target.closest('.room-body button:not(:disabled)'))cue('paper');});

/* ---------- Portals (accessible hit areas over the canvas art) ---------- */
for(let i=0;i<8;i++){
 const button=document.createElement('button');button.className='door';button.innerHTML='<strong></strong>';
 button.onclick=()=>{if(!state.unlocked)return;if(focus===i)openRoom(i);else{movementSound();autoTarget=i;}};
 button.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&state.unlocked){e.preventDefault();e.stopPropagation();openRoom(i);}});
 $('doors').append(button);
 const img=new Image();img.decoding='async';img.onload=()=>{footprints[i]=baseProfile(img);};img.src=`/assets/environments/portals/${portalNames[i]}.png`;portals.push(img);
}
// The marble bases are not perfectly level in the artwork (corners sit up to ~20 px above the image edge),
// so the contact shadow follows the real lowest opaque pixel of each column instead of the image bottom.
function baseProfile(img){
 const cw=160,ch=768,c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0,cw,ch);
 const data=g.getImageData(0,0,cw,ch).data,points=[];
 for(let x=0;x<cw;x++){let y=ch-1;while(y>=0&&data[(y*cw+x)*4+3]<128)y--;if(y/ch>.95)points.push([(x+.5)/cw,(y+1)/ch]);}
 return points.length>2?points:null;
}

/* ---------- Layout & input ---------- */
function resize(){width=$('experience').clientWidth;height=$('experience').clientHeight;const ratio=Math.min(devicePixelRatio||1,1.5)*renderQuality;canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);}
window.addEventListener('resize',resize);resize();
const movementKeys=['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'];
window.addEventListener('keydown',e=>{
 if($('modal').open||entering)return;const key=e.key.toLowerCase();
 if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
 if(movementKeys.includes(key)){e.preventDefault();keys.add(key);autoTarget=null;movementSound();}
 else if(focus!==null&&(key==='enter'||key==='e'||key===' ')&&!e.target.closest('button')){e.preventDefault();openRoom(focus);}
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{keys.clear();resetTouch();});
document.addEventListener('visibilitychange',()=>{keys.clear();resetTouch();if(document.hidden)soundtrack.pause();else if(!muted)void changeSound(true);});
let pointer=null,origin={x:0,y:0};
function resetTouch(){pointer=null;touch.x=touch.y=0;$('stick').style.transform='';}
for(const element of [canvas,$('joystick')]){
 element.addEventListener('pointerdown',e=>{if(!started||$('modal').open||pointer!==null)return;pointer=e.pointerId;origin={x:e.clientX,y:e.clientY};autoTarget=null;element.setPointerCapture(pointer);});
 element.addEventListener('pointermove',e=>{if(e.pointerId!==pointer)return;const dx=e.clientX-origin.x,dy=e.clientY-origin.y,d=Math.hypot(dx,dy),s=d>32?32/d:1;touch.x=d<5?0:dx/Math.max(32,d);touch.y=d<5?0:dy/Math.max(32,d);if(d>=5)movementSound();$('stick').style.transform=`translate(${dx*s}px,${dy*s}px)`;});
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])element.addEventListener(ev,resetTouch);
}

/* ---------- Rendering ---------- */
function imageLoad(name,url){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{sprites[name]=img;resolve();};img.onerror=reject;img.src=url;});}
function project(x,y){const depth=y-cameraY;const p=Math.max(.12,Math.min(1.8,Math.exp(depth*.45)));return {x:width/2+(x-cameraX)*Math.max(330,width*.37)*p,y:height*(depth<=0?.32+.46*Math.exp(depth*1.35):.78+depth*.5),scale:p};}
const fogTextures=[false,true].map(light=>{const c=document.createElement('canvas');c.width=c.height=256;const g2=c.getContext('2d');const g=g2.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,light?'rgba(255,255,255,.88)':'rgba(177,193,184,.19)');g.addColorStop(.5,'rgba(235,241,237,.12)');g.addColorStop(1,'rgba(255,255,255,0)');g2.fillStyle=g;g2.fillRect(0,0,256,256);return c;});
const fogField=(()=>{const c=document.createElement('canvas');c.width=1024;c.height=384;const g=c.getContext('2d');for(let i=0;i<15;i++){const x=i/14*1024,y=100+(i%5)*36,r=240+(i%3)*100;g.drawImage(fogTextures[i%2],x-r,y-r*.2,r*2,r*.4);}return c;})();
function drawRoom(time){
 const sky=ctx.createLinearGradient(0,0,0,height);sky.addColorStop(0,'#fff');sky.addColorStop(.36,'#f7f9f7');sky.addColorStop(.5,'#eef2ef');sky.addColorStop(1,'#fbfcfb');ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
 // Very soft floor tint so portals and character share the same ground plane.
 const floorTop=project(0,-3).y;const floor=ctx.createLinearGradient(0,floorTop,0,height);floor.addColorStop(0,'rgba(214,224,217,0)');floor.addColorStop(.25,'rgba(214,224,217,.35)');floor.addColorStop(1,'rgba(240,244,241,.15)');ctx.fillStyle=floor;ctx.fillRect(0,floorTop,width,height-floorTop);
 // Two precomposed layers instead of fifteen large alpha-blended clouds per frame.
 for(let i=0;i<2;i++){const drift=reduced?0:Math.sin(time*.10+i*2)*width*.12,x=-width*.22+drift-Math.sin(cameraX*.4)*width*.12,y=height*(.35+i*.16)-Math.sin(cameraY*.4)*height*.1;ctx.globalAlpha=i?.6:1;ctx.drawImage(fogField,x,y,width*1.45,height*.43);}ctx.globalAlpha=1;
}
function ellipse(x,y,rx,ry,stops,angle=0){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(1,ry/rx);const g=ctx.createRadialGradient(0,0,0,0,0,rx);for(const [o,c] of stops)g.addColorStop(o,c);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,rx,0,Math.PI*2);ctx.fill();ctx.restore();}
// Soft band under a polyline: the band is drawn far off-screen and only its blurred shadow lands on the floor.
// Ends are pulled in by the blur radius so the shadow fades out exactly at the base corners.
function contactShadow(points,up,down,blur,color,g=ctx){
 const left=points[0][0]+blur,right=points[points.length-1][0]-blur,band=points.filter(([x])=>x>=left&&x<=right);if(band.length<2)return;
 const ratio=g.getTransform().a,off=10000;
 g.save();g.shadowColor=color;g.shadowBlur=blur*ratio;g.shadowOffsetX=off*ratio;g.fillStyle='#000';g.beginPath();
 band.forEach(([x,y],n)=>n?g.lineTo(x-off,y-up):g.moveTo(x-off,y-up));
 for(let n=band.length-1;n>=0;n--)g.lineTo(band[n][0]-off,band[n][1]+down);
 g.closePath();g.fill();g.restore();
}
function portalAlpha(i){if(reduced)return displayReveal;const start=REVEAL_ORDER[i]*.12;return Math.max(0,Math.min(1,(displayReveal-start)/(1-.36)));}
// Character size drives everything: portals are ~2.6× the Bowler's height so they read as real doorways.
function actorScale(){return Math.min(.6,height/1250,width/900);}
// Each portal turns toward the centre of the room; the outermost ones turn the most.
const PORTAL_YAW=[-22,-15,-9,-4,4,9,15,22].map(d=>d*Math.PI/180);
const STRIPS=40,fade=new Array(8).fill(1),buffers=[],shadowBuffers=[];let actorBox=null;
function drawPortal(i){
 const a=portalAlpha(i);if(a<=0.001)return null;
 const pos=project(DOOR_X[i],DOOR_DEPTHS[i]),h=304*actorScale()*2.6*pos.scale,w=h*(1024/1536);
 const x=pos.x,y=pos.y,yaw=PORTAL_YAW[i],side=yaw<0?1:-1,sin=Math.abs(Math.sin(yaw)),cos=Math.cos(yaw),focal=h*2.4;
 // Fake perspective: vertical strips shrink toward the far edge around eye level (45% of the height),
 // so the base slopes slightly up on the far side exactly like a door standing on the floor.
 const k=u=>1/(1+((u-.5)*w*sin*side)/focal),pivot=y-h*.45;
 const sx=u=>x+(u-.5)*w*cos*k(u);
 const xl=sx(0),xr=sx(1),bl=pivot+h*.45*k(0),br=pivot+h*.45*k(1),mid={x:(xl+xr)/2,y:(bl+br)/2},span=Math.hypot(xr-xl,br-bl);
 // A portal standing in front of the Bowler turns translucent so he is never lost behind it.
 const covers=actorBox&&DOOR_DEPTHS[i]>state.y&&actorBox.x+actorBox.w/2>Math.min(xl,xr)+span*.08&&actorBox.x-actorBox.w/2<Math.max(xl,xr)-span*.08&&actorBox.y>pivot-h*.55;
 fade[i]+=((covers?.38:1)-fade[i])*(reduced?1:.12);
 ctx.save();ctx.globalAlpha=a*fade[i];
 if(doorStates[i]!=='new'){
  const done=doorStates[i]==='done';ellipse(x,y+h*.025,w*.55,h*.11,[[0,done?'rgba(69,139,100,.28)':'rgba(178,151,89,.22)'],[1,'rgba(255,255,255,0)']]);
 }
 // Contact shadow traced along the real bottom of the marble base, never past its corners.
 const foot=footprints[i]?.map(([u,v])=>{const kk=k(u);return [sx(u),pivot-h*.55*kk+h*kk*v];});
 if(foot){
  if(!shadowBuffers[i]){const H=768,buf=document.createElement('canvas');buf.width=Math.ceil(H*.9);buf.height=Math.ceil(H*.24);const g=buf.getContext('2d');
   const points=footprints[i].map(([u,v])=>[buf.width/2+(u-.5)*(2/3)*cos*k(u)*H,H*.08+(-.45-.55*k(u)+k(u)*v)*H]);
   contactShadow(points,H*.002,H*.026,H*.02,'rgba(30,48,38,.30)',g);contactShadow(points,H*.002,H*.004,H*.005,'rgba(14,26,18,.55)',g);shadowBuffers[i]=buf;}
  const shadow=shadowBuffers[i];ctx.drawImage(shadow,x-shadow.width/768*h/2,y-h*.08,shadow.width/768*h,shadow.height/768*h);
  if(focus===i){const pulse=reduced?1:.75+.25*Math.sin(elapsed*3),[x0,y0]=foot[0],[x1,y1]=foot[foot.length-1];ellipse((x0+x1)/2,(y0+y1)/2+h*.012,Math.hypot(x1-x0,y1-y0)*.55,h*.04,[[0,`rgba(40,140,95,${.30*pulse})`],[1,'rgba(40,140,95,0)']],Math.atan2(y1-y0,x1-x0));}
 }
 const img=portals[i];
 if(img.complete&&img.naturalWidth){
  // Perspective depends on the fixed yaw, not the camera: rasterize once, then scale one bitmap.
  const H=1024,nx=u=>(u-.5)*(2/3)*cos*k(u),left=nx(0)*H-2,top=-.55*Math.max(k(0),k(1))*H-2;
  if(!buffers[i]){const buf=document.createElement('canvas');buf.width=Math.ceil((nx(1)-nx(0))*H)+4;buf.height=Math.ceil(H*Math.max(k(0),k(1)))+4;const b=buf.getContext('2d');
   for(let n=0;n<STRIPS;n++){const u0=n/STRIPS,u1=(n+1)/STRIPS,kk=k((u0+u1)/2),x0=nx(u0)*H,x1=nx(u1)*H;
    b.drawImage(img,u0*img.naturalWidth,0,img.naturalWidth/STRIPS,img.naturalHeight,x0-left,-.55*H*kk-top,x1-x0+.8,H*kk);}buffers[i]=buf;}
  const buf=buffers[i];ctx.drawImage(buf,x+left/H*h,pivot+top/H*h,buf.width/H*h,buf.height/H*h);
 }
 ctx.restore();
 return {x:mid.x,y:Math.max(bl,br),w:span,h:h*Math.max(k(0),k(1)),a};
}
function drawKeepsakes(i){
 const count=keepsakes[i]?.count||0,im=collectionImages[IDS[i]],a=portalAlpha(i);if(!count||!im?.complete||!im.naturalWidth||a<.01)return;
 const p=project(DOOR_X[i],DOOR_DEPTHS[i]),h=304*actorScale()*2.6*p.scale,size=h*.29;
 if(arrivalTimes[IDS[i]]===null)arrivalTimes[IDS[i]]=elapsed;
 const emergence=reduced||arrivalTimes[IDS[i]]===undefined?1:Math.min(1,(elapsed-arrivalTimes[IDS[i]])/1.2);
 ctx.save();ctx.globalAlpha=a*emergence;
 for(let n=Math.min(count,4)-1;n>=0;n--){const side=i<4?1:-1,x=p.x+side*(h*.28+n*size*.2),y=p.y-h*(.2+n*.13),bob=reduced?0:Math.sin(elapsed*.7+i+n)*4;
  ellipse(x,p.y+3,size*.28,size*.045,[[0,'rgba(32,67,43,.18)'],[1,'rgba(32,67,43,0)']]);ctx.drawImage(im,x-size/2,y-size/2+bob+(1-emergence)*14,size,size);}
 ctx.restore();
}
// Frame order per direction (candidate strips, 8 frames each) and the distance one full cycle covers.
// Front and back cycles hold two steps (one per leg), so they cover a longer stride than the side ones.
// The candidate right-walk strip never swaps arms or legs, so walking right uses the left walk mirrored (see mirror.js).
const WALK_ORDER={front:[3,4,5,7,2,1],back:[2,3,1,6,7,5],left:[0,1,4,6],right:[0,1,4,6]};
const WALK_STRIDE={front:.16,back:.16,left:.105,right:.105};
function drawActor(x,y){
 const scale=actorScale(),sw=256*scale,sh=320*scale;
 ellipse(x,y-2,sw*.32,sw*.07,[[0,'rgba(36,57,39,.26)'],[1,'rgba(36,57,39,0)']]);
 const sprite=sprites[state.moving?'walk-'+state.direction:'idle-'+idleDirection];if(!sprite)return;
 // Contact -> passing -> opposite contact; phase follows distance, not wall time.
 // Front/back alternate legs: right leg up, down, passing, left leg up, down, passing (arms swing opposite).
 const order=WALK_ORDER[state.direction];
 const phase=(walkTime%1)*order.length,index=Math.floor(phase),frame=state.moving?order[index]:0;
 const bob=state.moving&&!reduced?Math.pow(Math.sin(walkTime*Math.PI*2),2)*1.1:0;
 ctx.drawImage(sprite,frame*256,0,256,320,x-sw/2,y-304*scale-bob,sw,sh);
}
function labelHidden(i,boxes){
 // Labels sit just below the base; hide one when a nearer portal is painted over that spot.
 const box=boxes[i];if(!box||focus===i)return false;const lx=box.x,ly=box.y+30;
 return boxes.some((o,j)=>o&&DOOR_DEPTHS[j]>DOOR_DEPTHS[i]&&Math.abs(lx-o.x)<o.w*.42&&ly>o.y-o.h*(1-PORTAL_TOP[j])-28&&ly<o.y);
}
function placeDoorButton(b,i,box,boxes){
 if(!box){b.style.visibility='hidden';return;}
 b.classList.toggle('label-hidden',labelHidden(i,boxes));
 // The name sits on the floor in front of the base: when the Bowler stands in front of it, he covers the label.
 const as=actorScale(),overActor=actorBox&&state.y>DOOR_DEPTHS[i]+.03&&Math.abs(actorBox.x-box.x)<actorBox.w/2+70&&box.y+14<actorBox.y&&box.y+60>actorBox.y-304*as;
 b.classList.toggle('label-behind-actor',!!overActor);
 b.style.visibility='visible';const top=box.y-box.h*(1-PORTAL_TOP[i]);
 b.style.left=box.x+'px';b.style.top=top+'px';b.style.width=box.w*.78+'px';b.style.height=(box.y-top)+'px';
 b.style.opacity=String(box.a);b.disabled=!state.unlocked;b.classList.toggle('focused',focus===i);
}

function frame(now){
 const rawMs=previous?now-previous:16.7;
 const dt=previous?Math.min((now-previous)/1000,.05):0;previous=now;elapsed+=dt;
 if(!document.hidden&&!$('modal').open&&Math.floor(now/1000)!==Math.floor((now-dt*1000)/1000)){const today=dateKey();if(today!==clockDay){if(activeDay===clockDay)activeDay=today;clockDay=today;renderCopy();}}
 if($('modal').open||document.hidden){requestAnimationFrame(frame);return;}
 if(rawMs<150&&started){frameBudget=frameBudget*.95+rawMs*.05;if(++budgetSamples>=90){budgetSamples=0;if(frameBudget>25&&renderQuality>.6){renderQuality=Math.max(.6,renderQuality-.15);resize();}}}
 const paused=!started||$('modal').open||entering;
 if(!paused){
  let input={x:(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0)+touch.x,y:(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0)+touch.y};
  if(autoTarget!==null&&!input.x&&!input.y){const dir=steerTo(state,autoTarget);if(dir)input=dir;else{const i=autoTarget;autoTarget=null;state={...state,moving:false,direction:'back'};idleDirection='back';openRoom(i);}}
  state=advance(state,input,dt);
 }else state={...state,moving:false};
 const follow=1-Math.exp(-dt*10);cameraX+=(state.x-cameraX)*follow;cameraY+=(state.y-cameraY)*follow;
 displayReveal=reduced?state.reveal:displayReveal+(state.reveal-displayReveal)*Math.min(1,dt*3);
 if(state.reveal===1&&displayReveal>.995&&!state.unlocked){displayReveal=1;state={...state,unlocked:true};}
 focus=nearestDoor(state);renderPrompt(false);

 drawRoom(elapsed);
 drawCarpet(ctx,project,{x:cameraX,y:cameraY,width,height});
 if(state.moving&&['front','back'].includes(state.direction))idleDirection=state.direction;
 if(state.direction!==lastDirection){lastDirection=state.direction;}
 if(state.moving)walkTime+=(state.distance||0)/WALK_STRIDE[state.direction];else walkTime=0;

 // Depth-sorted scene: farther things first, so the character passes in front of / behind portals correctly.
 const boxes=[],buttons=document.querySelectorAll('.door');
 const items=DOOR_X.map((_,i)=>({y:DOOR_DEPTHS[i],draw:()=>{boxes[i]=drawPortal(i);}}));
 items.push(...salonObjects(ctx,project,actorScale,elapsed,reduced));
 DOOR_X.forEach((_,i)=>items.push({y:DOOR_DEPTHS[i]+.1,draw:()=>drawKeepsakes(i)}));
 const ap=project(state.x,state.y),as=actorScale();actorBox={x:ap.x,y:ap.y,w:120*as};
 items.push({y:state.y,draw:()=>drawActor(ap.x,ap.y)});
 items.sort((a,b)=>a.y-b.y).forEach(item=>item.draw());
 buttons.forEach((b,i)=>placeDoorButton(b,i,boxes[i],boxes));

 if(!reduced){ctx.globalAlpha=.13;const drift=Math.sin(elapsed*.16)*width*.2;ctx.drawImage(fogTextures[1],drift-width*.3,height*.69,width*1.3,height*.20);ctx.globalAlpha=1;}

 $('doors').hidden=displayReveal<.015;
 // Logo stands between the two innermost portals, at their depth: it fills most of the gap
 // and is centred about a third of a portal's height above the floor.
 const logoDepth=DOOR_DEPTHS[4],logo=project(0,logoDepth),inner=project(DOOR_X[4],logoDepth),doorH=304*actorScale()*2.6*inner.scale;
 const gap=Math.max(0,(inner.x-logo.x)-doorH*(2/3)*.387)*2,logoWidth=gap*.86,logoNear=Math.hypot(state.x,state.y-logoDepth);
 const brand=$('brand');brand.style.width=logoWidth+'px';brand.style.left=logo.x+'px';brand.style.top=(logo.y-doorH*.31-logoWidth*.49/2)+'px';brand.style.opacity=String(Math.min(1,Math.max(0,(logoNear-.18)/.28)));

 const hit=enteredDoor(state);if(hit!==null&&(autoTarget===null||hit===autoTarget))openRoom(hit);
 const c=t(),hint=elapsed<audioErrorUntil?c.audioError:state.unlocked?c.revealed:c.subtitle;if($('hint').textContent!==hint)$('hint').textContent=hint;
 $('experience').dataset.unlocked=String(state.unlocked);
 $('keys').classList.toggle('suggest-retreat',!state.unlocked&&elapsed>8);$('joystick').classList.toggle('suggest-retreat',!state.unlocked&&elapsed>8);
 requestAnimationFrame(frame);
}
renderCopy();requestAnimationFrame(frame);
Promise.all([imageLoad('idle-front','/assets/characters/bowler/idle/front.png'),imageLoad('idle-back','/assets/characters/bowler/idle/back.png'),...['front','back','left'].map(d=>imageLoad('walk-'+d,`/preview/walk-${d}.png`))])
 .then(()=>{sprites['walk-right']=mirrorStrip(sprites['walk-left'],{dropPocketSquare:true});})
 .then(()=>{started=true;$('joystick').hidden=!coarse;})
 .catch(()=>{$('hint').textContent=t().loadError;});
