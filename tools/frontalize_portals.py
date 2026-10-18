"""Rebuild the BOWLER TEST portals from assets/sources/portals (originals, untouched).

- Verbal, numerical, spatial and personality were generated at an angle; their sky and motif are
  transplanted into the frontal frames of convergent, divergent, memory and abstract respectively,
  so every portal faces the camera and its leaf opens the same way.
- All eight are normalized so the marble base rests on the bottom edge of a 1024x1536 canvas
  (the game draws the floor contact point exactly there) and faint alpha noise is removed.
Run: python tools/frontalize_portals.py   (requires Pillow, numpy, scipy)
"""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=str(ROOT/'assets/sources/portals')+'/'
OUT=ROOT/'public/assets/environments/portals'
BOTTOM={'abstract':1300,'convergent':1290,'divergent':1290,'memory':1318,'verbal':1290,'numerical':1300,'spatial':1300,'personality':1305}
def load(n): return np.asarray(Image.open(P+n+'.png').convert('RGBA')).astype(np.float32)
def blue(a):
    r,g,b,al=a[...,0],a[...,1],a[...,2],a[...,3]
    lum=.3*r+.59*g+.11*b
    return (b-r>14)&(b>150)&(lum>120)&(al>250)
def opening(n,a=None):
    a=load(n) if a is None else a
    m=ndi.binary_opening(blue(a),iterations=2)
    lab,k=ndi.label(m); sizes=ndi.sum(m,lab,range(1,k+1))
    keep=np.isin(lab,1+np.where(sizes>800)[0]); m=keep
    H,W=m.shape; L=np.full(H,np.nan);R=np.full(H,np.nan)
    for y in range(H):
        xs=np.where(m[y])[0]
        if len(xs): L[y]=xs.min();R[y]=xs.max()
    rows=np.where(~np.isnan(L))[0]; y0=rows.min(); y1=BOTTOM[n]
    body=rows[rows>y0+250]
    Ls=np.nanpercentile(L[body],3); Rs=np.nanpercentile(R[body],97)
    WIN=30
    def win(y): return 4 if y<y0+160 else WIN
    LL=np.zeros(H);RR=np.zeros(H)
    for y in range(y0,y1+1):
        lo,hi=max(0,y-win(y)),y+win(y)
        wl=np.nanmin(L[lo:hi]) if np.any(~np.isnan(L[lo:hi])) else Ls
        wr=np.nanmax(R[lo:hi]) if np.any(~np.isnan(R[lo:hi])) else Rs
        LL[y]=max(wl,Ls) if y>y0+120 else wl
        RR[y]=min(wr,Rs) if y>y0+120 else wr
        if y>y0+250: LL[y]=Ls;RR[y]=Rs
    full=np.zeros((H,W),bool)
    for y in range(y0,y1+1):
        if RR[y]>LL[y]: full[y,int(LL[y]):int(RR[y])+1]=True
    full=ndi.binary_closing(full,iterations=4)
    return full,(int(Ls),int(Rs),int(y0),int(y1))
PLAN={'verbal':'convergent','numerical':'divergent','spatial':'memory','personality':'abstract'}
def interior(n):
    a=load(n); m,(L,R,y0,y1)=opening(n,a)
    y1-=55
    crop=a[y0:y1+1,L:R+1,:3].copy(); mm=m[y0:y1+1,L:R+1]
    idx=ndi.distance_transform_edt(~mm,return_distances=False,return_indices=True)
    crop=crop[idx[0],idx[1]]
    return crop
def compose(src,frame,out):
    t=load(frame); tm,(L,R,y0,y1)=opening(frame,t)
    tw,th=R-L+1,y1-y0+1
    c=interior(src); sh,sw=c.shape[:2]
    s=max(tw/sw,th/sh)
    im=Image.fromarray(c.astype(np.uint8)).resize((round(sw*s),round(sh*s)),Image.LANCZOS)
    c2=np.asarray(im).astype(np.float32); H2,W2=c2.shape[:2]
    ox=(W2-tw)//2; oy=(H2-th)//2
    patch=c2[oy:oy+th,ox:ox+tw]
    canvas=t.copy()
    if frame=='divergent':
        box=(slice(430,780),slice(592,670))
        sub=canvas[box]; lum=.3*sub[...,0]+.59*sub[...,1]+.11*sub[...,2]
        bad=ndi.binary_dilation(lum>150,iterations=4)
        idx=ndi.distance_transform_edt(bad,return_distances=False,return_indices=True)
        fill=sub[idx[0],idx[1]]
        sub[...,:3]=np.where(bad[...,None],ndi.gaussian_filter(fill[...,:3],(2,2,0)),sub[...,:3])
        canvas[box]=sub
    # soft mask: shrink a little, feather
    m=ndi.binary_erosion(tm,iterations=2).astype(np.float32)
    m=ndi.gaussian_filter(m,1.4)
    region=np.zeros_like(t[...,:3]); region[y0:y1+1,L:R+1]=patch
    # inner occlusion near the frame/leaf so the sky sits inside the jamb
    dist=ndi.distance_transform_edt(tm)
    occ=1-0.22*np.clip(1-dist/18,0,1)
    region*=occ[...,None]
    canvas[...,:3]=canvas[...,:3]*(1-m[...,None])+region*m[...,None]
    Image.fromarray(np.clip(canvas,0,255).astype(np.uint8),'RGBA').save(out)
def normalize(rgba):
    a=rgba.copy(); al=a[...,3].astype(np.float32)
    a[...,3]=(np.clip((al-24)/(250-24),0,1)*255).astype(np.uint8)
    ys,xs=np.where(a[...,3]>8); crop=a[ys.min():ys.max()+1,xs.min():xs.max()+1]
    out=np.zeros((1536,1024,4),np.uint8); h,w=crop.shape[:2]; bottom=1532; left=(1024-w)//2
    out[bottom-h+1:bottom+1,left:left+w]=crop; return out
if __name__=='__main__':
    import tempfile, os
    tmp=tempfile.mkdtemp()
    for s,f in PLAN.items(): compose(s,f,os.path.join(tmp,s+'.png'))
    for n in ['abstract','verbal','numerical','spatial','memory','divergent','convergent','personality']:
        src=os.path.join(tmp,n+'.png') if n in PLAN else P+n+'.png'
        Image.fromarray(normalize(np.asarray(Image.open(src).convert('RGBA'))),'RGBA').save(OUT/(n+'.png'),optimize=True)
        print('ok',n)
