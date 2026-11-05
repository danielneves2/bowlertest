"""Build the in-browser semantic word space for the verbal ("Perto Demais") and divergent
("Dez Palavras Distantes") rooms.

Source vectors (CC0): spaCy pt_core_news_lg 3.8 and en_core_web_lg 3.8
(Explosion fastText/OSCAR vectors). Install once:
    pip install spacy==3.8.* spacy-lookups-data numpy
    pip install <wheel of pt_core_news_lg-3.8.0> <wheel of en_core_web_lg-3.8.0>
Run:  python tools/build_word_space.py
Writes public/data/words/<lang>/{vocab.json,infl.json,vectors.bin,meta.json,secrets.json}.
"""
from pathlib import Path
import gzip, json, os, re, sys
import numpy as np
import spacy, spacy_lookups_data

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/data/words'
sys.path.insert(0, str(ROOT / 'tools'))
from word_lists import SECRETS, ANCHORS, BLOCK  # curated, hand-written

CONFIG = {
    'pt-BR': dict(model='pt_core_news_lg', lookup='pt_lemma_lookup.json.gz', pattern=r'^[a-záàâãéêíóôõúüç]+$',
                  noun_templates=['o {}', 'a {}', 'os {}']),
    'en': dict(model='en_core_web_lg', lookup='en_lemma_lookup.json.gz', pattern=r'^[a-z]+$',
               noun_templates=['the {}', 'a {}']),
}
SCAN_ROWS = 220_000   # most frequent vector rows inspected
VOCAB_SIZE = 32_000   # base words kept for ranking
DIM = 128             # PCA dimensions shipped to the browser

PT_PLURALS = [('ões', 'ão'), ('ães', 'ão'), ('ãos', 'ão'), ('ais', 'al'), ('éis', 'el'), ('eis', 'el'), ('óis', 'ol'),
              ('uis', 'ul'), ('ns', 'm'), ('res', 'r'), ('zes', 'z'), ('ses', 's'), ('les', 'l'), ('s', '')]
PT_VERB_ENDINGS = ('ou', 'eu', 'iu', 'ando', 'endo', 'indo', 'ado', 'ados', 'ada', 'adas', 'ido', 'idos', 'ida', 'idas',
                   'ava', 'avam', 'ia', 'iam', 'amos', 'emos', 'imos', 'aram', 'eram', 'iram', 'asse', 'esse', 'isse',
                   'ará', 'erá', 'irá', 'aria', 'eria', 'iria', 'aram', 'am', 'em', 'ei', 'aste', 'este', 'iste')


def lookup_table(name):
    d = Path(spacy_lookups_data.__file__).parent / 'data'
    return json.load(gzip.open(d / name))


