// Sala 6 · "Dez Palavras Distantes": DAT-style divergent naming (Olson et al., 2021), scored with our own vectors.
import {loadSpace} from './semantic.js';
import {dailyIndex} from './daily.js';

export const meta={
 'pt-BR':{title:'Dez Palavras Distantes',lede:'Escreva 10 substantivos o mais diferentes possível entre si, em todos os sentidos e usos.',
  how:['Só palavras isoladas e substantivos (coisas, objetos, conceitos). Nada de nomes próprios ou termos técnicos.','Pense por conta própria: não use os objetos à sua volta.','A nota é a distância média entre os 7 primeiros substantivos válidos, × 100. A palavra-âncora do dia é um bônus: quanto mais longe dela, melhor.']},
 en:{title:'Ten Distant Words',lede:'Write 10 nouns that are as different from each other as possible, in every meaning and use.',
  how:['Single words and nouns only (things, objects, concepts). No proper names or technical terms.','Think on your own: do not just name the objects around you.','The score is the average distance between the first 7 valid nouns, × 100. The daily anchor word is a bonus: the farther from it, the better.']}
};
const T={
 'pt-BR':{anchor:'Palavra-âncora do dia',submit:'Calcular distância',need:n=>`Faltam ${n} substantivos válidos (mínimo 7).`,unknown:'palavra desconhecida',dup:'repetida',noun:'talvez não seja substantivo',ok:'ok',
  score:'Sua distância',anchorScore:'Longe da âncora',best:'Seu recorde',pairs:'Distância entre cada par',caveat:'Escala própria do BOWLER TEST, com vetores em português. Não é comparável à nota do DAT oficial.',
  share:(n,s,a)=>`BOWLER TEST · Dez Palavras #${n}\n🌌 ${s} · ⚓ ${a}`,summary:(s,a)=>`Distância ${s} · longe da âncora ${a}.`},
 en:{anchor:"Today's anchor word",submit:'Measure distance',need:n=>`${n} more valid nouns needed (minimum 7).`,unknown:'unknown word',dup:'repeated',noun:'may not be a noun',ok:'ok',
  score:'Your distance',anchorScore:'Away from anchor',best:'Your record',pairs:'Distance between each pair',caveat:'BOWLER TEST scale, with its own vectors. Not comparable to the official DAT score.',
  share:(n,s,a)=>`BOWLER TEST · Ten Words #${n}\n🌌 ${s} · ⚓ ${a}`,summary:(s,a)=>`Distance ${s} · away from anchor ${a}.`}
};
export function score(space,ids){
 let sum=0,n=0;for(let a=0;a<ids.length;a++)for(let b=a+1;b<ids.length;b++){sum+=1-space.dot(ids[a],ids[b]);n++;}
 return n?sum/n*100:0;
}
const shade=d=>d<60?'close':d<75?'mid':'far';

export function mount(root,ctx){
 const t=T[ctx.lang];let alive=true;
 root.innerHTML='<p class="room-loading">…</p>';
 loadSpace(ctx.lang).then(space=>{
  if(!alive)return;
  const anchorWord=space.anchors[dailyIndex(space.anchors.length,'anchor:'+ctx.lang,ctx.day)],anchor=space.index.get(anchorWord);
  const st=ctx.saved||{words:Array(10).fill(''),done:false};
  root.innerHTML=`<div class="dat"><div class="dat-anchor"><span>${t.anchor}</span><strong></strong></div>
   <ol class="dat-inputs"></ol><p class="dat-msg" aria-live="polite"></p><button class="primary dat-go">${t.submit}</button><div class="dat-out"></div></div>`;
  root.querySelector('.dat-anchor strong').textContent=anchorWord;
  const ol=root.querySelector('.dat-inputs'),msg=root.querySelector('.dat-msg'),go=root.querySelector('.dat-go'),out=root.querySelector('.dat-out');
  const inputs=st.words.map((w,i)=>{const li=document.createElement('li');li.innerHTML=`<input type="text" maxlength="30" spellcheck="false" autocapitalize="off" aria-label="${i+1}"><small></small>`;const inp=li.querySelector('input');inp.value=w;
   inp.addEventListener('input',()=>{st.words[i]=inp.value;ctx.save(st);check();});inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(inputs[i+1])inputs[i+1].focus();else go.click();}});ol.append(li);return inp;});
  const analyse=()=>{const seen=new Set(),valid=[],status=[];
   st.words.forEach((w,i)=>{if(!w.trim()){status[i]='';return;}const id=space.find(w);
    if(id<0)status[i]=t.unknown;else if(seen.has(id))status[i]=t.dup;else{seen.add(id);valid.push(id);status[i]=space.isNoun(id)?t.ok:t.noun;}});
   return {valid,status};};
  const check=()=>{const {valid,status}=analyse();inputs.forEach((inp,i)=>{const s=inp.nextElementSibling;s.textContent=status[i]||'';s.className=status[i]===t.ok?'ok':status[i]?'warn':'';});
   msg.textContent=valid.length>=7?'':t.need(7-valid.length);go.disabled=st.done||valid.length<7;return valid;};
  const showResult=()=>{const ids=check().slice(0,7),s=Math.round(score(space,ids)*10)/10,a=Math.round(ids.reduce((x,i)=>x+(1-space.dot(i,anchor)),0)/ids.length*1000)/10;
   root.querySelector('.dat').classList.add('completed');
   const best=Math.max(s,...(ctx.history||[]).filter(r=>r.room==='divergent'&&r.day<ctx.day&&r.version===1&&Number.isFinite(r.result?.score?.distance)).map(r=>r.result.score.distance));
   out.innerHTML=`<div class="dat-scores"><div><span>${t.score}</span><strong>${s.toFixed(1)}</strong></div><div><span>${t.anchorScore}</span><strong>${a.toFixed(1)}</strong></div><div><span>${t.best}</span><strong>${(best||s).toFixed(1)}</strong></div></div><h3>${t.pairs}</h3>`;
   const table=document.createElement('table');table.className='dat-matrix';
   ids.forEach((r,ri)=>{const tr=document.createElement('tr');const th=document.createElement('th');th.textContent=space.vocab[r];tr.append(th);
    ids.forEach((c,ci)=>{const td=document.createElement('td');if(ci<ri){const d=Math.round((1-space.dot(r,c))*100);td.textContent=d;td.className=shade(d);}tr.append(td);});table.append(tr);});
   const foot=document.createElement('tr');foot.append(document.createElement('th'));ids.forEach(c=>{const th=document.createElement('th');th.className='col';th.textContent=space.vocab[c];foot.append(th);});table.append(foot);
   out.append(table);const cav=document.createElement('p');cav.className='dat-caveat';cav.textContent=t.caveat;out.append(cav);
   return {s,a};};
  go.onclick=()=>{if(check().length<7)return;st.done=true;ctx.save(st);inputs.forEach(i=>i.disabled=true);const {s,a}=showResult();go.disabled=true;
   ctx.finish({summary:t.summary(s.toFixed(1),a.toFixed(1)),share:t.share(ctx.number,s.toFixed(1),a.toFixed(1)),score:{distance:s,anchor:a}});};
  check();if(st.done){inputs.forEach(i=>i.disabled=true);go.disabled=true;showResult();}else inputs.find(i=>!i.value)?.focus();
 }).catch(()=>{if(alive)root.innerHTML='<p class="room-error">⚠</p>';});
 return ()=>{alive=false;};
}
