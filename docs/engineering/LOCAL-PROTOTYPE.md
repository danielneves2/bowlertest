# Protótipo local — 16/10/2026

O pedido posterior do usuário autorizou implementar e fornecer link local, substituindo a restrição anterior de apenas estruturar, dentro do escopo da intro.

## Implementado

Canvas 2D para atmosfera e personagem em camadas distintas; portas HTML atrás do boneco. Fundo branco, névoa procedural, sombra de contato, logo e subtítulo. Idle com mãos nos bolsos; caminhada nas quatro direções a 8 fps com faixas candidatas existentes. Idle lateral ausente: retorna à última orientação frontal/traseira parada.

Movimento espacial independente da orientação. Avançar/laterais não revelam portas. Recuo líquido além da posição inicial revela gradualmente e permanece na sessão. Teclado, joystick/arraste, pt-BR/en, lista acessível, diálogo nativo com Escape/foco contido, movimento reduzido e som.

Música após gesto de entrada, volume 24%, loop nativo; sem crossfade ou sincronização por batida. Oito salas com descrição de preparação e retrato bloqueado no modo em lista. Sem pontuações, contas, coleta ou conclusão artificial.

## Arquivos

- `public/index.html`: estrutura semântica.
- `src/style.css`: apresentação responsiva.
- `src/main.js`: animação, controles, interface e textos bilíngues.
- `src/game/scenes/hub.js`: deslocamento e regra pura de descoberta.
- `src/game/scenes/hub.test.js`: quatro testes de descoberta/limites.
- `server/local.mjs`: servidor Node em 127.0.0.1:4173. Serve index, public/assets, src e cinco rotas explícitas de prévia (quatro faixas e MP3), com Range para áudio. Não expõe o projeto inteiro nem lista diretórios.

## Verificação

Node: 4/4 testes passaram. Chromium: sem erros JavaScript, avançar sem descobrir, recuar habilita oito portas, diálogo, idioma, lista e reprodução de áudio. Capturas revisadas em 1440×900 e 390×844; joystick móvel revela portas. Ajustadas camadas para portas atrás do boneco.

## Limites

Protótipo de experiência. Caminhadas têm variações de pose/escala e continuam candidatas; precisam revisão artística. Originais preservados. Licença do áudio pendente antes de publicação. Instrumentos, consentimento para pesquisa, normas, backend de avaliação, progresso persistente e retrato real são futuros. Nenhum serviço externo recebe dados. Preferências e descoberta duram na sessão; recarregar reinicia. Servidor deve ficar em execução para o link funcionar.


## Revisão da sala contínua — pedido visual posterior

Esta revisão prevalece sobre a descrição inicial com botão de entrada. A cena começa imediatamente com o personagem parado abaixo e logo acima, com corredor central protegido contra sobreposição. Removidos chamada, descrição, botão e legendas de capítulo/rodapé. Mantido B com ponto verde. Subtítulo localizado em pt-BR/en.

Portas ao fundo na linha da logo, quatro de cada lado, com batente, espessura, painel e maçaneta. Recuo revela; acesso ao fundo fica bloqueado até a revelação visual atingir 100%. Depois, andar para frente até a soleira abre a prévia da sala. Clique não teletransporta; lista continua alternativa acessível. Sem avaliações reais.

Velocidade reduzida de .22 para .085 unidades/s. Animação a 5 fps; esquerda usa a sequência candidata [0,1,5,1] para evitar a troca brusca de braços nos outros quadros, preservando os arquivos originais. Ainda não é um ciclo artístico final. Névoa em camadas mais visível, câmera amortecida, paralaxe e escala por profundidade. Música começa no primeiro gesto de teclado/toque, sem tela de entrada (restrição de autoplay do navegador).

Validação de lógica: cinco testes de bloqueio, descoberta, entrada por soleira e limites. Capturas desktop/mobile e troca de idioma conferidas no Chromium.


## Portais ilustrados e exploração livre — revisão vigente

