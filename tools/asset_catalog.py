from pathlib import Path
import json, hashlib
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
def rebuild():
    records=[]
    for p in sorted(ROOT.rglob('*')):
        if not p.is_file() or p.suffix.lower() not in ['.png','.jpg','.gif','.mp3']: continue
        rel=p.relative_to(ROOT).as_posix()
        status='historical-do-not-integrate'
        if rel.startswith('public/assets/brand/'): status='latest-design-awaiting-final-signoff'
        elif rel.startswith('public/assets/environments/portals/'): status='original-generated-portal-integrated'
        elif rel.startswith('public/assets/characters/'): status='prepared-static-pose'
        elif rel.startswith('assets/staging/'): status='candidate-not-motion-approved'
        elif rel.startswith('assets/previews/'): status='inspection-only'
        elif rel.startswith('assets/sources/'): status='source-do-not-edit'
        if p.suffix.lower()=='.mp3': status='license-unconfirmed-do-not-publish'
        rec={'path':rel,'status':status,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
        if p.suffix.lower()!='.mp3':
            with Image.open(p) as im:
                rec.update(width=im.width,height=im.height,mode=im.mode)
                if im.mode=='RGBA':rec['alphaRange']=list(im.getchannel('A').getextrema())
        records.append(rec)
    data={'schemaVersion':1,'product':'BOWLER TEST','created':'2026-10-16','brand':'public/assets/brand/bowler-test-logo.png','characterReference':'assets/sources/character/reference/bowler-approved.png','animationMetadata':'data/animations/bowler.json','assets':records}
    (ROOT/'assets/manifest.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
if __name__=='__main__':rebuild()
