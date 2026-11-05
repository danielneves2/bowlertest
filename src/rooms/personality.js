// Sala 8 · "O Espelho": five public-domain IPIP Big-Five marker items a day (Goldberg; IPIP-50).
// Portuguese wording is a free, non-validated translation. No right answers and no score.
import {challengeNumber} from './daily.js';

export const meta={
 'pt-BR':{title:'O Espelho',lede:'Cinco frases aparecem no espelho. Quanto cada uma tem a ver com você?',
  how:['Não existe resposta certa. Responda pensando em como você costuma ser, não em como gostaria de ser.','A cada dia aparecem 5 frases novas. Em 10 dias o retrato fica completo.','Personalidade não é inteligência e nunca entra em nenhuma nota.']},
 en:{title:'The Mirror',lede:'Five sentences appear in the mirror. How much does each describe you?',
  how:['There are no right answers. Think about how you usually are, not how you wish to be.','Five new sentences appear every day. In 10 days the portrait is complete.','Personality is not intelligence and never enters any score.']}
};
// [factor, keyed (+1/-1), en, pt]
const ITEMS=[
 ['E',1,'Am the life of the party.','Sou a alma da festa.'],['E',-1,"Don't talk a lot.",'Não falo muito.'],['E',1,'Feel comfortable around people.','Fico à vontade perto de pessoas.'],['E',-1,'Keep in the background.','Fico em segundo plano.'],['E',1,'Start conversations.','Puxo conversa.'],
 ['E',-1,'Have little to say.','Tenho pouco a dizer.'],['E',1,'Talk to a lot of different people at parties.','Converso com muita gente diferente nas festas.'],['E',-1,"Don't like to draw attention to myself.",'Não gosto de chamar atenção.'],['E',1,"Don't mind being the center of attention.",'Não me incomodo de ser o centro das atenções.'],['E',-1,'Am quiet around strangers.','Fico quieto perto de desconhecidos.'],
 ['A',-1,'Feel little concern for others.','Me preocupo pouco com os outros.'],['A',1,'Am interested in people.','Tenho interesse pelas pessoas.'],['A',-1,'Insult people.','Ofendo as pessoas.'],['A',1,"Sympathize with others' feelings.",'Me solidarizo com o que os outros sentem.'],['A',-1,"Am not interested in other people's problems.",'Não me interesso pelos problemas dos outros.'],
 ['A',1,'Have a soft heart.','Tenho o coração mole.'],['A',-1,'Am not really interested in others.','Não me interesso muito pelos outros.'],['A',1,'Take time out for others.','Reservo tempo para os outros.'],['A',1,"Feel others' emotions.",'Sinto as emoções dos outros.'],['A',1,'Make people feel at ease.','Deixo as pessoas à vontade.'],
 ['C',1,'Am always prepared.','Estou sempre preparado.'],['C',-1,'Leave my belongings around.','Deixo minhas coisas espalhadas.'],['C',1,'Pay attention to details.','Presto atenção aos detalhes.'],['C',-1,'Make a mess of things.','Faço bagunça com as coisas.'],['C',1,'Get chores done right away.','Faço as tarefas logo.'],
 ['C',-1,'Often forget to put things back in their proper place.','Esqueço de guardar as coisas no lugar.'],['C',1,'Like order.','Gosto de ordem.'],['C',-1,'Shirk my duties.','Fujo das minhas obrigações.'],['C',1,'Follow a schedule.','Sigo uma rotina planejada.'],['C',1,'Am exacting in my work.','Sou exigente no meu trabalho.'],
 ['N',1,'Get stressed out easily.','Fico estressado com facilidade.'],['N',-1,'Am relaxed most of the time.','Fico tranquilo a maior parte do tempo.'],['N',1,'Worry about things.','Me preocupo com as coisas.'],['N',-1,'Seldom feel blue.','Raramente fico para baixo.'],['N',1,'Am easily disturbed.','Me perturbo com facilidade.'],
 ['N',1,'Get upset easily.','Fico chateado com facilidade.'],['N',1,'Change my mood a lot.','Mudo muito de humor.'],['N',1,'Have frequent mood swings.','Tenho oscilações de humor frequentes.'],['N',1,'Get irritated easily.','Me irrito com facilidade.'],['N',1,'Often feel blue.','Fico para baixo com frequência.'],
 ['O',1,'Have a rich vocabulary.','Tenho um vocabulário rico.'],['O',-1,'Have difficulty understanding abstract ideas.','Tenho dificuldade com ideias abstratas.'],['O',1,'Have a vivid imagination.','Tenho uma imaginação viva.'],['O',-1,'Am not interested in abstract ideas.','Não me interesso por ideias abstratas.'],['O',1,'Have excellent ideas.','Tenho ideias excelentes.'],
 ['O',-1,'Do not have a good imagination.','Não tenho muita imaginação.'],['O',1,'Am quick to understand things.','Entendo as coisas rápido.'],['O',1,'Use difficult words.','Uso palavras difíceis.'],['O',1,'Spend time reflecting on things.','Passo tempo refletindo sobre as coisas.'],['O',1,'Am full of ideas.','Estou cheio de ideias.']
];
const FACTORS={'pt-BR':{E:'Extroversão',A:'Amabilidade',C:'Conscienciosidade',N:'Estabilidade emocional',O:'Abertura e imaginação'},en:{E:'Extraversion',A:'Agreeableness',C:'Conscientiousness',N:'Emotional stability',O:'Openness and intellect'}};
const T={
 'pt-BR':{scale:['Nada a ver comigo','Pouco','Mais ou menos','Bastante','Sou exatamente assim'],of:(k,n)=>`Frase ${k} de ${n}`,profile:'Seu retrato até agora',based:(a,n)=>`${a} de ${n} frases`,
  caveat:'Médias na escala de 1 a 5, comparadas só com o meio da escala, nunca com outras pessoas. Tradução livre, não validada.',share:(n,c)=>`BOWLER TEST · O Espelho #${n}\n🪞 ${c}/50 frases respondidas`,summary:c=>`${c} de 50 frases respondidas até agora.`},
 en:{scale:['Not me at all','A little','Somewhat','Quite a lot','Exactly me'],of:(k,n)=>`Sentence ${k} of ${n}`,profile:'Your portrait so far',based:(a,n)=>`${a} of ${n} sentences`,
  caveat:'Averages on a 1–5 scale, compared only with the scale midpoint, never with other people.',share:(n,c)=>`BOWLER TEST · The Mirror #${n}\n🪞 ${c}/50 sentences answered`,summary:c=>`${c} of 50 sentences answered so far.`}
};
// Day d (cycling every 10 days) shows the d-th item of each factor: one E, A, C, N, O.
export function dailyItems(day){const d=(challengeNumber(day)-1)%10;return ['E','A','C','N','O'].map(f=>ITEMS.findIndex((it,i)=>it[0]===f&&ITEMS.slice(0,i+1).filter(x=>x[0]===f).length===d+1));}
export function profile(answers){
 const out={};for(const f of ['E','A','C','N','O']){const ids=ITEMS.map((it,i)=>[it,i]).filter(([it])=>it[0]===f);const vals=ids.filter(([,i])=>answers[i]).map(([it,i])=>it[1]>0?answers[i]:6-answers[i]);
  let mean=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;if(f==='N'&&mean!==null)mean=6-mean;out[f]={mean,answered:vals.length,total:ids.length};}
 return out;
}