Esta revisão substitui a disposição em linha e o bloqueio de deslocamento das versões anteriores. Movimento livre em todas as direções, sem limites artificiais da tela; câmera acompanha o personagem. Somente entrada nos portais depende da descoberta completa. Logo integrada ao espaço da sala, acompanhando a câmera e desaparecendo por proximidade para não cobrir o personagem.

Oito imagens originais de portais, em public/assets/environments/portals, geradas com image_gen integrado. Preto, verde, marfim, metal e céu interno; motivos distintos por habilidade. PNGs RGBA preservados. Prompts e origem em assets/portals.provenance.json. Nomes acima. Quatro de cada lado, escalonados em profundidade: os externos mais à frente, maiores e inclinados; os internos recuados. Reflexo comprimido com transparência gradual e sombra de contato desenhados separadamente no piso.

Frase removida da logo e transferida para a instrução inferior: “Quanto mais de perto você olha, menos você vê.” / “The closer you look, the less you see.” Após descoberta completa: “Agora caminhe até seu destino.” / “Now walk toward your destination.” Removidos botões de lista e reduzir movimento, por solicitação. Preferência de movimento reduzido do sistema continua respeitada.

Névoa animada independente de movimento do personagem, em camadas com paralaxe. Caminhada sincronizada com distância, com seleção de quadros para reduzir mudanças bruscas de braços: esquerda [0,1,5,1], direita [0,1,4,1], frente [0,1,2,1], costas [0,1,3,5]. Originais não alterados; limitações das poses geradas continuam, não é animação esquelética nem ciclo artístico definitivo.

Verificação: cinco testes de lógica passaram; 371 verificações de integridade de 81 mídias passaram. Sem instrumentos ou resultados cognitivos implementados.

Verificação final no Chromium: névoa muda mesmo em idle; logo se move com a câmera; entrada por caminhada abre a sala; sem erros de JavaScript. Controles removidos ausentes. Captura mobile 390×844 revisada. Texto inferior e reflexos incluídos.


## Ajuste de apoio no piso e nomes — 16/10/2026

Portais ampliados para altura de referência 420 px (limitada pela viewport), com câmera de resposta mais rápida e sem pulsação das molduras. Entradas das extremidades inclinadas 54 graus para dentro; intermediárias em 22/9 graus. Projeção difusa em perspectiva no piso à frente da base, baixa saturação/opacidade, sem espelho vertical. Sombra de contato alinhada à soleira e pivô da imagem a 94% de altura.

Todos os nomes divididos explicitamente em duas linhas, em pt-BR e inglês (ex.: Raciocínio / abstrato). Sequência esquerda alterada para [0,1,4,6] para alternar poses diferentes; sprites originais preservados. Continuam candidatos artísticos.

Verificação no Chromium: capturas da cena com oito portais revisadas; desbloqueio após recuo; quatro quadros distintos da caminhada esquerda observados pelo drawImage; oito rótulos com duas linhas; nenhum erro de JavaScript.


## Revisão de jogabilidade — 16/10/2026

- Cena única em Canvas (`#scene`) com ordenação por profundidade de portais e personagem; botões HTML transparentes sobre cada porta mantêm teclado e leitor de tela.
- Foco por proximidade: perto da soleira, a porta ganha brilho verde no chão e aparece o aviso "Nome da sala · Enter para entrar". Enter, E ou Espaço entram; andar para dentro da soleira continua funcionando.
- Clique/toque numa porta revelada: o Bowler caminha sozinho até ela e entra. Qualquer comando manual cancela.
- Transição de entrada com clarão de céu; sala abre com a arte da porta ao lado do texto.
- Salas visitadas ficam marcadas (ponto verde no rótulo e contador no topo) e o idioma é lembrado, via localStorage com fallback silencioso. Continua sem testes, pontuação ou envio de dados.
- Rótulos encobertos por portas mais próximas somem; aviso de erro de áudio some após 5 s.
- Testes: 8 (inclui foco por proximidade, todas as portas alcançáveis e caminhada automática).


## Reexecução de frontalize_portals.py — 16/10/2026

