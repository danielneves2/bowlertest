// Sala 7 · "A Chave": remote associations. Three words, one hidden word that links all of them.
import {ITEMS} from './convergent-items.js';
import {challengeNumber,shuffle,rng} from './daily.js';

export const meta={
 'pt-BR':{title:'A Chave',lede:'Três palavras, uma chave escondida que abre todas elas.',
  how:['Ache a palavra que forma uma expressão ou palavra composta com cada uma das três. Ex.: retrato · malas · voz → porta.','Cada trio tem 3 tentativas. Dica 1 mostra o número de letras; dica 2, a primeira letra.','Cinco trios por dia, do mais fácil ao mais difícil.']},
 en:{title:'The Key',lede:'Three words, one hidden key that opens all of them.',
  how:['Find the word that forms a compound or phrase with each of the three. E.g. bell · mat · knob → door.','Each trio has 3 attempts. Hint 1 shows the number of letters; hint 2, the first letter.','Five trios a day, from easiest to hardest.']}
};
const T={
 'pt-BR':{of:(k,n)=>`Trio ${k} de ${n}`,try:'Tentar',hint:'Dica',skip:'Pular',left:n=>`${n} tentativas`,letters:n=>`${n} letras`,first:c=>`começa com “${c.toUpperCase()}”`,right:'Abriu!',wrong:'Não abriu.',was:a=>`A chave era “${a}”.`,
  share:(n,e,c)=>`BOWLER TEST · A Chave #${n}\n${e} ${c}/5`,summary:(c,h)=>`${c} de 5 trios, ${h} dicas.`},
 en:{of:(k,n)=>`Trio ${k} of ${n}`,try:'Try',hint:'Hint',skip:'Skip',left:n=>`${n} attempts`,letters:n=>`${n} letters`,first:c=>`starts with “${c.toUpperCase()}”`,right:'Unlocked!',wrong:'Still locked.',was:a=>`The key was “${a}”.`,
  share:(n,e,c)=>`BOWLER TEST · The Key #${n}\n${e} ${c}/5`,summary:(c,h)=>`${c} of 5 trios, ${h} hints.`}
};
const fold=s=>s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
export function dailyTrios(lang,day){
 const items=ITEMS[lang],n=challengeNumber(day)-1,perDay=5,round=Math.floor(n*perDay/items.length);
 const order=shuffle(rng(`convergent:${lang}:${round}`),[...items.keys()]),start=(n*perDay)%items.length;
 return [...Array(perDay)].map((_,k)=>items[order[(start+k)%items.length]]).sort((a,b)=>a[4]-b[4]);
}

export function mount(root,ctx){
 const t=T[ctx.lang],trios=dailyTrios(ctx.lang,ctx.day);
 const st=ctx.saved||{k:0,results:[],tries:3,hints:0,totalHints:0,done:false};
 root.innerHTML=`<div class="key"><div class="mx-top"><span class="key-step"></span><span class="key-dots"></span></div><div class="key-cues"></div>
  <p class="key-hint"></p><form class="key-form" autocomplete="off"><input name="a" maxlength="20" spellcheck="false" autocapitalize="off" aria-label="?"><button class="primary">${t.try}</button></form>
  <div class="key-tools"><span class="key-left"></span><button type="button" class="ghost key-h">${t.hint}</button><button type="button" class="ghost key-s">${t.skip}</button></div><p class="key-msg" aria-live="polite"></p></div>`;
 const q=s=>root.querySelector(s),form=q('form');
 const dots=()=>q('.key-dots').textContent=trios.map((_,i)=>i<st.results.length?(st.results[i]?'●':'×'):'○').join('');
 let locked=false;
 const hintText=()=>{const a=trios[st.k][3];q('.key-hint').textContent=[st.hints>=1?t.letters([...a].length):'',st.hints>=2?t.first(a[0]):''].filter(Boolean).join(' · ');};
 const show=()=>{dots();if(st.k>=trios.length){finish();return;}locked=false;const [a,b,c]=trios[st.k];
  q('.key-step').textContent=t.of(st.k+1,trios.length);q('.key-cues').innerHTML=[a,b,c].map(w=>`<span>${w}</span>`).join('');q('.key-msg').textContent='';
  q('.key-left').textContent=t.left(st.tries);q('.key-h').disabled=st.hints>=2;hintText();form.a.value='';form.a.focus();};
 const next=ok=>{locked=true;st.results.push(ok);st.k++;st.tries=3;st.hints=0;ctx.save(st);dots();setTimeout(show,ok?900:1800);};
 form.onsubmit=e=>{e.preventDefault();if(locked||!form.a.value.trim())return;const item=trios[st.k],guess=fold(form.a.value),ok=[item[3],...item.slice(5)].some(x=>fold(x)===guess);
  if(ok){q('.key-msg').textContent=t.right;q('.key-cues').classList.add('open');setTimeout(()=>q('.key-cues').classList.remove('open'),800);next(true);return;}
  st.tries--;form.a.value='';ctx.save(st);q('.key-left').textContent=t.left(st.tries);
  if(st.tries<=0){q('.key-msg').textContent=t.was(item[3]);next(false);}else q('.key-msg').textContent=t.wrong;};
 q('.key-h').onclick=()=>{if(st.hints>=2||locked)return;st.hints++;st.totalHints++;ctx.save(st);hintText();q('.key-h').disabled=st.hints>=2;};
 q('.key-s').onclick=()=>{if(locked)return;q('.key-msg').textContent=t.was(trios[st.k][3]);next(false);};
 const finish=()=>{form.hidden=true;q('.key-tools').hidden=true;q('.key-cues').innerHTML='';q('.key-hint').textContent='';if(st.done)return;st.done=true;ctx.save(st);
  const c=st.results.filter(Boolean).length;ctx.finish({summary:t.summary(c,st.totalHints),share:t.share(ctx.number,st.results.map(r=>r?'🗝️':'▫️').join(''),c),score:{solved:c,hints:st.totalHints}});};
 if(st.done){dots();finish();}else show();
}
