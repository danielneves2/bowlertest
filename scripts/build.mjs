// Monta a versão publicável do BOWLER TEST em dist/ (usado pela Vercel e por `npm run build`).
// Espelha as rotas do servidor local (server/local.mjs) como arquivos estáticos:
//   /            -> public/index.html
//   /src/*       -> src/*  (sem os testes)
//   /assets/*    -> public/assets/*
//   /data/*      -> public/data/*
//   /preview/*   -> caminhadas candidatas e música (se existir localmente)
import {cp,mkdir,rm,stat,copyFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'dist');
const from=p=>path.join(root,p),to=p=>path.join(out,p);
const exists=async p=>{try{await stat(p);return true;}catch{return false;}};

await rm(out,{recursive:true,force:true});
await mkdir(to('preview'),{recursive:true});

await copyFile(from('public/index.html'),to('index.html'));
await cp(from('public/assets'),to('assets'),{recursive:true,filter:s=>!s.endsWith('.gitkeep')});
await cp(from('public/data'),to('data'),{recursive:true});
await cp(from('src'),to('src'),{recursive:true,filter:s=>!/\.test\.js$/.test(s)&&!s.endsWith('.gitkeep')&&!s.includes(`${path.sep}tests`)});

for(const d of ['front','back','left','right']){
 const s=from(`assets/staging/character/walk/walk-${d}.png`);
 if(await exists(s))await copyFile(s,to(`preview/walk-${d}.png`));
 else throw Error(`Sprite de caminhada ausente: ${s}`);
}
const music=from('assets/sources/audio/the-case-of-the-missing-note.mp3');
if(await exists(music))await copyFile(music,to('preview/music.mp3'));

let files=0,bytes=0;
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else{files++;bytes+=(await stat(p)).size;}}}
await walk(out);
console.log(`dist/ pronto: ${files} arquivos, ${(bytes/1048576).toFixed(1)} MB`);