export function mount(root,ctx){
 const t=T[ctx.lang],today=dailyItems(ctx.day),all={...(ctx.personalityAnswers||{})};
 const st=ctx.saved||{k:0,done:false};
 st.responses||={};Object.assign(all,st.responses);
 root.innerHTML='<div class="mirror"><div class="mirror-frame"><span class="mirror-step"></span><p class="mirror-text"></p></div><div class="mirror-scale"></div><div class="mirror-profile"></div></div>';
 const q=s=>root.querySelector(s);
 const drawProfile=()=>{const p=profile(all),f=FACTORS[ctx.lang];
  q('.mirror-profile').innerHTML=`<h3>${t.profile}</h3>`+Object.entries(p).map(([k,v])=>`<div class="trait"><span>${f[k]}</span><div class="trait-bar"><i style="left:${v.mean?((v.mean-1)/4*100).toFixed(0):50}%;opacity:${v.mean?1:.15}"></i></div><small>${t.based(v.answered,v.total)}</small></div>`).join('')+`<p class="dat-caveat">${t.caveat}</p>`;};
 const show=()=>{if(st.k>=today.length){finish();return;}const it=ITEMS[today[st.k]];q('.mirror-step').textContent=t.of(st.k+1,today.length);
  q('.mirror-text').textContent=ctx.lang==='pt-BR'?it[3]:it[2];q('.mirror-scale').innerHTML='';
  t.scale.forEach((label,v)=>{const b=document.createElement('button');b.className='mirror-option';b.innerHTML=`<b>${v+1}</b><span>${label}</span>`;
   b.onclick=()=>{all[today[st.k]]=v+1;st.responses[today[st.k]]=v+1;st.k++;ctx.save(st);drawProfile();show();};q('.mirror-scale').append(b);});};
 const finish=()=>{q('.mirror').classList.add('completed');q('.mirror-frame').hidden=true;q('.mirror-scale').hidden=true;drawProfile();if(st.done)return;st.done=true;ctx.save(st);
  const c=Object.keys(all).length;ctx.finish({summary:t.summary(c),share:t.share(ctx.number,c),responses:{...st.responses},profile:profile(all),score:{answered:c}});};
 drawProfile();if(st.done)finish();else show();
}
