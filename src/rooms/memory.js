// Sala 5 · "Chapéus que Somem": spatial span in the spirit of Corsi blocks, with bowler hats.
import {shuffle} from './daily.js';

export const meta={
 'pt-BR':{title:'Chapéus que Somem',lede:'Os chapéus vão se acender um de cada vez. Repita a ordem.',
  how:['Observe a sequência sem clicar. Quando terminar, clique nos chapéus na mesma ordem.','Acertou? A próxima sequência tem um chapéu a mais.','Errou duas vezes no mesmo tamanho, o desafio termina. Sua marca é a maior sequência que você repetiu.']},
 en:{title:'Vanishing Hats',lede:'The hats will light up one at a time. Repeat the order.',
  how:['Watch the sequence without clicking. When it ends, click the hats in the same order.','Got it? The next sequence has one more hat.','Two misses at the same length end the challenge. Your mark is the longest sequence you repeated.']}
};
const T={
 'pt-BR':{watch:'Observe…',go:'Sua vez',start:'Começar',right:'Isso!',wrong:'Ops. Mais uma chance neste tamanho.',len:n=>`Sequência de ${n}`,share:(n,s)=>`BOWLER TEST · Chapéus #${n}\n🎩 sequência ${s}`,summary:s=>`Maior sequência lembrada: ${s}.`},
 en:{watch:'Watch…',go:'Your turn',start:'Start',right:'Yes!',wrong:'Oops. One more chance at this length.',len:n=>`Sequence of ${n}`,share:(n,s)=>`BOWLER TEST · Hats #${n}\n🎩 span ${s}`,summary:s=>`Longest sequence remembered: ${s}.`}
};
const HAT='<svg viewBox="0 0 100 70" aria-hidden="true"><ellipse cx="50" cy="56" rx="46" ry="11" class="brim"/><path d="M22 54 C20 18 34 6 50 6 C66 6 80 18 78 54 Z" class="crown"/><path d="M22 44 Q50 50 78 44 L78 52 Q50 58 22 52 Z" class="band"/></svg>';
export function layout(r,n=9){ // jittered 3×3 so hats never overlap
 const cells=shuffle(r,[...Array(9).keys()]).slice(0,n);
 return cells.map(c=>({x:14+(c%3)*36+(r()-.5)*12,y:12+Math.floor(c/3)*34+(r()-.5)*10}));
}
export function sequence(r,len,n=9){return shuffle(r,[...Array(n).keys()]).slice(0,len);}

export function mount(root,ctx){
 const t=T[ctx.lang],pos=layout(ctx.rng('layout'));
 const st=ctx.saved||{len:3,fails:0,attempt:0,span:0,done:false};
 root.innerHTML=`<div class="hats"><div class="mx-top"><span class="hats-len"></span><span class="hats-span"></span></div><div class="hats-field"></div><p class="hats-msg" aria-live="polite"></p><button class="primary hats-start">${t.start}</button></div>`;
 const field=root.querySelector('.hats-field'),msg=root.querySelector('.hats-msg'),start=root.querySelector('.hats-start');
 const hats=pos.map((p,i)=>{const b=document.createElement('button');b.className='hat';b.style.left=p.x+'%';b.style.top=p.y+'%';b.innerHTML=HAT;b.setAttribute('aria-label',String(i+1));b.disabled=true;field.append(b);return b;});
 let timers=[],seq=[],input=[];
 const clear=()=>{timers.forEach(clearTimeout);timers=[];};
 const label=()=>{root.querySelector('.hats-len').textContent=t.len(st.len);root.querySelector('.hats-span').textContent=st.span?`🎩 ${st.span}`:'';};
 const play=()=>{start.hidden=true;label();seq=sequence(ctx.rng(`seq:${st.attempt}`),st.len);input=[];msg.textContent=t.watch;hats.forEach(h=>h.disabled=true);
  seq.forEach((h,k)=>{timers.push(setTimeout(()=>hats[h].classList.add('lit'),600+k*900));timers.push(setTimeout(()=>hats[h].classList.remove('lit'),600+k*900+620));});
  timers.push(setTimeout(()=>{msg.textContent=t.go;hats.forEach(h=>h.disabled=false);},600+seq.length*900));};
 hats.forEach((h,i)=>h.onclick=()=>{if(h.disabled)return;input.push(i);h.classList.add('tap');setTimeout(()=>h.classList.remove('tap'),220);
  const k=input.length-1;
  if(input[k]!==seq[k]){hats.forEach(x=>x.disabled=true);st.attempt++;st.fails++;
   if(st.fails>=2){finish();return;}msg.textContent=t.wrong;ctx.save(st);timers.push(setTimeout(play,1500));return;}
  if(input.length===seq.length){hats.forEach(x=>x.disabled=true);st.span=Math.max(st.span,st.len);st.len++;st.fails=0;st.attempt++;ctx.save(st);msg.textContent=t.right;
   if(st.len>9){finish();return;}timers.push(setTimeout(play,1100));}});
 const finish=()=>{st.done=true;ctx.save(st);clear();hats.forEach(x=>x.disabled=true);start.hidden=true;label();msg.textContent='';
  ctx.finish({summary:t.summary(st.span),share:t.share(ctx.number,st.span),score:{span:st.span}});};
 start.onclick=play;label();
 if(st.done){start.hidden=true;}
 return clear;
}
