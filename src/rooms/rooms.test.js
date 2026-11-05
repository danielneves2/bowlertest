import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dateKey,challengeNumber,rng,dailyIndex} from './daily.js';
import {generate as matrix} from './abstract.js';
import {generate as series} from './numerical.js';
import {round as cubeRound,sameShape} from './spatial.js';
import {layout,sequence} from './memory.js';
import {dailyTrios} from './convergent.js';
import {dailyItems,profile} from './personality.js';
import {ITEMS} from './convergent-items.js';

const days=['2026-10-18','2026-10-19','2026-11-30','2027-02-14'];
test('daily clock: launch is #1 and Brasília date is used',()=>{assert.equal(challengeNumber('2026-10-18'),1);assert.equal(challengeNumber('2026-10-28'),11);
 assert.equal(dateKey(new Date('2026-10-19T02:30:00Z')),'2026-10-18');assert.equal(dateKey(new Date('2026-10-19T03:30:00Z')),'2026-10-19');});
test('same seed, same content; different day, different content',()=>{const a=matrix(rng('x:2026-10-18'),3),b=matrix(rng('x:2026-10-18'),3),c=matrix(rng('x:2026-10-19'),3);
 assert.deepEqual(a,b);assert.notDeepEqual(a,c);});
test('dailyIndex cycles a list without repeats',()=>{const seen=new Set();for(let d=0;d<30;d++){const day=new Date(Date.UTC(2026,9,18+d,15)).toISOString().slice(0,10);seen.add(dailyIndex(30,'s',day));}assert.equal(seen.size,30);});
test('matrices: six options, one answer, each distractor differs in exactly one attribute',()=>{for(const day of days)for(let lv=0;lv<6;lv++){const p=matrix(rng(day+lv),lv);
 assert.equal(p.options.length,6);const ans=p.options[p.answer];assert.deepEqual(ans,p.grid[2][2]);
 p.options.forEach((o,i)=>{if(i===p.answer)return;const diff=Object.keys(o).filter(k=>o[k]!==ans[k]).length;assert.equal(diff,1);});
 assert.equal(new Set(p.options.map(o=>JSON.stringify(o))).size,6);}});
test('series: integer terms and answers',()=>{for(const day of days)for(let lv=0;lv<5;lv++){const s=series(rng(day+'n'+lv),lv);assert.ok(s.shown.length>=5);assert.ok([...s.shown,s.answer].every(Number.isInteger));}});
test('cubes: exactly one option is the rotated piece, the rest are mirrors',()=>{for(const day of days)for(let k=0;k<6;k++){const r=cubeRound(rng(day+'c'+k),k);
 r.options.forEach((o,i)=>assert.equal(sameShape(r.target,o.cubes),i===r.answer));}});
test('hats: distinct positions and sequences without repeats',()=>{const pos=layout(rng('h'));assert.equal(pos.length,9);for(let len=3;len<=9;len++){const s=sequence(rng('s'+len),len);assert.equal(new Set(s).size,len);}});
test('convergent: five trios a day, sorted by difficulty, both languages',()=>{for(const lang of ['pt-BR','en'])for(const day of days){const t=dailyTrios(lang,day);assert.equal(t.length,5);
 assert.ok(t.every((x,i)=>i===0||t[i-1][4]<=x[4]));}
 for(const lang of ['pt-BR','en'])for(const it of ITEMS[lang])assert.ok(it.length>=5&&it.slice(0,4).every(w=>typeof w==='string'&&w));});
test('mirror: one item per factor each day, 50 items over 10 days',()=>{const all=new Set();for(let d=0;d<10;d++){const day=new Date(Date.UTC(2026,9,18+d,15)).toISOString().slice(0,10);const ids=dailyItems(day);assert.equal(ids.length,5);ids.forEach(i=>all.add(i));}
 assert.equal(all.size,50);const p=profile({0:5,1:1});assert.equal(p.E.mean,5);assert.equal(p.E.answered,2);});
test('word spaces exist for both languages and secrets are in the vocabulary',()=>{for(const lang of ['pt-BR','en']){const base=new URL(`../../public/data/words/${lang}/`,import.meta.url);
 const meta=JSON.parse(readFileSync(new URL('meta.json',base)));const vocab=JSON.parse(readFileSync(new URL('vocab.json',base)));const lists=JSON.parse(readFileSync(new URL('secrets.json',base)));
 assert.equal(vocab.length,meta.count);assert.equal(readFileSync(new URL('vectors.bin',base)).length,meta.count*meta.dim);const v=new Set(vocab);
 assert.ok(lists.secrets.length>=100&&lists.secrets.every(w=>v.has(w)));assert.ok(lists.anchors.every(w=>v.has(w)));}});
