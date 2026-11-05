// Sala 4 · "O Cubo no Céu": mental rotation (method of Shepard & Metzler) with generated chiral polycubes.
import {shuffle,int} from './daily.js';

export const meta={
 'pt-BR':{title:'O Cubo no Céu',lede:'Uma peça flutua no céu. Qual das vistas é a mesma peça, só que girada?',
  how:['As outras opções são o reflexo da peça no espelho, girado. Parecem iguais, mas não dá para encaixar uma na outra.','Imagine a peça girando no ar. Conte os cubos e observe para onde cada ponta aponta.','Seis rodadas; as peças crescem e os giros ficam maiores.']},
 en:{title:'The Cube in the Sky',lede:'A piece floats in the sky. Which view is the same piece, only rotated?',
  how:['The other options are the mirror image of the piece, rotated. They look alike but can never be turned into each other.','Picture the piece turning in the air. Count the cubes and watch where each arm points.','Six rounds; pieces grow and rotations get larger.']}
};
const T={
 'pt-BR':{of:(k,n)=>`Peça ${k} de ${n}`,right:'Isso!',wrong:'Esse era o reflexo.',target:'A peça',share:(n,e,c)=>`BOWLER TEST · O Cubo #${n}\n${e} ${c}/6`,summary:(c,s)=>`${c} de 6 peças em ${s}s.`},
 en:{of:(k,n)=>`Piece ${k} of ${n}`,right:'Yes!',wrong:'That one was the mirror.',target:'The piece',share:(n,e,c)=>`BOWLER TEST · The Cube #${n}\n${e} ${c}/6`,summary:(c,s)=>`${c} of 6 pieces in ${s}s.`}
};
// 24 proper rotations of the cube as functions on [x,y,z].
const ROTS=(()=>{const out=[],seen=new Set();const rx=p=>[p[0],-p[2],p[1]],ry=p=>[p[2],p[1],-p[0]],rz=p=>[-p[1],p[0],p[2]];
 const gens=[rx,ry,rz];const queue=[p=>p];
 while(queue.length){const f=queue.shift();const sig=JSON.stringify([[1,0,0],[0,1,0],[0,0,1]].map(f));if(seen.has(sig))continue;seen.add(sig);out.push(f);for(const g of gens)queue.push(p=>g(f(p)));}
 return out;})();
const norm=cubes=>{const m=[0,1,2].map(i=>Math.min(...cubes.map(c=>c[i])));return cubes.map(c=>c.map((v,i)=>v-m[i])).sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);};
const key=cubes=>JSON.stringify(norm(cubes));
const mirror=cubes=>cubes.map(([x,y,z])=>[-x,y,z]);
export const rotate=(cubes,r)=>cubes.map(ROTS[r]);
export function sameShape(a,b){const kb=key(b);return ROTS.some((_,r)=>key(rotate(a,r))===kb);}
export function makePiece(r,n){
 for(let tries=0;tries<200;tries++){
  const cubes=[[0,0,0]],dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];let dir=dirs[int(r,0,5)];
  while(cubes.length<n){if(r()<.45)dir=dirs[int(r,0,5)];const last=cubes.at(-1),nx=[last[0]+dir[0],last[1]+dir[1],last[2]+dir[2]];if(!cubes.some(c=>c+''===nx+''))cubes.push(nx);}
  if(!sameShape(cubes,mirror(cubes)))return cubes;
 }
 return [[0,0,0],[1,0,0],[2,0,0],[2,1,0],[2,1,1],[0,0,1]];
}
export function round(r,k){
 const piece=makePiece(r,5+Math.floor(k/2)),view=int(r,0,23);
 const rots=shuffle(r,[...Array(24).keys()].filter(x=>x!==view));
 const options=[{cubes:rotate(piece,rots[0]),ok:true},...rots.slice(1,4).map(x=>({cubes:rotate(mirror(piece),x),ok:false}))];
 const shuffled=shuffle(r,options);
 return {target:rotate(piece,view),options:shuffled,answer:shuffled.findIndex(o=>o.ok)};
}
export function svg(cubes){
 const c=norm(cubes),has=new Set(c.map(p=>p+'')),s=18,cos=Math.cos(Math.PI/6);
 const P=(x,y,z)=>[(x-y)*cos*s,(x+y)*.5*s-z*s];
 const faces=[];
 for(const [x,y,z] of [...c].sort((a,b)=>(a[0]+a[1]+a[2])-(b[0]+b[1]+b[2]))){
  if(!has.has([x,y,z+1]+''))faces.push(['top',[P(x,y,z+1),P(x+1,y,z+1),P(x+1,y+1,z+1),P(x,y+1,z+1)]]);
  if(!has.has([x+1,y,z]+''))faces.push(['right',[P(x+1,y,z),P(x+1,y+1,z),P(x+1,y+1,z+1),P(x+1,y,z+1)]]);
  if(!has.has([x,y+1,z]+''))faces.push(['left',[P(x,y+1,z),P(x+1,y+1,z),P(x+1,y+1,z+1),P(x,y+1,z+1)]]);
 }
 const pts=faces.flatMap(f=>f[1]),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),pad=6;
 const vb=[Math.min(...xs)-pad,Math.min(...ys)-pad,Math.max(...xs)-Math.min(...xs)+pad*2,Math.max(...ys)-Math.min(...ys)+pad*2];
 return `<svg viewBox="${vb.map(v=>v.toFixed(1)).join(' ')}" aria-hidden="true">${faces.map(([k,p])=>`<polygon class="cube-${k}" points="${p.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}"/>`).join('')}</svg>`;
}