def build(lang):
    cfg = CONFIG[lang]
    nlp = spacy.load(cfg['model'])
    stop = {w.lower() for w in nlp.Defaults.stop_words}
    lemmas = lookup_table(cfg['lookup'])
    vec = nlp.vocab.vectors
    pat = re.compile(cfg['pattern'])
    # Candidate words in frequency order. The pt vector table is already frequency-sorted; the en
    # table is not, so English uses the unigram probabilities shipped in spacy-lookups-data.
    if lang == 'en':
        prob = lookup_table('en_lexeme_prob.json.gz')
        ordered = sorted((w for w in prob if pat.match(w)), key=lambda w: -prob[w])
    else:
        ordered = [nlp.vocab.strings[k] for k, r in sorted(vec.key2row.items(), key=lambda kv: kv[1]) if r < SCAN_ROWS]
    raw = []
    seen = set()
    for w in ordered:
        if w in seen or not pat.match(w) or not (3 <= len(w) <= 15) or w in BLOCK or not nlp.vocab[w].has_vector:
            continue
        seen.add(w); raw.append(w)
        if len(raw) >= 90_000:
            break
    # Out-of-context noun check, used to keep nouns that a lemma table would wrongly turn into verbs
    # ("casa" -> "casar") and for the divergent room's "nouns only" rule.
    nouns = set()
    for tpl in cfg['noun_templates']:
        for w, doc in zip(raw, nlp.pipe((tpl.format(w) for w in raw), batch_size=4000)):
            if any(t.text == w and t.pos_ in ('NOUN', 'PROPN') for t in doc):
                nouns.add(w)
    freq = [w for w in raw if not (w in stop and (len(w) <= 4 or w not in nouns))]
    rank = {w: i for i, w in enumerate(freq)}

    def base_of(w):
        if lang == 'pt-BR':
            for suf, rep in PT_PLURALS:
                if w.endswith(suf) and len(w) - len(suf) >= 2:
                    cand = w[: len(w) - len(suf)] + rep
                    if cand != w and cand in rank and rank[cand] < rank[w] * 3 + 2000:
                        return cand
            lem = lemmas.get(w)
            if lem and lem != w and lem.endswith('r') and w.endswith(PT_VERB_ENDINGS) and lem in rank and w not in nouns:
                return lem
            return None
        lem = lemmas.get(w)
        if not lem or lem == w or lem not in rank:
            return None
        plural = w.endswith('s') and lem in (w[:-1], w[:-2], w[:-3] + 'y')
        return lem if plural or w not in nouns else None

    vocab, infl = [], {}
    for w in freq:
        b = base_of(w)
        if b:
            infl[w] = b
        elif len(vocab) < VOCAB_SIZE:
            vocab.append(w)
    vset = set(vocab)
    infl = {w: b if b in vset else infl.get(b, b) for w, b in infl.items()}
    infl = {w: b for w, b in infl.items() if b in vset}

    X = np.stack([nlp.vocab[w].vector for w in vocab]).astype(np.float64)
    X /= np.linalg.norm(X, axis=1, keepdims=True) + 1e-9
    # Uncentred projection keeps raw cosine geometry (what DAT-style distances expect).
    U, S, Vt = np.linalg.svd(X, full_matrices=False)
    P = X @ Vt[:DIM].T
    P /= np.linalg.norm(P, axis=1, keepdims=True) + 1e-9
    Q = np.clip(np.round(P * 127), -127, 127).astype(np.int8)

    secrets = [w for w in SECRETS[lang] if w in vset]
    anchors = [w for w in ANCHORS[lang] if w in vset]
    missing = sorted(set(SECRETS[lang]) - vset) + sorted(set(ANCHORS[lang]) - vset)

    # Fidelity check: overlap of the 300 nearest neighbours, full vectors vs shipped int8 PCA.
    qn = Q.astype(np.float32)
    overlaps = []
    for w in secrets[:40]:
        i = vocab.index(w)
        full = np.argsort(-(X @ X[i]))[:300]
        approx = np.argsort(-(qn @ qn[i]))[:300]
        overlaps.append(len(set(full) & set(approx)) / 300)

    out = OUT / lang
    out.mkdir(parents=True, exist_ok=True)
    (out / 'vectors.bin').write_bytes(Q.tobytes())
    (out / 'vocab.json').write_text(json.dumps(vocab, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    (out / 'infl.json').write_text(json.dumps(infl, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    (out / 'secrets.json').write_text(json.dumps({'secrets': secrets, 'anchors': anchors}, ensure_ascii=False, indent=0), encoding='utf-8')
    noun_mask = ''.join('1' if w in nouns else '0' for w in vocab)
    meta = {'lang': lang, 'count': len(vocab), 'dim': DIM, 'dtype': 'int8', 'scale': 127, 'nouns': noun_mask,
            'source': f"{cfg['model']} {nlp.meta.get('version')} vectors: {nlp.meta.get('vectors', {}).get('name')}",
            'vectorLicense': 'CC0 (Explosion vectors, per spaCy package metadata)',
            'neighbourOverlap300': round(float(np.mean(overlaps)), 3) if overlaps else None}
    (out / 'meta.json').write_text(json.dumps(meta, ensure_ascii=False), encoding='utf-8')
    print(lang, 'vocab', len(vocab), 'infl', len(infl), 'nouns', len(nouns), 'secrets', len(secrets),
          'anchors', len(anchors), 'overlap300', meta['neighbourOverlap300'], 'missing', missing)


if __name__ == '__main__':
    for lang in (sys.argv[1:] or CONFIG):
        build(lang)
