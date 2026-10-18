// Builds a walk strip facing the opposite way from a candidate strip, frame by frame, at load time.
// Each frame is flipped around its own centre, so the foot pivot (x=128) is preserved.
// The source files are never modified.
export const FRAME_W=256,FRAME_H=320;

const isGreen=(p,i,margin=35)=>p[i+3]>200&&p[i+1]>p[i]+margin&&p[i+1]>p[i+2]+15;

export function mirrorStrip(img,{dropPocketSquare=false}={}){
 const frames=Math.round(img.width/FRAME_W),c=document.createElement('canvas');c.width=img.width;c.height=img.height;
 const g=c.getContext('2d',{willReadFrequently:true});
 for(let k=0;k<frames;k++){g.save();g.translate((k+1)*FRAME_W,0);g.scale(-1,1);g.drawImage(img,k*FRAME_W,0,FRAME_W,FRAME_H,0,0,FRAME_W,FRAME_H);g.restore();}
 if(dropPocketSquare){const data=g.getImageData(0,0,c.width,c.height);for(let k=0;k<frames;k++)removePocketSquare(data,k);g.putImageData(data,0,0);}
 return c;
}

// The pocket square sits on the Bowler's left breast: visible walking left, hidden walking right.
// In a mirrored left-walk frame it shows up on the wrong side, so it is painted over with the jacket below it.
// It is told apart from the tie as a separate, smaller run of green columns on the chest.
function removePocketSquare(data,k){
 const p=data.data,W=data.width,x0=k*FRAME_W,Y0=150,Y1=250,count=new Array(FRAME_W).fill(0);
 for(let y=Y0;y<Y1;y++)for(let x=0;x<FRAME_W;x++)if(isGreen(p,(y*W+x0+x)*4))count[x]++;
 const runs=[];let run=null;
 for(let x=0;x<FRAME_W;x++){if(count[x]){if(!run)runs.push(run={from:x,to:x,n:0});run.to=x;run.n+=count[x];}else run=null;}
 if(runs.length<2)return;
 const tie=runs.reduce((a,b)=>b.n>a.n?b:a);
 for(const r of runs){
  if(r===tie||r.n>tie.n*.6)continue;
  for(let y=Y0;y<Y1;y++)for(let x=r.from-1;x<=r.to+1;x++){
   const i=(y*W+x0+x)*4;if(!isGreen(p,i,10))continue;
   // Copy the jacket from just below (or above) the patch, keeping the fabric texture.
   for(const dy of [10,12,-10,-12]){const j=((y+dy)*W+x0+x)*4;if(p[j+3]>200&&!isGreen(p,j,10)){p[i]=p[j];p[i+1]=p[j+1];p[i+2]=p[j+2];break;}}
  }
 }
}
