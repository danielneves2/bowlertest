from pathlib import Path
import json
from PIL import Image, ImageDraw
ROOT = Path(__file__).resolve().parents[1]
def write(name, text):
    p=ROOT/name
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(text.strip()+'\n',encoding='utf-8')
def save(im,name):
    p=ROOT/name
    p.parent.mkdir(parents=True,exist_ok=True)
    im.save(p)
    return p
walk_names=dict.fromkeys(['front','back','left','right'])
def clean_islands(im):
    # Remove only tiny disconnected fragments; never recolor silhouette pixels.
    width,height=im.size
    mask=bytearray(im.getchannel('A').point(lambda a:255 if a>=32 else 0).tobytes())
    components=[]
    for pos in range(width*height):
        if not mask[pos]: continue
        mask[pos]=0; stack=[pos]; pixels=[]
        while stack:
            p=stack.pop(); pixels.append(p)
            x=p%width; y=p//width
            for q in ((p-1 if x else -1),(p+1 if x+1<width else -1),(p-width if y else -1),(p+width if y+1<height else -1)):
                if q>=0 and mask[q]: mask[q]=0; stack.append(q)
        components.append(pixels)
    if not components: return im
    threshold=max(map(len,components))*0.005
    alpha=im.getchannel('A')
    for pixels in components:
        if len(pixels)<threshold:
            for p in pixels: alpha.putpixel((p%width,p//width),0)
    result=im.copy(); result.putalpha(alpha)
    return result

def box(im):
    # Ignore very faint edge haze for framing, without recoloring the image.
    return im.getchannel('A').point(lambda a: 255 if a >= 32 else 0).getbbox()
def frame(im, scale):
    im = clean_islands(im)
    b = box(im)
    crop = im.crop(b)
    w, h = max(1, round(crop.width*scale)), max(1, round(crop.height*scale))
    crop = crop.resize((w,h), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (256,320))
    canvas.alpha_composite(crop, (128-w//2,304-h))
    return canvas

raw = {}
for d in walk_names:
    im = Image.open(ROOT / f'assets/sources/character/walk/walk-{d}-original.png').convert('RGBA')
    raw[d] = [im.crop((c*im.width//4,r*im.height//2,(c+1)*im.width//4,(r+1)*im.height//2)) for r in range(2) for c in range(4)]
raw = {d:[clean_islands(im) for im in fs] for d,fs in raw.items()}
max_h = max(box(im)[3]-box(im)[1] for fs in raw.values() for im in fs)
max_w = max(box(im)[2]-box(im)[0] for fs in raw.values() for im in fs)
scale = min(280/max_h, 232/max_w)
prepared = {}
for d, fs in raw.items():
    fs = [frame(im,scale) for im in fs]
    prepared[d] = fs
    sheet = Image.new('RGBA',(2048,320))
    for i, im in enumerate(fs):
        sheet.alpha_composite(im,(i*256,0))
        save(im,f'assets/staging/character/walk/{d}/frame-{i:02d}.png')
    save(sheet, f'assets/staging/character/walk/walk-{d}.png')
    previews=[]
    for im in fs:
        bg=Image.new('RGBA',im.size,'#f4f1e9'); bg.alpha_composite(im)
        previews.append(bg.convert('RGB'))
    previews[0].save(ROOT/f'assets/previews/walk-{d}-candidate.gif',save_all=True,append_images=previews[1:],duration=125,loop=0)

im = Image.open(ROOT / 'assets/sources/character/idle/front-back-original.png').convert('RGBA')
for i,d in enumerate(['front','back']):
    crop = im.crop((i*im.width//2,0,(i+1)*im.width//2,im.height))
    b=box(crop); s=min(280/(b[3]-b[1]),232/(b[2]-b[0]))
    save(frame(crop,s),f'public/assets/characters/bowler/idle/{d}.png')

im = Image.open(ROOT / 'assets/sources/brand/bowler-test-approved.png').convert('RGBA')
im = im.crop(im.getchannel('A').getbbox())
save(im, 'public/assets/brand/bowler-test-logo.png')
for color, name in [('#f4f1e9','light'),('#ffffff','white')]:
    bg=Image.new('RGBA',(im.width+80,im.height+80),color); bg.alpha_composite(im,(40,40))
    save(bg.convert('RGB'),f'assets/previews/logo-on-{name}.jpg')

# Contact sheet for inspection; previews are never runtime assets.
board=Image.new('RGB',(1024,4*360),'#f4f1e9'); draw=ImageDraw.Draw(board)
for row,d in enumerate(['front','back','left','right']):
    draw.text((15,row*360+8),f'{d} / candidate / frames 0, 2, 4, 6',fill='black')
    for col,idx in enumerate([0,2,4,6]):
        board.paste(prepared[d][idx],(col*256,row*360+30),prepared[d][idx])
save(board,'assets/previews/walk-contact-sheet.jpg')

animations = {'schemaVersion':1,'status':'candidate-not-motion-approved','frameWidth':256,'frameHeight':320,'origin':{'x':0.5,'y':0.95},'footAnchorPixels':{'x':128,'y':304},'frameRate':8,'frameRateStatus':'suggested-not-validated','frameOrder':list(range(8)),'repeat':-1,'directions':{d:{'sheet':f'assets/staging/character/walk/walk-{d}.png','frames':8,'layout':{'columns':8,'rows':1},'sourceGrid':{'columns':4,'rows':2,'order':'row-major'},'status':'candidate'} for d in raw},'idle':{d:{'file':f'public/assets/characters/bowler/idle/{d}.png','hands':'in-blazer-side-pockets','frames':1} for d in ['front','back']},'transition':'walk: hands out; idle: hands in pockets; transition frames not yet created','knownLimitations':['AI-generated poses have changes in silhouette and perspective.','Frame order preserves source order; a seamless anatomically correct loop has NOT been established.','Do not mirror left/right blindly: pocket and hat are asymmetric.','Idle side views and transitions are not supplied.']}
write('data/animations/bowler.json',json.dumps(animations,ensure_ascii=False,indent=2))

from asset_catalog import rebuild
rebuild()
print('Derivados reconstruídos; originais preservados.')
