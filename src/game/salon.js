// Generated raster art, placed on the shared world plane.
const images={};
for(const id of ['frame-knight-3d','sculpture-stair-3d','frame-stone-3d','floor-woven']){const im=new Image();im.decoding='async';im.src=`/assets/salon-raster/${id}.png`;images[id]=im;}
let floorPattern;
export function drawCarpet(ctx,project,camera){
 const im=images['floor-woven'];if(!im.complete||!im.naturalWidth)return;
 floorPattern ||= ctx.createPattern(im,'repeat');
 const tile=.9,band=6;
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
// Frontal knight artwork on the back wall; grounded objects flank the portal arcade.
export const DECOR=[
 {id:'frame-knight-3d',x:0,y:-.95,size:1.65,lift:225,tilt:0,wall:true},
 {id:'frame-stone-3d',x:-2.4,y:.35,size:1.32,lift:0,tilt:0},
 {id:'sculpture-stair-3d',x:2.4,y:.35,size:2.2,lift:0,tilt:0}
];
export function salonObjects(ctx,project,actorScale,time,reduced){
 return DECOR.map(o=>({y:o.y,draw(){
  const im=images[o.id];if(!im.complete||!im.naturalWidth)return;
  const p=project(o.x,o.y),h=304*actorScale()*o.size*p.scale,w=h*im.naturalWidth/im.naturalHeight;
  const lift=o.lift*(actorScale()/.6)*p.scale;
  if(!o.wall){
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,.19);
  const r=w*(o.lift?.44:.25),g=ctx.createRadialGradient(0,0,0,0,0,r);
  g.addColorStop(0,o.lift?'#1b2b1925':'#17221760');g.addColorStop(.35,'#21302020');g.addColorStop(1,'#21302000');ctx.fillStyle=g;ctx.fillRect(-r,-r,r*2,r*2);ctx.restore();
  }
  ctx.save();ctx.translate(p.x,p.y-lift);ctx.rotate(o.tilt);ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();
 }}));
}
