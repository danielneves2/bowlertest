// Sala 2 · "Perto Demais": guess the secret word; each guess shows its closeness rank (1 = the word).
import {loadSpace} from './semantic.js';
import {dailyIndex} from './daily.js';
import {pager} from '../ui/pages.js';

export const meta={
 'pt-BR':{title:'Perto Demais',lede:'Descubra a palavra secreta. Cada palpite mostra o quão perto você está.',
  how:['Digite qualquer palavra. Ela recebe uma posição: 1 é a palavra secreta, 2 é a mais próxima dela, e assim por diante.','A proximidade vem do contexto em que as palavras aparecem juntas em milhões de textos, não da grafia.','Você tem 3 dicas. Cada uma revela uma palavra mais perto que o seu melhor palpite.']},
 en:{title:'Too Close',lede:'Find the secret word. Each guess shows how close you are.',
  how:['Type any word. It gets a position: 1 is the secret word, 2 is the closest to it, and so on.','Closeness comes from the contexts words share across millions of texts, not from spelling.','You have 3 hints. Each reveals a word closer than your best guess.']}
};
const T={
 'pt-BR':{placeholder:'digite uma palavra',guess:'Chutar',hint:n=>`Dica (${n})`,giveUp:'Desistir',unknown:w=>`Não conheço “${w}”.`,repeat:w=>`“${w}” já foi.`,guesses:'palpites',hints:'dicas',
  solved:(w,n)=>`Você achou “${w}” em ${n} palpites.`,gaveUp:w=>`A palavra era “${w}”.`,closest:'As mais próximas',loading:'Carregando palavras…',share:(n,g,h,s)=>`BOWLER TEST · Perto Demais #${n}\n${s?'🎯':'🏳️'} ${g} palpites · ${h} dicas`,summary:(g,h,s)=>s?`${g} palpites e ${h} dicas.`:`Desistiu após ${g} palpites.`},
 en:{placeholder:'type a word',guess:'Guess',hint:n=>`Hint (${n})`,giveUp:'Give up',unknown:w=>`I don't know “${w}”.`,repeat:w=>`“${w}” already guessed.`,guesses:'guesses',hints:'hints',
  solved:(w,n)=>`You found “${w}” in ${n} guesses.`,gaveUp:w=>`The word was “${w}”.`,closest:'Closest words',loading:'Loading words…',share:(n,g,h,s)=>`BOWLER TEST · Too Close #${n}\n${s?'🎯':'🏳️'} ${g} guesses · ${h} hints`,summary:(g,h,s)=>s?`${g} guesses and ${h} hints.`:`Gave up after ${g} guesses.`}
};
const tone=r=>r<=300?'near':r<=1500?'mid':'far';
const dot=r=>r<=300?'🟩':r<=1500?'🟨':'🟥';