export function mount(root,ctx){
 const t=T[ctx.lang],rounds=[...Array(6)].map((_,k)=>round(ctx.rng('r'+k),k));
 const st=ctx.saved||{answers:[],started:Date.now(),done:false};
 root.innerHTML=`<div class="cube"><div class="mx-top"><span class="cube-step"></span><span class="cube-dots"></span></div><div class="cube-sky"><span>${t.target}</span><div class="cube-target"></div></div><div class="cube-options"></div><p class="mx-msg" aria-live="polite"></p></div>`;
 const q=s=>root.querySelector(s);let locked=false;
 const dots=()=>q('.cube-dots').textContent=rounds.map((_,i)=>i<st.answers.length?(st.answers[i]?'●':'×'):'○').join('');
 const show=k=>{dots();if(k>=rounds.length){finish();return;}locked=false;const rd=rounds[k];q('.cube-step').textContent=t.of(k+1,rounds.length);q('.mx-msg').textContent='';
  q('.cube-target').innerHTML=svg(rd.target);q('.cube-options').innerHTML='';
  rd.options.forEach((o,i)=>{const b=document.createElement('button');b.className='cube-option';b.innerHTML=svg(o.cubes);b.setAttribute('aria-label',String(i+1));
   b.onclick=()=>{if(locked)return;locked=true;const ok=i===rd.answer;st.answers.push(ok);ctx.save(st);b.classList.add(ok?'right':'wrong');q('.cube-options').children[rd.answer].classList.add('right');
    q('.mx-msg').textContent=ok?t.right:t.wrong;dots();setTimeout(()=>show(k+1),ok?700:1500);};q('.cube-options').append(b);});};
 const finish=()=>{q('.cube-sky').hidden=true;q('.cube-options').innerHTML='';if(st.done)return;st.done=true;st.seconds=Math.round((Date.now()-st.started)/1000);ctx.save(st);
  const c=st.answers.filter(Boolean).length;ctx.finish({summary:t.summary(c,st.seconds),share:t.share(ctx.number,st.answers.map(a=>a?'🟩':'🟥').join(''),c),score:{correct:c,seconds:st.seconds}});};
 const onKey=e=>{const n=+e.key;const o=q('.cube-options');if(n>=1&&n<=4&&o?.children[n-1])o.children[n-1].click();};window.addEventListener('keydown',onKey);
 if(st.done){dots();finish();}else show(st.answers.length);
 return ()=>window.removeEventListener('keydown',onKey);
}
