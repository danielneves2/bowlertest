import {dateKey,LAUNCH,progress} from '../rooms/daily.js';
export const IDS=['abstract','verbal','numerical','spatial','memory','divergent','convergent','personality'];
export const VERSION=1;
export const shiftDay=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')+n*864e5).toISOString().slice(0,10);
export function validDay(day,today=dateKey()){
 if(typeof day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(day))return false;
 const d=new Date(day+'T12:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===day&&day>=LAUNCH&&day<=today;
}
export function records(lang,entries=progress.entries()){return entries.filter(r=>IDS.includes(r.room)&&r.lang===lang&&validDay(r.day));}
export function stateOf(room,day,lang){const r=progress.load(room,day,lang);return r?.result?'done':r?.state||r?.startedAt?'active':'new';}
export function metric(room,result){const s=result?.score;if(!s||room==='personality')return null;
 const value=room==='verbal'?(s.solved?s.guesses:null):s[({abstract:'correct',numerical:'correct',spatial:'correct',memory:'span',divergent:'distance',convergent:'solved'})[room]];
 return typeof value==='number'&&Number.isFinite(value)&&value>=0?value:null;
}
export function comparison(record,history){
 const value=metric(record.room,record.result),lower=record.room==='verbal';
 const prior=history.filter(r=>r.room===record.room&&r.lang===record.lang&&r.day<record.day&&r.version===VERSION&&record.version===VERSION&&metric(r.room,r.result)!==null&&(record.room!=='verbal'&&record.room!=='convergent'||r.result.score.hints===record.result.score.hints));
 if(value===null||!prior.length)return {value,best:null,scale:1,change:null};
 const best=(lower?Math.min:Math.max)(...prior.map(r=>metric(r.room,r.result)));
 // An artistic size encoding, not a psychometric scale. Baseline is neutral; ±20% maximum.
 const change=(value-best)*(lower?-1:1),scale=1+.2*Math.max(-1,Math.min(1,change/Math.max(1,Math.abs(best))));
 return {value,best,change,scale};
}
export function week(day,history){const days=Array.from({length:7},(_,i)=>shiftDay(day,i-6));
 return IDS.map(room=>{const points=days.map(d=>{const r=history.find(r=>r.room===room&&r.day===d&&r.version===VERSION&&r.result);return {day:d,value:r?metric(room,r.result):null,done:!!r,hints:r?.result?.score?.hints};});
  const values=points.filter(p=>p.value!==null),comparable=room!=='verbal'&&room!=='convergent'||new Set(values.map(p=>p.hints)).size<=1;
  return {room,points,count:points.filter(p=>p.done).length,delta:values.length>=2&&comparable?values.at(-1).value-values[0].value:null,best:values.length&&comparable?(room==='verbal'?Math.min:Math.max)(...values.map(p=>p.value)):null};});
}
export function collection(history){return IDS.map(room=>({room,count:new Set(history.filter(r=>r.room===room&&r.result).map(r=>r.day)).size}));}
export function streak(history,today=dateKey()){
 // Actual day played, never the archive's target date. Legacy records have no reliable activity timestamp.
 const days=new Set(history.filter(r=>r.result&&validDay(r.playedDay,today)).map(r=>r.playedDay));let d=days.has(today)?today:shiftDay(today,-1),n=0;
 while(days.has(d)){n++;d=shiftDay(d,-1);}return n;
}
export function personalityAnswers(history,day){const out={};for(const r of history.filter(r=>r.room==='personality'&&r.day<=day).sort((a,b)=>a.day.localeCompare(b.day)))for(const [k,v] of Object.entries(r.result?.responses||r.state?.responses||{}))if(/^\d+$/.test(k)&&+k<50&&Number.isInteger(v)&&v>=1&&v<=5)out[k]=v;return out;}
