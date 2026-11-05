// Daily challenge clock and deterministic randomness. Same date (Brasília) => same content for everyone.
export const LAUNCH='2026-10-18';
export function dateKey(now=new Date()){
 // en-CA formats as YYYY-MM-DD.
 return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function challengeNumber(key=dateKey()){
 const day=s=>Date.UTC(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10));
 return Math.floor((day(key)-day(LAUNCH))/864e5)+1;
}
export function hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
export function rng(seed){let a=typeof seed==='string'?hash(seed):seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export const pick=(r,arr)=>arr[Math.floor(r()*arr.length)];
export function shuffle(r,arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export const int=(r,lo,hi)=>lo+Math.floor(r()*(hi-lo+1));
// A stable daily index into a list, cycling through it without repeats before the list is exhausted.
export function dailyIndex(listLength,salt,key=dateKey()){
 const n=challengeNumber(key)-1,round=Math.floor(n/listLength),order=shuffle(rng(`${salt}:round:${round}`),[...Array(listLength).keys()]);
 return order[((n%listLength)+listLength)%listLength];
}

const PREFIX='bowlertest.daily.';
const memory=new Map();
export const progress={
 key:(room,day=dateKey(),lang='pt-BR')=>`${PREFIX}${day}.${room}${lang==='en'?'.en':''}`,
 load(room,day,lang){const key=this.key(room,day,lang);try{const value=JSON.parse(memory.get(key)??localStorage.getItem(key)??'null');return value&&typeof value==='object'&&!Array.isArray(value)?value:null;}catch{return null;}},
 save(room,data,day,lang){const key=this.key(room,day,lang),value=JSON.stringify(data);memory.set(key,value);try{localStorage.setItem(key,value);}catch{}},
 entries(){const all=new Map();try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith(PREFIX))all.set(k,localStorage.getItem(k));}}catch{}for(const [k,v] of memory)all.set(k,v);
  return [...all].flatMap(([key,value])=>{try{const m=key.match(/^bowlertest\.daily\.(\d{4}-\d{2}-\d{2})\.([a-z]+)(\.en)?$/),data=JSON.parse(value);return m&&data&&typeof data==='object'&&!Array.isArray(data)?[{...data,day:m[1],room:m[2],lang:m[3]?'en':'pt-BR'}]:[];}catch{return [];}});},
 doneToday(rooms,day,lang){return rooms.filter(r=>this.load(r,day,lang)?.result).length;}
};