Dependências instaladas pelo `tools/requirements.txt` (Pillow 12.3.0, numpy 2.5.3, scipy 1.18.1) e script reexecutado. Os oito PNGs gerados são idênticos pixel a pixel aos anteriores (diferença máxima 0); só a compressão do arquivo muda. O `assets/manifest.json` já estava defasado nesses oito hashes antes da reexecução; atualizados apenas `bytes`/`sha256` dessas entradas, preservando os status manuais. Validação: 388 checks, 0 erros. Testes: 8/8.


## Espaçamento, apoio real no piso, nomes como botão e caminhada coerente — 16/10/2026 (vigente)

Prevalece sobre os ajustes anteriores de posição, sombra e rótulos.

- Portas mais afastadas: x ±0,64 / ±1,04 / ±1,48 / ±1,96 e profundidades −0,68 / −0,44 / −0,20 / +0,04. Em telas de ~1500 px as duas externas ficam na borda; recuar mais ou andar para o lado as revela.
- Causa do "flutuar": a base de mármore não é nivelada na arte (o canto inferior esquerdo fica ~20 px acima da borda da imagem) e a sombra era desenhada na borda da imagem, mais larga que a base. Agora o perfil real da base (pixel opaco mais baixo por coluna) é lido do PNG ao carregar, e a sombra de contato (oclusão estreita + poça difusa, via shadowBlur) segue esse perfil e termina nos cantos. Arquivos de imagem não foram alterados.
- Contorno verde de foco removido das portas; foco por teclado indicado pelo rótulo.
- Nomes das salas abaixo da base, em cartão branco com borda, como botão; hover/foco/proximidade em verde; visitada com ponto verde no canto. O rótulo some sob portas mais próximas e fica translúcido quando o Bowler está à frente dele.
- "B." e menus (salas visitadas, idioma, som) nos cantos inferiores; instrução e teclas sobem para não colidir. No celular, o joystick sobe para liberar o canto.
- Orientação da caminhada: vista lateral só para movimento quase horizontal (|x| > 3·|y|); diagonais usam costas/frente. Ao clicar numa porta, o Bowler vai até um ponto logo à frente dela e entra reto, de costas para a câmera. Durante a caminhada automática, passar pela soleira de outra porta não a abre.
- Testes: 10/10 (inclui orientação diagonal e chegada de costas). Capturas no Chrome headless em 1537×860 e 1882×700, sem erros de JavaScript.
- Logo na mesma profundidade das duas portas centrais, centralizada entre elas: largura = 86% do vão entre as molduras internas, centro a ~31% da altura da porta acima do piso. Escala com a tela e com a câmera; continua sumindo quando o Bowler se aproxima.
- Caminhada frente/costas alternando as duas pernas. As sequências anteriores (frente [0,1,2,1], costas [0,1,3,5]) só mostravam a perna direita se mexendo. Medindo sapatos e punhos em cada quadro das faixas candidatas: frente [3,4,5,7,2,1] e costas [2,3,1,6,7,5] (perna direita sobe, apoia, passagem, perna esquerda sobe, apoia, passagem; braço oposto à perna). Como cada ciclo agora tem dois passos, a passada de frente/costas passou de 0,105 para 0,16 unidade por ciclo. Laterais inalteradas. Faixas não editadas; continuam candidatas.
- Caminhada para a direita: a faixa candidata `walk-right` nunca troca braço nem perna (quadros 0,1,3,4,5,7 repetem a mesma passada com o mesmo braço à frente; 2 e 6 são passagem). Agora a direita usa a caminhada esquerda espelhada quadro a quadro ao carregar (`src/game/mirror.js`), na ordem [0,1,4,6], preservando o pivô x=128. O lenço de bolso (peito esquerdo, visível só andando para a esquerda) é coberto com o tecido do paletó logo abaixo para não aparecer do lado errado. A iluminação fica espelhada. `walk-right.png` continua preservada e fora de uso; nenhum arquivo de imagem foi alterado.
