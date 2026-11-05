import test from 'node:test';
import assert from 'node:assert/strict';
import {pageSlice} from './pages.js';
test('pagination keeps every entry reachable exactly once, including a partial last page',()=>{
 const entries=Array.from({length:31},(_,i)=>i);
 for(const size of [1,2,3,4,6]){
  const {count}=pageSlice(entries,0,size);
  assert.deepEqual(Array.from({length:count},(_,page)=>pageSlice(entries,page,size).items).flat(),entries);
 }
});
test('empty lists and navigation outside the available range remain stable',()=>{
 assert.deepEqual(pageSlice([],5,4),{index:0,count:1,items:[]});
 assert.deepEqual(pageSlice([1,2,3],-1,2).items,[1,2]);
 assert.deepEqual(pageSlice([1,2,3],20,2).items,[3]);
 assert.equal(pageSlice([1,2,3],NaN,2).index,0);
 for(const size of [0,-1,1.5,Infinity])assert.throws(()=>pageSlice([],0,size),RangeError);
});
