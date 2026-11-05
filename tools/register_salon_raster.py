from pathlib import Path
import json,shutil,hashlib
from PIL import Image
root=Path.cwd(); p=root/'assets/salon-raster.provenance.json'; data=json.loads(p.read_text()); manifest=root/'assets/manifest.json'; m=json.loads(manifest.read_text(encoding='utf-8-sig'))
base=Path(r'C:/Users/MOBILTEC/.codex/generated_images/01a145f9-420b-7bf3-9d66-e168dba5c4b3')
for name,file,prompt in data['assets']:
 for folder,status in [('assets/sources/salon-raster','original-generated-source'),('public/assets/salon-raster','generated-integrated-for-review')]:
  target=root/folder/(name+'.png');target.parent.mkdir(parents=True,exist_ok=True)
  if not target.exists():shutil.copy2(base/file,target)
  im=Image.open(target);path=target.relative_to(root).as_posix()
  if not any(a['path']==path for a in m['assets']):m['assets'].append(dict(path=path,width=im.width,height=im.height,mode=im.mode,bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),status=status,provenance='assets/salon-raster.provenance.json'))
manifest.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
