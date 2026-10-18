from pathlib import Path
import hashlib, json, re, sys
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
errors=[]; checks=0
def check(ok,msg):
    global checks
    checks+=1
    if not ok:errors.append(msg)
manifest=json.loads((ROOT/'assets/manifest.json').read_text(encoding='utf-8'))
for a in manifest['assets']:
    p=ROOT/a['path'];check(p.is_file(),'Missing '+a['path'])
    if p.is_file():check(hashlib.sha256(p.read_bytes()).hexdigest()==a['sha256'],'Hash '+a['path'])
meta=json.loads((ROOT/'data/animations/bowler.json').read_text(encoding='utf-8'))
for d,a in meta['directions'].items():
    with Image.open(ROOT/a['sheet']) as sheet:
        check(sheet.size==(2048,320),'Strip dimensions '+d)
        check(sheet.mode=='RGBA','RGBA '+d)
        for i in range(8):
            p=ROOT/f'assets/staging/character/walk/{d}/frame-{i:02d}.png'
            with Image.open(p) as im:
                check(im.size==(256,320),'Frame dimensions '+str(p))
                check(im.tobytes()==sheet.crop((i*256,0,(i+1)*256,320)).tobytes(),'Strip/frame mismatch '+str(p))
                b=im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
                check(b is not None and b[0]>0 and b[1]>0 and b[2]<256 and b[3]<320,'Clipped/empty '+str(p))
                check(im.getchannel('A').getextrema()[0]==0,'No transparency '+str(p))
    with Image.open(ROOT/f'assets/previews/walk-{d}-candidate.gif') as gif:
        check(gif.n_frames==8,'GIF frame count '+d)
for d,a in meta['idle'].items():
    with Image.open(ROOT/a['file']) as im:check(im.size==(256,320) and im.mode=='RGBA','Idle '+d)
with Image.open(ROOT/manifest['brand']) as im:
    check(im.mode=='RGBA','Logo RGBA')
    alpha=im.getchannel('A');check(alpha.getextrema()==(0,255),'Logo alpha range')
    check(any(0<a<255 for a in alpha.tobytes()),'Logo lost translucency')
source=ROOT/'The Case of the Missing Note.mp3';copy=ROOT/'assets/sources/audio/the-case-of-the-missing-note.mp3'
if source.exists():check(source.read_bytes()==copy.read_bytes(),'Audio original changed')
check(not any((ROOT/'public').rglob('*.mp3')),'Unlicensed audio in public')
for doc in [ROOT/'README.md',ROOT/'AGENTS.md',*list((ROOT/'docs').rglob('*.md'))]:
    text=doc.read_text(encoding='utf-8')
    for match in re.finditer(r'`([^`]+)`',text):
        value=match.group(1)
        if value.startswith(('docs/','assets/','public/','data/')) and not any(c in value for c in '{}* ') :
            check((ROOT/value).exists(),'Document path '+value+' in '+str(doc))
report={'checks':checks,'errors':errors,'assetCount':len(manifest['assets']),'status':'passed' if not errors else 'failed','scope':'File integrity and preparation only; not scientific or motion validation.'}
(ROOT/'docs/engineering/asset-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
sys.exit(bool(errors))
