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


## Desafios diários nas oito salas — 18/10/2026 (vigente)

Cada porta abre um desafio do dia, igual para todos (semente = data de Brasília; #1 em 18/10/2026). Especificação e estudo em `docs/design/DAILY-CHALLENGES.md`. Código em `src/rooms/`.

- Salas jogáveis: A Janela (matrizes por regras), Perto Demais (estilo Contexto), A Balança (séries), O Cubo no Céu (rotação mental), Chapéus que Somem (span espacial estilo Corsi), Dez Palavras Distantes (estilo DAT + palavra-âncora), A Chave (associações remotas autorais), O Espelho (IPIP Big Five, 5 itens por dia).
- Placar só do jogo (acertos, palpites, tempo, sequência), cartão de compartilhar com emojis, progresso salvo por dia no navegador. Nada de QI, percentil ou faixa populacional; aviso fixo em cada sala.
- Espaço semântico: vetores CC0 dos pacotes spaCy `pt_core_news_lg`/`en_core_web_lg` 3.8, 32 mil formas-base por idioma, PCA 128 sem centralização, int8. Gerado por `tools/build_word_space.py` a partir de `tools/word_lists.py` (palavras secretas, âncoras e bloqueios curados). Tudo roda no navegador.
- ICAR descartado como fonte de itens: declarado para uso acadêmico exclusivo.
- Hub: contador "X/8 desafios de hoje" e ✓ no rótulo da porta concluída no dia.

## Diário, coleção e retratos pessoais — 18/10/2026 (vigente)

Esta seção prevalece sobre propostas anteriores de relatório ou comparações populacionais.

- O Diário contém Retrato, Sete dias, Coleção e Arquivo. O retrato só aparece depois das oito conclusões da data selecionada e do idioma atual. A oitava conclusão abre o retrato ao sair da sala; o botão no resultado também o abre.
- Cena original: Bowler de costas diante de um espelho de céu e oito objetos. Personalidade tem tamanho fixo e nenhuma nota de desempenho. Sem índice geral, QI, percentis, faixas populacionais ou diagnóstico.
- A escala dos demais objetos compara exclusivamente registros anteriores, do mesmo idioma e versão: acertos nas salas 1/3/4, sequência na 5, distância na 6, trios na 7, palpites de palavras resolvidas na 2. Salas 2/7 exigem igual número de dicas. Sem histórico comparável, tamanho neutro. Variação artística limitada a ±20%; não é escala psicométrica. Não comparar tempo, pois sair e retomar distorce tempo de parede.
- A janela semanal mostra sete datas, lacunas explícitas, melhor marca quando comparável e mudança entre primeiro e último registro. Diferença entre tarefas, prática e familiaridade impedem interpretar isso como mudança de capacidade. Nenhum julgamento de consistência entre escalas diferentes.
- Objetos da coleção derivam das conclusões por sala/data. Reabrir não duplica nada. Até quatro representações por porta mantêm a cena leve; o Diário conserva a contagem completa. Arquivo não mostra objetos de datas posteriores à selecionada.
- Estados das portas: por descobrir; em andamento (marca bronze e luz quente no piso); concluída (✓, luz verde discreta e objeto). Objetos flutuam e surgem gradualmente; animações respeitam a preferência de movimento reduzido do sistema.
- Nove desenhos originais em SVG, duas variações de material por peça, PNGs transparentes de 1024 px. Selecionada a versão de materiais opacos para legibilidade. São ilustrações vetoriais com volume por gradientes, não renders 3D. Originais preservados, sem alterar personagem, logo ou portais. Proveniência em `assets/collection.provenance.json`.
- Cada sala reutiliza seu objeto em uma vinheta e recebe uma ambientação própria no cabeçalho. Área de respostas continua clara.
- Arquivo disponível desde 18/10/2026 até ontem; no lançamento explica que abre amanhã. A primeira conclusão de cada desafio fica preservada. A sequência conta o dia real da conclusão de alguma sala, não a data do desafio arquivado; tolera o dia atual ainda não jogado.
- Progresso separado por idioma. Chaves antigas mantidas no compartimento padrão pt-BR, com origem de idioma desconhecida; registros sem versão não entram nas comparações. O agregado antigo de personalidade permanece intacto, mas não é misturado com respostas datadas de origem conhecida.
- Sons novos são síntese Web Audio autoral, CC0: chave, papel, vento e conclusão, desligados até ação explícita. O MP3 de licença desconhecida continua preservado fora de public e foi retirado do fluxo de reprodução.
- Nenhuma conta, telemetria ou serviço externo. Se localStorage falhar, há continuidade apenas em memória durante a sessão. Limpar dados locais apaga o histórico.

## Música no primeiro movimento — 18/10/2026 (vigente)

Por solicitação do usuário, a trilha escolhida volta a tocar na prévia local assim que o jogador inicia um movimento (teclado, arrasto ou caminhada até uma porta). O primeiro gesto habilita também os efeitos. Desligar pelo botão impede religamento automático nos movimentos seguintes; o botão permite retomar. A trilha pausa com a aba oculta. O MP3 continua exclusivamente na rota de prévia local, sem cópia para public e sem alteração de licença ou autorização de publicação. Esta decisão substitui a retirada da trilha e a exigência de clicar primeiro no controle de som descritas acima.

## Cards clássicos e salão mobiliado — 18/10/2026 (vigente)

- A pedido do usuário, os desafios usam um fólio clássico de RPG: papel marfim, tecido verde, moldura dupla bronze e medalhões desenhados para cada sala. Gradientes decorativos dos cards foram substituídos por superfícies planas; a névoa do cenário permanece.
- Cards ocupam a altura disponível sem rolagem interna. Desafio, instruções e resultado são painéis separados. Detalhes continuam acessíveis por botão; listas longas e páginas do Diário usam Anterior/Próxima. Não se elimina conteúdo para fazê-lo caber.
- Desktop ganha coluna lateral; celular ganha cabeçalho compacto. Verificados 1366×768, 390×844 e 390×667, nas oito salas, instruções, resultados, detalhes e todas as páginas do Diário. Teclado e preferência de movimento reduzido preservados.
- Salão recebe tapete xadrez verde/marfim em perspectiva, duas luminárias e dois quadros flutuantes. Objetos usam a projeção e a ordem de profundidade do cenário. Luminárias ficam apoiadas; quadros flutuam. O tapete é desenhado em Canvas, sem arquivo raster adicional.
- Doze SVGs originais: oito medalhões, uma textura tecida, uma luminária e dois quadros. Fontes e versões de uso separadas; manifesto com hashes e proveniência em assets/salon.provenance.json. Integração para revisão visual, sem promover aprovação artística nem alterar os originais anteriores.
- Regras, respostas, pontuação, histórico e início do som pelo movimento preservados. Correção incidental: Enter entre campos da sala divergente apenas avança ao próximo campo; envia somente no último.

## Materiais gerados e piso contínuo — 18/10/2026 (vigente)

A revisão do usuário rejeitou a decoração vetorial e o tapete solto. O salão agora usa imagens geradas com aparência 3D: luminária de seda verde/bronze/mármore com maçã orbital, quadro da escada e guarda-chuva, quadro da pedra com chapéu e pêndulo. São peças originais geradas pelo image_gen integrado, não desenhos SVG feitos por código. Os desenhos anteriores ficam preservados, mas não são mais usados na decoração do salão.

O xadrez é uma textura gerada de piso têxtil contínuo, aplicada com perspectiva e baixa opacidade, sem moldura, franja, espessura ou sombra de tapete. Objetos decorativos estão em cantos de exploração à frente e além do conjunto das portas, em profundidades de .36 a 1.75 (portas até .04). Recebem sombra projetada; apenas os quadros flutuam, respeitando movimento reduzido.

Cards recebem moldura gerada de laca/malaquita/bronze e textura gerada de marfim. Georgia unifica títulos, explicações e controles com quatro escalas tipográficas compartilhadas, adaptadas ao celular. A miniatura do portal correspondente substitui o medalhão vetorial. A paginação e separação entre jogo, ajuda e resultado permanecem.

Seis PNGs novos e seus prompts completos estão registrados em assets/salon-raster.provenance.json, com originais preservados em assets/sources/salon-raster e cópias em public/assets/salon-raster. Integração para revisão visual, não aprovação artística presumida. Nenhuma pontuação ou dado salvo foi alterado.

## Posição da decoração — 18/10/2026 (vigente)

Por ajuste solicitado com referências visuais: o quadro da escada/guarda-chuva fica fixo na parede ao fundo, centralizado acima e atrás da logo BOWLER. O quadro da pedra com chapéu fica apoiado no chão no canto esquerdo, com sombra de contato e sem flutuação. Uma única luminária ocupa o eixo central do salão, entre a logo e a posição inicial do personagem; a segunda instância foi removida. A elevação do quadro de parede acompanha a escala responsiva do cenário. Esta distribuição substitui a anterior em cantos de exploração. Assets preservados, sem novas gerações.

## Quadro do cavalo e escultura — 18/10/2026 (vigente)

O quadro central foi substituído por uma nova geração frontal, sem perspectiva inclinada: cavalo de xadrez em mármore com chapéu preto e faixa verde, tabuleiro suspenso, escadarias e guarda-chuvas entre nuvens. Escala aumentada de 1,12 para 1,65 e elevação de 190 para 225, mantendo centralização sobre a logo. A luminária foi removida da cena e do carregamento.

Nova escultura original gerada com aparência 3D: escadaria de mármore em laço, maçã de malaquita suspensa, chapéu preto e pedestal preto/verde/bronze. Apoiada no chão com sombra, no canto direito junto aos portais (x=2,4; y=0,35), em posição simétrica ao quadro de chão esquerdo; tamanho 2,2. O quadro esquerdo permanece. As duas novas imagens têm originais preservados, cópias de runtime e hashes no manifesto; prompts em assets/knight-sculpture-prompts.json e na proveniência de imagens do salão. A geração do quadro usa como referência a moldura anterior. Nenhuma mudança nos desafios ou dados salvos.

## Imagens exclusivas das salas e caminhada — 18/10/2026 (vigente)

O usuário rejeitou reutilizar portas ou quadros dentro dos cards. Cada sala agora tem uma imagem original gerada exclusiva, compartilhada apenas entre seu próprio cabeçalho e resultado: orrery de formas (abstrato), livro/pássaros/bússola (verbal), ábaco em espiral (numérico), cubo desmontado em giroscópio (espacial), ampulheta/pérolas/chapéu (memória), romã com ideias divergentes (divergente), três associações formando uma chave (convergente), busto sem rosto abrindo em facetas (personalidade). Nenhuma altera os estímulos ou as regras das questões.

A moldura esticada foi retirada. Um novo ornamento de canto gerado é exibido em quatro instâncias rotacionadas, mantendo proporção; trilhos simples de verde/bronze fecham o contorno. Não se usa mais o quadro genérico no resultado. Nove PNGs novos com prompts em assets/room-art.provenance.json, fontes separadas e hashes no manifesto; integração para revisão, sem aprovação artística presumida.

Caminhada: velocidade de .13 para .21 unidades/s, aproximadamente 62% maior. A fase da passada é preservada ao trocar direção, o balanço acompanha o ciclo completo em vez de reiniciar a cada frame e a câmera usa acompanhamento exponencial independente da taxa de atualização. Deslocamento continua sincronizado com o ciclo das pernas, direita continua usando a faixa esquerda espelhada existente. Renderização do piso usa faixas de 6 px em vez de 3 para reduzir o trabalho por frame. Não foram gerados novos sprites do personagem nem certificada uma taxa de 60 fps.
