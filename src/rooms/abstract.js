// Sala 1 · "A Janela": 3×3 matrices governed by rules (own generator; method in the spirit of progressive matrices).
import {shuffle,pick} from './daily.js';

export const meta={
 'pt-BR':{title:'A Janela',lede:'Seis janelas, cada uma com uma lógica escondida. Descubra o que falta no canto.',
  how:['Cada linha segue regras: algo pode ficar igual, crescer, ou aparecer uma vez em cada linha.','As regras valem para forma, quantidade, cor e tamanho. Olhe as linhas e as colunas.','Escolha a peça que completa a janela. A dificuldade sobe a cada janela.']},
 en:{title:'The Window',lede:'Six windows, each hiding its own logic. Find what is missing in the corner.',
  how:['Each row follows rules: something can stay the same, grow, or appear once in every row.','Rules apply to shape, number, colour and size. Look across rows and down columns.','Pick the piece that completes the window. Difficulty rises with each window.']}
};
const T={
 'pt-BR':{of:(k,n)=>`Janela ${k} de ${n}`,right:'Isso!',wrong:'Não era essa.',next:'Próxima',share:(n,e,c)=>`BOWLER TEST · A Janela #${n}\n${e} ${c}/6`,summary:(c,s)=>`${c} de 6 janelas em ${s}s.`},
 en:{of:(k,n)=>`Window ${k} of ${n}`,right:'Yes!',wrong:'Not that one.',next:'Next',share:(n,e,c)=>`BOWLER TEST · The Window #${n}\n${e} ${c}/6`,summary:(c,s)=>`${c} of 6 windows in ${s}s.`}
};
const ATTRS={shape:['circle','square','triangle','diamond','hexagon'],count:[1,2,3],fill:['ink','green','line'],size:[.55,.75,.95]};
const LEVELS=[ // rules per level; attributes not listed are constant
 {count:'progression'},
 {count:'progression',fill:'rowconst'},
 {shape:'distribute',fill:'progression'},
 {shape:'distribute',count:'progression',size:'rowconst'},
 {shape:'distribute',fill:'distribute',count:'progression'},
 {shape:'distribute',fill:'distribute',count:'distribute',size:'progression'}
];
export function generate(r,level){
 const rules=LEVELS[level],grid=[...Array(3)].map(()=>[...Array(3)].map(()=>({})));
 for(const [attr,values] of Object.entries(ATTRS)){
  const pool=shuffle(r,values.map((_,i)=>i)).slice(0,3),rule=rules[attr]||'constant';
  const dir=r()<.5?1:-1,shift=r()<.5?1:2,rowPerm=shuffle(r,[0,1,2]);
  for(let row=0;row<3;row++)for(let col=0;col<3;col++){
   let k;
   if(rule==='constant')k=0;
   else if(rule==='rowconst')k=rowPerm[row];
   else if(rule==='progression')k=dir>0?col:2-col;
   else k=(col+row*shift)%3;
   // Progressions on ordered attributes keep their natural order (1,2,3 / small→large).
   const idx=(rule==='progression'&&(attr==='count'||attr==='size'))?[0,1,2][k]:pool[k];
   grid[row][col][attr]=idx;
  }
 }
 const answer=grid[2][2],key=c=>Object.keys(ATTRS).map(a=>c[a]).join(','),options=[answer],seen=new Set([key(answer)]);
 const varying=Object.keys(ATTRS);let guard=0;
 while(options.length<6&&guard++<200){
  const attr=pick(r,varying),alt={...answer};let v=Math.floor(r()*ATTRS[attr].length);if(v===answer[attr])continue;alt[attr]=v;
  if(!seen.has(key(alt))){seen.add(key(alt));options.push(alt);}
 }
 const shuffled=shuffle(r,options);
 return {grid,options:shuffled,answer:shuffled.indexOf(answer)};
}
const COLORS={ink:'#1b211d',green:'#1f7a55',line:'none'};
function shapeSVG(kind,cx,cy,s,fill){
 const st=fill==='line'?'fill="none" stroke="#1b211d" stroke-width="2.4"':`fill="${COLORS[fill]}"`;
 if(kind==='circle')return `<circle cx="${cx}" cy="${cy}" r="${s}" ${st}/>`;
 if(kind==='square')return `<rect x="${cx-s*.88}" y="${cy-s*.88}" width="${s*1.76}" height="${s*1.76}" rx="2" ${st}/>`;
 const poly=(n,rot)=>[...Array(n)].map((_,i)=>{const a=rot+i*2*Math.PI/n;return `${(cx+s*Math.cos(a)).toFixed(1)},${(cy+s*Math.sin(a)).toFixed(1)}`;}).join(' ');
 if(kind==='triangle')return `<polygon points="${poly(3,-Math.PI/2)}" ${st}/>`;
 if(kind==='diamond')return `<polygon points="${poly(4,-Math.PI/2)}" ${st}/>`;
 return `<polygon points="${poly(6,0)}" ${st}/>`;
}
export function cellSVG(c){
 const n=ATTRS.count[c.count],s=ATTRS.size[c.size]*17,kind=ATTRS.shape[c.shape],fill=ATTRS.fill[c.fill];
 const pos=n===1?[[50,50]]:n===2?[[32,50],[68,50]]:[[50,30],[30,66],[70,66]];
 return `<svg viewBox="0 0 100 100" aria-hidden="true">${pos.map(([x,y])=>shapeSVG(kind,x,y,s,fill)).join('')}</svg>`;
}

