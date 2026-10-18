# Arquitetura proposta, ainda não implementada

Para o primeiro protótipo com estes sprites, a recomendação é Phaser para hub 2D e HTML semântico para menus, textos e modo em lista. Uma sala com perspectiva desenhada pode produzir aparência 3D sem converter o personagem em geometria. Esta é uma recomendação para Astra avaliar, não decisão já aprovada nem dependência instalada.

Three.js seria outra opção para sala/modelos 3D reais; os PNGs atuais continuariam sendo planos orientados para câmera, com limitações. Não tratá-los como modelos 3D.

## Divisões futuras
- `src/game/scenes`: hub, entrada/saída e apresentação visual.
- `src/game/characters`: estados idle/walk e consumo do contrato de animação.
- `src/game/input`: teclado/toque, sem interferir com digitação nas tarefas.
- `src/ui`: instruções, idioma, consentimento, modo em lista e retrato.
- `src/i18n/pt-BR` e `en`: interface. Itens de avaliação separados por idioma/versão.
- `src/tests`: lógica de tarefas futuras, ainda sem itens e sem scoring implementado.
- `server`: API simples proposta; banco SQLite pode servir ao protótipo e migrar depois, escolha pendente.
- `data/schemas`: schemas futuros para sessão, consentimento, item, resposta e resultado.

No primeiro hub, progresso local pode ser suficiente. Não introduzir conta, coleta de dados ou embeddings externos por padrão. Se houver avaliação real, manter versão de item, regra de pontuação e tempo de aplicação, separar respostas de dados de identificação e evitar expor gabaritos sensíveis desnecessariamente.
Pontuação semântica deve usar modelo/versão fixados, licença conferida e comparação por idioma. Escolher execução local ou servidor após medir custo/qualidade/privacidade. Não há credenciais, banco nem serviços configurados.

Use caminhos públicos `/assets/...` para arquivos de `public/assets/`. Arquivos em staging/sources não devem ser servidos automaticamente. Não empacotar arquivos de pesquisa/áudio pendente junto do site.
