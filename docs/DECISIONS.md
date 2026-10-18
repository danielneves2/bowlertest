# Decisões vigentes

Registro consolidado em 16/10/2026, com base na conversa. Não representa validação científica.

| Tema | Decisão / estado |
| --- | --- |
| Produto | BOWLER TEST. O briefing inicial usava BowlerTest; grafia da logo corrigida pelo usuário. |
| Idiomas | pt-BR e inglês, com seletor e idioma de avaliação registrado. |
| Personagem | Referência em `assets/sources/character/reference/bowler-approved.png`. |
| Visual | Preto, branco e verde; pernas curtas, chapéu grande, rosto oculto. |
| Parado | Mãos nos bolsos de frente e de costas. |
| Caminhada | Frente/costas/esquerda/direita; primeiras folhas criadas, sem aprovação de loop final. |
| Logo | BOWLER preto alto; TEST verde em perspectiva de chão como sombra impossível; luz/sombra discretas; metade inferior de TEST translúcida. |
| Arquivo vigente | `public/assets/brand/bowler-test-logo.png`, derivado da v10, última revisão solicitada. Confirmar aprovação final antes de congelar identidade. |
| Subtítulo | “the closer you look, the less you see”, previsto no início, ainda fora do arquivo da logo. Não foi feita pesquisa de marca/frase. |
| Imagens | Geradas com ferramenta integrada. Higgsfield foi abandonado pelo usuário; não depender de seus resultados. |
| Código | Implementação local autorizada posteriormente pelo usuário. Intro navegável disponível; testes cognitivos ainda não implementados. |
| Motor | Canvas 2D para personagem/atmosfera e HTML semântico para interface e portas. Sem dependências de runtime externas. |
| Ciência | Portas descritas no briefing; ainda não pesquisadas, redigidas ou validadas uma a uma. |

Não utilizar as versões com monóculo, sorriso, camisa verde, detalhes vermelhos ou terno branco como referência atual.

## Abertura detalhada pelo usuário

Cenário todo branco, névoa/fumaça ambiente sutil para vida e dimensão, personagem no centro inicial com mãos nos bolsos, logo acima e a música já fornecida tocando na intro. Andar para a frente não produz descoberta; as portas só começam a aparecer quando o jogador recua. Especificação em `docs/design/INTRO.md`. Implementação local autorizada em pedido posterior; ver engineering/LOCAL-PROTOTYPE.md.


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


## Ajuste de apoio no piso e nomes — 16/10/2026

Portais ampliados para altura de referência 420 px (limitada pela viewport), com câmera de resposta mais rápida e sem pulsação das molduras. Entradas das extremidades inclinadas 54 graus para dentro; intermediárias em 22/9 graus. Projeção difusa em perspectiva no piso à frente da base, baixa saturação/opacidade, sem espelho vertical. Sombra de contato alinhada à soleira e pivô da imagem a 94% de altura.

Todos os nomes divididos explicitamente em duas linhas, em pt-BR e inglês (ex.: Raciocínio / abstrato). Sequência esquerda alterada para [0,1,4,6] para alternar poses diferentes; sprites originais preservados. Continuam candidatos artísticos.

Verificação no Chromium: capturas da cena com oito portais revisadas; desbloqueio após recuo; quatro quadros distintos da caminhada esquerda observados pelo drawImage; oito rótulos com duas linhas; nenhum erro de JavaScript.

Orientação atual: todas as oito portas de frente, sem rotação lateral adicional (0 graus), conforme referência da porta de raciocínio espacial enviada pelo usuário. Distribuição em profundidade preservada. Substitui as inclinações anteriores.


## Portas frontais, apoiadas no chão e maiores — 16/10/2026 (vigente)

Prevalece sobre os ajustes anteriores de orientação, sombra e tamanho dos portais.

- Verbal, numérico, espacial e personalidade estavam gerados em ângulo (ou com folha abrindo na direção errada). O céu e o motivo de cada uma foram transplantados para molduras frontais já existentes (convergente, divergente, memória e abstrato), formando pares espelhados no salão. Originais preservados em `assets/sources/portals/`; processo reproduzível em `tools/frontalize_portals.py`.
- Todos os PNGs normalizados: a base de mármore encosta no limite inferior da imagem. A causa da impressão de "flutuar" era a margem transparente abaixo da base somada à sombra deslocada em CSS.
- Portais e personagem agora são desenhados no mesmo Canvas, ordenados por profundidade. Sombra de contato dupla (oclusão estreita + poça difusa) segue a inclinação da base. Removidos reflexo e sombra em CSS.
- Escala: portas com cerca de 2,6× a altura do Bowler na mesma profundidade. Personagem levemente menor; horizonte rebaixado para caber as portas internas.
- Cada porta gira em perspectiva para o centro: ±22° nas pontas, ±15°, ±9° e ±4° nas internas. Portas afastadas do centro (±0,56 a ±1,34) para liberar a logo.
- Porta à frente do personagem fica translúcida enquanto o cobre.