export function mount(root,ctx){
 const t=T[ctx.lang],puzzles=LEVELS.map((_,i)=>generate(ctx.rng('p'+i),i));
 const st=ctx.saved||{answers:[],started:Date.now(),done:false};
 root.innerHTML='<div class="mx"><div class="mx-top"><span class="mx-step"></span><span class="mx-dots"></span></div><div class="mx-grid"></div><div class="mx-options"></div><p class="mx-msg" aria-live="polite"></p></div>';
 const grid=root.querySelector('.mx-grid'),opts=root.querySelector('.mx-options'),msg=root.querySelector('.mx-msg');
 const dots=()=>root.querySelector('.mx-dots').textContent=puzzles.map((_,i)=>i<st.answers.length?(st.answers[i]?'●':'×'):'○').join('');
 let locked=false;
 const show=k=>{
  dots();if(k>=puzzles.length){finish();return;}
  const p=puzzles[k];root.querySelector('.mx-step').textContent=t.of(k+1,puzzles.length);msg.textContent='';locked=false;
  grid.innerHTML=p.grid.flat().map((c,i)=>i===8?'<div class="mx-cell mx-missing">?</div>':`<div class="mx-cell">${cellSVG(c)}</div>`).join('');
  opts.innerHTML='';p.options.forEach((o,i)=>{const b=document.createElement('button');b.className='mx-option';b.innerHTML=cellSVG(o);b.setAttribute('aria-label',String(i+1));
   b.onclick=()=>{if(locked)return;locked=true;const ok=i===p.answer;st.answers.push(ok);ctx.save(st);
    b.classList.add(ok?'right':'wrong');opts.children[p.answer].classList.add('right');grid.lastElementChild.innerHTML=cellSVG(p.options[p.answer]);grid.lastElementChild.classList.add('revealed');
    msg.textContent=ok?t.right:t.wrong;dots();setTimeout(()=>show(k+1),ok?700:1400);};opts.append(b);});
 };
 const finish=()=>{if(st.done){dots();return;}st.done=true;st.seconds=Math.round((Date.now()-st.started)/1000);ctx.save(st);
  const c=st.answers.filter(Boolean).length,e=st.answers.map(a=>a?'🟩':'🟥').join('');grid.innerHTML='';opts.innerHTML='';
  ctx.finish({summary:t.summary(c,st.seconds),share:t.share(ctx.number,e,c),score:{correct:c,seconds:st.seconds}});};
 const onKey=e=>{const n=+e.key;if(n>=1&&n<=6&&opts.children[n-1])opts.children[n-1].click();};
 window.addEventListener('keydown',onKey);
 if(st.done){dots();grid.innerHTML='';}else show(st.answers.length);
 return ()=>window.removeEventListener('keydown',onKey);
}
