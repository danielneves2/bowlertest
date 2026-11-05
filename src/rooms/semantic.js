// In-browser semantic space (CC0 vectors, PCA-reduced, int8). Built by tools/build_word_space.py.
const cache=new Map();
export function normalize(word){return String(word||'').trim().toLowerCase().replace(/\s+/g,' ').normalize('NFC');}
export async function loadSpace(lang){
 if(cache.has(lang))return cache.get(lang);
 const base=`/data/words/${lang}/`;
 const promise=(async()=>{
  const [meta,vocab,infl,lists,buf]=await Promise.all([
   fetch(base+'meta.json').then(r=>r.json()),fetch(base+'vocab.json').then(r=>r.json()),
   fetch(base+'infl.json').then(r=>r.json()),fetch(base+'secrets.json').then(r=>r.json()),
   fetch(base+'vectors.bin').then(r=>{if(!r.ok)throw Error('vectors');return r.arrayBuffer();})]);
  const index=new Map(vocab.map((w,i)=>[w,i]));
  const Q=new Int8Array(buf),dim=meta.dim;
  const space={lang,meta,vocab,infl,index,Q,dim,secrets:lists.secrets,anchors:lists.anchors,
   isNoun:i=>meta.nouns[i]==='1',
   // Resolve a typed word to a vocabulary index, folding plurals/conjugations to their base form.
   find(word){const w=normalize(word);if(index.has(w))return index.get(w);const b=infl[w];if(b&&index.has(b))return index.get(b);
    const plain=w.normalize('NFD').replace(/[̀-ͯ]/g,'');if(index.has(plain))return index.get(plain);return -1;},
   dot(i,j){let s=0;const a=i*dim,b=j*dim;for(let k=0;k<dim;k++)s+=Q[a+k]*Q[b+k];return s/(127*127);},
   // rank[i] = position of word i when every word is sorted by similarity to target (target itself = 1).
   ranking(target){const n=vocab.length,sims=new Float32Array(n);for(let i=0;i<n;i++)sims[i]=space.dot(target,i);sims[target]=Infinity;
    const order=Array.from({length:n},(_,i)=>i).sort((a,b)=>sims[b]-sims[a]);const rank=new Int32Array(n);order.forEach((w,p)=>rank[w]=p+1);return {rank,order};}
  };
  return space;
 })();
 cache.set(lang,promise);promise.catch(()=>cache.delete(lang));
 return promise;
}
