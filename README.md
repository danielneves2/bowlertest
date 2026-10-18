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

`npm test` verifica descoberta e deslocamento. `python tools/validate_assets.py` verifica os assets. Para reconstruir derivados: `python tools/prepare_assets.py` (requer Pillow). Para refazer os portais frontais a partir dos originais: `python tools/frontalize_portals.py` (Pillow, numpy, scipy).
