from pathlib import Path
p=Path('src/game/salon.js');s=p.read_text();a=s.index('export function drawCarpet');b=s.index('// Exploration corners')
s=s[:a]+'''let floorPattern;
export function drawCarpet(ctx,project,camera){
 const im=images['floor-woven'];if(!im.complete||!im.naturalWidth)return;
 floorPattern ||= ctx.createPattern(im,'repeat');
 const tile=.9,band=3;
 ctx.save();ctx.fillStyle=floorPattern;
 for(let screenY=Math.floor(camera.height*.321);screenY<camera.height;screenY+=band){
  const v=(screenY+band/2)/camera.height;
  const depth=v<=.78?Math.log((v-.32)/.46)/1.35:(v-.78)/.5;
  const y=depth+camera.y,p=project(0,y),unit=project(1,y).x-p.x,scale=tile*unit/im.width;
  ctx.globalAlpha=.13*Math.min(1,Math.max(0,(v-.32)/.2));
  floorPattern.setTransform(new DOMMatrix([scale,0,0,scale,p.x,screenY-y*unit]));
  ctx.fillRect(0,screenY,camera.width,band);
 }
 ctx.restore();
}
''' +s[b:];s=s.replace("x:-1.06,y:.36","x:-.78,y:.36").replace("x:1.08,y:.64","x:.75,y:.64");p.write_text(s)
