import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.mp3':'audio/mpeg','.svg':'image/svg+xml'};
const candidates=Object.fromEntries(['front','back','left','right'].map(d=>[`/preview/walk-${d}.png`,`assets/staging/character/walk/walk-${d}.png`]));
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost'); const name=decodeURIComponent(url.pathname);
  let relative=name==='/'?'public/index.html':candidates[name]??(name==='/preview/music.mp3'?'assets/sources/audio/the-case-of-the-missing-note.mp3':name.startsWith('/assets/')?'public'+name:name.startsWith('/src/')?name.slice(1):null);
  if(!relative||!['GET','HEAD'].includes(req.method)){res.writeHead(404);return res.end();}
  const file=path.resolve(root,relative);
  if(!file.startsWith(root)||relative.split(/[\\/]/).includes('..')){res.writeHead(403);return res.end();}
  const info=await stat(file);if(!info.isFile())throw Error('file');
  const data=await readFile(file);const headers={'Content-Type':types[path.extname(file)]??'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):data.length-1,data.length-1);if(start>end){res.writeHead(416,{'Content-Range':`bytes */${data.length}`});return res.end();}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});return res.end(req.method==='HEAD'?undefined:data.subarray(start,end+1));}
  res.writeHead(200,{...headers,'Content-Length':data.length});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('BOWLER TEST — http://127.0.0.1:4173'));
