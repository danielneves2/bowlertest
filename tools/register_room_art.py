from pathlib import Path
import json,shutil,hashlib
from PIL import Image
root=Path.cwd();data=json.loads((root/'assets/room-art.provenance.json').read_text());mf=root/'assets/manifest.json';m=json.loads(mf.read_text(encoding='utf-8-sig'));base=Path(r'C:/Users/MOBILTEC/.codex/generated_images/01a145f9-420b-7bf3-9d66-e168dba5c4b3')
for a in data['assets']:
 for folder,status in [('assets/sources/room-art','original-generated-source'),('public/assets/room-art','generated-integrated-for-review')]:
  p=root/folder/(a['name']+'.png');p.parent.mkdir(parents=True,exist_ok=True)
  if not p.exists():shutil.copy2(base/a['file'],p)
  im=Image.open(p);rel=p.relative_to(root).as_posix()
  if not any(x['path']==rel for x in m['assets']):m['assets'].append(dict(path=rel,width=im.width,height=im.height,mode=im.mode,bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),status=status,provenance='assets/room-art.provenance.json'))
mf.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