export function mount(root,ctx){
 const t=T[ctx.lang];let alive=true;
 root.innerHTML=`<div class="close-game"><p class="room-loading">${t.loading}</p></div>`;
 loadSpace(ctx.lang).then(space=>{
  if(!alive)return;
  const secret=space.index.get(space.secrets[dailyIndex(space.secrets.length,'verbal:'+ctx.lang,ctx.day)]);
  const {rank,order}=space.ranking(secret),N=space.vocab.length;
  const st=ctx.saved||{guesses:[],hints:0,done:false,solved:false};
  root.innerHTML=`<div class="close-game">
   <form class="close-form" autocomplete="off"><input name="w" type="text" placeholder="${t.placeholder}" aria-label="${t.placeholder}" maxlength="30" spellcheck="false" autocapitalize="off"><button class="primary" type="submit">${t.guess}</button></form>
   <div class="close-tools"><span class="close-count"></span><button type="button" class="ghost hint"></button><button type="button" class="ghost give">${t.giveUp}</button></div>
   <p class="close-msg" aria-live="polite"></p><div class="close-last"></div><div class="close-list"></div></div>`;
  const form=root.querySelector('form'),input=form.w,msg=root.querySelector('.close-msg'),list=root.querySelector('.close-list'),last=root.querySelector('.close-last');
  const row=(g,cls='')=>{const li=document.createElement('li');li.className=`close-row ${tone(g.rank)} ${cls}`;const fill=Math.max(.03,1-Math.log(g.rank)/Math.log(N));
   li.innerHTML=`<span class="close-bar" style="width:${(fill*100).toFixed(1)}%"></span><span class="close-word"></span><span class="close-rank">${g.rank}</span>`;li.querySelector('.close-word').textContent=g.word+(g.hint?' *':'');return li;};
  const render=(latest)=>{
   root.querySelector('.close-count').textContent=`${st.guesses.length} ${t.guesses} · ${st.hints} ${t.hints}`;
   const hb=root.querySelector('.hint');hb.textContent=t.hint(3-st.hints);hb.disabled=st.done||st.hints>=3;root.querySelector('.give').disabled=st.done;
   input.disabled=st.done;form.querySelector('button').disabled=st.done;
   last.replaceChildren();if(latest)last.append(row(latest,'latest'));
   list.replaceChildren();pager(list,[...st.guesses].sort((a,b)=>a.rank-b.rank).map(g=>row(g,latest&&g.word===latest.word?'is-latest':'')),{size:3,lang:ctx.lang,className:'guess-page'});
   if(st.done){
    root.querySelector('.close-game').classList.add('completed');
    msg.textContent=st.solved?t.solved(space.vocab[secret],st.guesses.length):t.gaveUp(space.vocab[secret]);
    if(!root.querySelector('.close-reveal')){const box=document.createElement('div');box.className='close-reveal';box.innerHTML=`<h3>${t.closest}</h3>`;
     const ol=document.createElement('div'),words=order.slice(0,31).map((w,k)=>{const li=document.createElement('p');li.textContent=`${k+1}. ${space.vocab[w]}`;return li;});pager(ol,words,{size:6,lang:ctx.lang,className:'nearest-page'});box.append(ol);root.querySelector('.close-game').append(box);
     const switcher=document.createElement('button');switcher.className='ghost word-detail-switch';switcher.textContent=ctx.lang==='pt-BR'?'Ver palpites':'View guesses';let nearest=true;list.hidden=true;switcher.onclick=()=>{nearest=!nearest;box.hidden=!nearest;list.hidden=nearest;switcher.textContent=nearest?(ctx.lang==='pt-BR'?'Ver palpites':'View guesses'):(ctx.lang==='pt-BR'?'Ver palavras próximas':'View nearby words');};root.querySelector('.close-game').append(switcher);}
   }
  };
  const finish=()=>{st.done=true;ctx.save(st);render();
   const ranks=st.guesses.map(g=>g.rank),traj=[.25,.5,.75,1].map(f=>dot(Math.min(...ranks.slice(0,Math.max(1,Math.ceil(ranks.length*f)))))).join('');
   ctx.finish({summary:t.summary(st.guesses.length,st.hints,st.solved),share:t.share(ctx.number,st.guesses.length,st.hints,st.solved)+`\n${traj}`,score:{guesses:st.guesses.length,hints:st.hints,solved:st.solved}});};
  const add=(i,hint=false)=>{const g={word:space.vocab[i],rank:rank[i],hint};st.guesses.push(g);if(g.rank===1){st.solved=true;finish();}else{ctx.save(st);render(g);}return g;};
  form.onsubmit=e=>{e.preventDefault();const raw=input.value.trim();if(!raw||st.done)return;input.value='';
   const i=space.find(raw);if(i<0){msg.textContent=t.unknown(raw);return;}
   if(st.guesses.some(g=>g.word===space.vocab[i])){msg.textContent=t.repeat(space.vocab[i]);return;}
   msg.textContent='';add(i);input.focus();};
  root.querySelector('.hint').onclick=()=>{if(st.done||st.hints>=3)return;const best=st.guesses.length?Math.min(...st.guesses.map(g=>g.rank)):600;
   let target=Math.max(2,Math.floor(best/2));let w=order[target-1];while(st.guesses.some(g=>g.word===space.vocab[w])&&target>2){target--;w=order[target-1];}
   st.hints++;msg.textContent='';add(w,true);};
  root.querySelector('.give').onclick=()=>{if(st.done)return;st.solved=false;finish();};
  render(st.guesses.at(-1));if(!st.done)input.focus();
 }).catch(()=>{if(alive)root.innerHTML='<p class="room-error">⚠</p>';});
 return ()=>{alive=false;};
}
