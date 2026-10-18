# Ferramentas de assets

Pré-requisito: Python 3 e `pip install -r tools/requirements.txt` em ambiente apropriado.

- `python tools/prepare_assets.py`: refaz derivados a partir de fontes internas, remove apenas ilhas muito pequenas desconectadas, enquadra frames/idle, exporta faixas/GIFs/logo e atualiza o catálogo. Sobrescreve derivados nos mesmos caminhos, nunca os originais. Não corrige anatomia ou redesenha a animação.
- `python tools/asset_catalog.py`: atualiza manifesto e hashes após mudanças autorizadas. Não executar para esconder erro de integridade sem investigar.
- `python tools/frontalize_portals.py`: refaz os oito portais a partir de `assets/sources/portals/` (originais intactos): transplanta céu e motivo das portas em ângulo para molduras frontais e apoia todas as bases no limite inferior da imagem. Já foi executado; só rode de novo se trocar algum original.
- `python tools/validate_assets.py`: verifica integridade, dimensões, recortes/faixas, transparência, ausência do áudio em public e referências documentais. Gera `docs/engineering/asset-validation.json`.

Nenhuma ferramenta contém o jogo ou acessa serviços externos.
