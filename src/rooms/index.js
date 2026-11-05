// Room shell: header with the daily number, the challenge body and a shared result/share footer.
import {dateKey,challengeNumber,rng,progress} from './daily.js';
import {VERSION,validDay,records,personalityAnswers} from '../journey/model.js';
export const ROOM_IDS=['abstract','verbal','numerical','spatial','memory','divergent','convergent','personality'];
const loaders={
 abstract:()=>import('./abstract.js'),verbal:()=>import('./verbal.js'),numerical:()=>import('./numerical.js'),
 spatial:()=>import('./spatial.js'),memory:()=>import('./memory.js'),divergent:()=>import('./divergent.js'),
 convergent:()=>import('./convergent.js'),personality:()=>import('./personality.js')
};
const UI={
 'pt-BR':{room:'SALA',challenge:'DESAFIO',back:'Voltar ao salão',share:'Copiar resultado',copied:'Copiado!',done:'Desafio de hoje concluído',again:'Volte amanhã para um novo desafio.',loading:'Preparando a sala…',error:'Não foi possível abrir esta sala. Recarregue a página.',how:'Como jogar',note:'Jogo exploratório inspirado em métodos publicados. Não é um teste psicológico e não calcula QI.'},
 en:{room:'ROOM',challenge:'CHALLENGE',back:'Back to the hall',share:'Copy result',copied:'Copied!',done:"Today's challenge complete",again:'Come back tomorrow for a new challenge.',loading:'Preparing the room…',error:'This room could not open. Reload the page.',how:'How to play',note:'Exploratory game inspired by published methods. Not a psychological test; it does not compute IQ.'}
};
export function doneToday(day,lang){return progress.doneToday(ROOM_IDS,day,lang);}
export function isDoneToday(i,day,lang){return !!progress.load(ROOM_IDS[i],day,lang)?.result;}

function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
async function copyText(text){try{await navigator.clipboard.writeText(text);return true;}catch{const t=el('textarea');t.value=text;document.body.append(t);t.select();let ok=false;try{ok=document.execCommand('copy');}catch{}t.remove();return ok;}}

export async function mountRoom(index,container,{lang,day=dateKey(),onBack,onFinish,onChange,onPortrait}){
 if(!validDay(day))throw new Error('Invalid challenge date');
 const id=ROOM_IDS[index],ui=UI[lang],number=challengeNumber(day);
 container.replaceChildren();
 const root=el('div','room room-'+id),head=el('div','room-head'),body=el('div','room-body'),foot=el('div','room-foot');
 const eyebrow=el('span','eyebrow',`${ui.room} ${String(index+1).padStart(2,'0')} · ${ui.challenge} #${number} · ${day.split('-').reverse().slice(0,2).join('/')}`);
 const title=el('h1','room-title',''),lede=el('p','room-lede','');
 root.dataset.panel='game';root.style.setProperty('--room-art',"url('/assets/room-art/"+id+".png')");
 const how=el('button','room-how',ui.how);how.type='button';const howText=el('section','room-how-text');
 let lastPanel='game';how.onclick=()=>{if(root.dataset.panel==='help'){root.dataset.panel=lastPanel;how.setAttribute('aria-pressed','false');}else{lastPanel=root.dataset.panel;root.dataset.panel='help';how.setAttribute('aria-pressed','true');}};
 head.append(eyebrow,title,lede,how);
 const art=el('img','room-emblem');art.src=`/assets/room-art/${id}.png`;art.alt='';art.setAttribute('aria-hidden','true');head.append(art);
 const back=el('button','ghost',ui.back);back.onclick=onBack;
 const resultBox=el('div','room-result');resultBox.hidden=true;
 const note=el('p','room-note',ui.note);
 const detail=el('button','ghost',lang==='pt-BR'?'Ver detalhes':'View details');detail.hidden=true;detail.onclick=()=>{root.dataset.panel=root.dataset.panel==='game'?'result':'game';detail.textContent=root.dataset.panel==='game'?(lang==='pt-BR'?'Ver resultado':'View result'):(lang==='pt-BR'?'Ver detalhes':'View details');};
 foot.append(el('div','room-actions'),note);foot.querySelector('.room-actions').append(detail,back);
 root.append(head,body,resultBox,howText,foot);container.append(root);
 body.append(el('p','room-loading',ui.loading));
 let destroy=()=>{},alive=true;
 const current=()=>alive&&root.isConnected;
 const showResult=(result)=>{
  resultBox.replaceChildren();resultBox.hidden=false;
  root.dataset.panel='result';detail.hidden=false;
  resultBox.append(el('strong','room-result-title',lang==='pt-BR'?'Desafio concluído':'Challenge complete'),el('p','room-result-summary',result.summary));
  if(result.share){const pre=el('pre','room-share',result.share.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu,'◆'));const b=el('button','primary',ui.share);
   b.onclick=async()=>{if(await copyText(result.share)){b.textContent=ui.copied;setTimeout(()=>b.textContent=ui.share,1600);}};resultBox.append(pre,b);}
  resultBox.append(el('p','room-again',ui.again));
  if(doneToday(day,lang)===8&&onPortrait){const portrait=el('button','primary',lang==='pt-BR'?'Ver retrato do dia':'See daily portrait');portrait.onclick=onPortrait;resultBox.append(portrait);}
 };
 try{
  const mod=await loaders[id]();const m=mod.meta[lang];
  if(!current())return ()=>{};
  title.textContent=m.title;lede.textContent=m.lede;howText.replaceChildren(...m.how.map(t=>el('p','',t)));
  body.replaceChildren();
  const saved=progress.load(id,day,lang)||{},history=records(lang);
  if(!saved.result){progress.save(id,{...saved,lang,version:VERSION,startedAt:saved.startedAt||new Date().toISOString()},day,lang);onChange?.();}
  const ctx={lang,day,number,saved:saved.state||null,history,personalityAnswers:personalityAnswers(history,day),
   rng:salt=>rng(`${id}:${day}:${salt||''}`),
   save:state=>{if(current()&&!progress.load(id,day,lang)?.result)progress.save(id,{...progress.load(id,day,lang),state},day,lang);},
   finish:result=>{if(!current())return;const existing=progress.load(id,day,lang);if(!existing?.result){progress.save(id,{...existing,result,lang,version:VERSION,completedAt:new Date().toISOString(),playedDay:dateKey()},day,lang);onFinish?.(index,result);}showResult(existing?.result||result);}};
  destroy=mod.mount(body,ctx)||destroy;
  if(saved.result)showResult(saved.result);
 }catch(err){console.error(err);body.replaceChildren(el('p','room-error',ui.error));}
 return ()=>{alive=false;destroy();};
}
