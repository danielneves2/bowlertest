"""Register only the newly authored collection. Never refresh hashes of existing assets."""
from pathlib import Path
from PIL import Image
import hashlib,json,shutil
ROOT=Path(__file__).resolve().parents[1]
manifest_path=ROOT/'assets/manifest.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
known={a['path']:a for a in manifest['assets']}
audio=ROOT/'assets/sources/audio/bowler-cues-v1.js'
if not audio.exists():shutil.copyfile(ROOT/'src/journey/sound.js',audio)
files=[*sorted((ROOT/'assets/sources/collection').glob('*.*')),*sorted((ROOT/'public/assets/collection').glob('*.png')),audio]
for p in files:
    rel=p.relative_to(ROOT).as_posix()
    digest=hashlib.sha256(p.read_bytes()).hexdigest()
    if rel in known:
        if known[rel]['sha256']!=digest:raise SystemExit('Existing registered asset changed: '+rel)
        continue
    status='original-source' if rel.startswith('assets/sources') else 'original-integrated-for-review'
    if '-study.svg' in rel:status='original-study-not-integrated'
    entry={'path':rel,'status':status,'bytes':p.stat().st_size,'sha256':digest,'provenance':'assets/collection.provenance.json' if p!=audio else 'assets/audio-cues.provenance.json'}
    if p.suffix=='.png':
        with Image.open(p) as im:
            entry.update(width=im.width,height=im.height,mode=im.mode,alphaRange=list(im.getchannel('A').getextrema()))
    elif p.suffix=='.svg':entry.update(width=1024,height=1024,mode='SVG')
    manifest['assets'].append(entry)
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'assets/audio-cues.provenance.json').write_text(json.dumps({'created':'2026-10-18','source':'assets/sources/audio/bowler-cues-v1.js','runtime':'src/journey/sound.js','origin':'Original procedural Web Audio synthesis authored for BOWLER TEST. Sine tones and deterministic filtered noise. No third-party recordings or samples.','license':'CC0-1.0 for these newly authored cue recipes.','brief':'Quiet brass-key click, paper rustle, passing wind and two-tone completion accent. Off until explicitly enabled.','cues':['key','paper','wind','finish'],'existingMusic':'Existing MP3 remains unlicensed, unmodified and outside public. Removed from the game playback flow.'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Registered new collection and original synthesized cues; existing hashes preserved.')
