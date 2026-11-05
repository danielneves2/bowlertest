# BOWLER TEST

Intro local navegável em pt-BR e inglês: cenário branco, névoa, música, personagem e portas que aparecem somente ao recuar. Salas são prévias, sem avaliações ou resultados.

## Rodar

Requer Node.js (verificado com Node 24), sem instalação de pacotes. Na pasta do projeto, execute `npm run dev` e abra http://127.0.0.1:4173.

- A cena começa direto. O primeiro gesto de teclado/toque inicia a música.
- WASD ou setas para mover; S / seta para baixo para recuar.
- Celular: joystick ou arraste no cenário.
- Recue até revelar todas as portas. Depois, aproxime-se de uma porta e pressione Enter (ou E/Espaço), ou simplesmente caminhe para dentro dela.
- Clique ou toque numa porta revelada para o personagem caminhar até ela sozinho.
- Salas visitadas ficam marcadas e contadas no topo.
- Controles de idioma e som na interface. Movimento reduzido acompanha a preferência do sistema.

## Organização

`public/assets`: logo e poses paradas. `assets/staging`: caminhadas candidatas. `assets/sources`: originais preservados. `assets/archive`: históricos, fora da aplicação. `src`: intro. `server/local.mjs`: servidor local. `data`: contratos. `tools`: preparação/verificação. `docs`: decisões e especificações.

Leia `docs/engineering/LOCAL-PROTOTYPE.md`, `docs/DECISIONS.md` e `AGENTS.md`. Caminhadas continuam candidatas para revisão; não foram promovidas. O áudio é servido por rota explícita de prévia local; confirmar licença antes de publicação.

## Verificar

`npm test` verifica descoberta, deslocamento, desafios diários, histórico, comparação pessoal, arquivo e armazenamento (29 testes). `python tools/validate_assets.py` verifica os assets. Para reconstruir derivados: `python tools/prepare_assets.py` (requer Pillow). Para refazer os portais frontais a partir dos originais: `python tools/frontalize_portals.py` (Pillow, numpy, scipy).


## Desafios diários

Cada porta abre o desafio do dia (o mesmo para todos, troca à meia-noite de Brasília). Especificação em `docs/design/DAILY-CHALLENGES.md`; código em `src/rooms/`. As salas verbal e divergente usam o espaço de palavras em `public/data/words/`, gerado por `python tools/build_word_space.py` (requer spaCy 3.8, spacy-lookups-data e os pacotes `pt_core_news_lg`/`en_core_web_lg`; só é preciso rodar de novo para mudar as listas em `tools/word_lists.py`).

O botão Diário abre o retrato do dia, a janela de sete dias, a coleção e o arquivo. Complete as oito salas da data e idioma para revelar o espelho final. Conclusões deixam objetos no salão; progresso e respostas são locais e separados por idioma. O arquivo abre a partir do segundo dia, sem alterar a sequência de dias realmente jogados. Os sons atuais são síntese original opt-in; o MP3 antigo não é reproduzido. A meta de 60 fps ainda precisa de validação no aparelho-alvo; há buffers de desenho e resolução adaptativa do Canvas.
