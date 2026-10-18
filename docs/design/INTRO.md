# Primeira tela — direção de experiência

Especificação da intro. Implementação local autorizada posteriormente pelo usuário e entregue para revisão visual; ver ../engineering/LOCAL-PROTOTYPE.md.

## Cena de abertura definida

O jogador encontra um espaço todo branco, vazio e aparentemente sem limites. O chão e o fundo se integram, com profundidade perceptível pela iluminação, por uma sombra de contato discreta e por névoa ambiente muito suave.

O Browler aparece no centro da composição inicial, de frente para o jogador, parado com as mãos nos bolsos. A logo BOWLER TEST fica acima dele, com respiro suficiente para não tocar o chapéu. Usar o arquivo atual: BOWLER preto, TEST verde em perspectiva de chão e com transparência gradual na metade inferior. O subtítulo do briefing pode permanecer discretamente abaixo da logo, sem disputar atenção com o personagem.

A música escolhida é o arquivo que o usuário colocou na pasta: “The Case of the Missing Note.mp3”. Ela acompanha a introdução. Não foi feita análise musical do arquivo, portanto não há marcações de batidas, cortes ou duração de loop definidos.

No primeiro quadro não há portas visíveis, contornos de portas, rótulos de testes ou objetos antecipando sua posição. O branco, o personagem, a logo e a atmosfera sustentam a composição.

## Névoa, luz e dimensão

- Névoa branca/cinza muito clara, de baixo contraste, com deslocamento lento e irregular.
- Mais perceptível junto ao chão e na profundidade; preservar o rosto oculto, o chapéu, os pés e a leitura da logo.
- Sensação de ar e distância, sem virar uma nuvem opaca ou fumaça saindo do personagem.
- Luz difusa e sombra de contato suave nos pés para o boneco não parecer um recorte flutuante.
- O fundo continua branco; a névoa acrescenta volume sem introduzir cenário escuro.
- Movimento reduzido: névoa estática ou quase estática, sem prejudicar a descoberta das portas.

Esses efeitos serão camadas do cenário, não alterações destrutivas nos PNGs originais. Ainda não há asset de névoa, sala ou porta entregue.

## Regra central de descoberta

1. Parado: mãos nos bolsos; música e atmosfera dão vida ao espaço.
2. Andar para a frente: o personagem se movimenta normalmente, mas não revela portas e não dispara progresso da introdução.
3. Só ao começar a recuar: a revelação das portas pode começar. O gatilho é o movimento espacial para trás, nunca um temporizador ou a simples ausência de ação.
4. As portas aparecem ao fundo da sala; não nascem junto aos pés nem acompanham o boneco.
5. Depois da revelação, o jogador passa à exploração do hub e escolhe uma porta.

“Nada acontece ao andar para a frente” significa ausência de descoberta/evento, não ausência de animação ou bloqueio do controle.

Para a implementação futura, mapear “para trás” como recuo em direção à câmera a partir da posição inicial. Essa convenção espacial precisa ser comunicada consistentemente no teclado/toque; não depender de qual sprite está virado para a câmera. O enquadramento inicial é central; o personagem não precisa ficar fixo no centro enquanto anda.

## Máquina de estados proposta para Astra

| Estado | O que aparece | Condição para avançar |
| --- | --- | --- |
| Pronto para entrar | Entrada discreta, idioma e acesso ao som | Gesto de início do jogador, quando necessário para áudio |
| Espaço vazio | Boneco, logo, branco e névoa; nenhuma porta | Movimento real para trás |
| Revelação | Portas emergem gradualmente ao fundo | Pequeno deslocamento de recuo, ajustado no protótipo |
| Hub descoberto | Portas identificáveis, controles e estados de conclusão | Aproximação/seleção de uma porta |

A aprovação do usuário fixa a experiência, não valores técnicos. Distância do recuo, duração da transição, opacidade da névoa e enquadramento responsivo ainda serão ajustados no protótipo.

Sugestão de comportamento: iniciar uma aparição sutil logo no primeiro recuo intencional e completar a revelação conforme a distância percorrida. Usar deslocamento espacial a partir do ponto inicial, não somar teclas pressionadas nem pequenos movimentos de vai-e-volta. Após descobertas, manter as portas visíveis durante a sessão. São recomendações de implementação, ainda sem aceite visual.

## Música e controles discretos

- A experiência deve começar com a música junto da cena assim que a reprodução estiver disponível.
- Prever uma entrada discreta “Entrar” / “Enter” que possa fornecer o gesto para iniciar o som; não prometer áudio automático antes de qualquer interação.
- Música em volume baixo, sem competir com instruções; controle de silenciar sempre acessível e preferência respeitada.
- Não reiniciar a faixa a cada mudança de direção, pausa do boneco ou troca entre idle e walk.
- Loop com transição suave é uma intenção; verificar começo/fim da faixa antes de decidir corte ou crossfade.
- A origem está em `assets/sources/audio/the-case-of-the-missing-note.mp3`. Confirmar os direitos antes da publicação; a escolha para a intro já foi feita pelo usuário.

## Dica e acessibilidade

Se o jogador não descobrir o recuo, mostrar uma dica discreta, localizada e operável por teclado. Texto sugerido: “Às vezes, é preciso dar um passo atrás.” / “Sometimes, you need to take a step back.” Não revelar portas por tempo decorrido.

O modo em lista permite acessar a experiência sem movimentar o boneco. Essa alternativa é explícita de acessibilidade e não depende de executar o recuo. Preservar foco visível, contraste, opção de som e movimento reduzido.

## Critérios de aceite da futura intro

- Primeiro enquadramento: personagem central, logo acima, branco dominante e névoa discreta.
- Personagem parado com mãos nos bolsos; caminhada e retorno ao idle coerentes.
- Avançar e mover para os lados não revelam portas. Ficar parado também não revela.
- Recuar aciona a descoberta; portas aparecem ao fundo de maneira legível.
- Logo, personagem e portas continuam legíveis com névoa e em telas pequenas.
- Música inicia após interação quando necessária, não reinicia ao andar e pode ser silenciada.
- Modo em lista e movimento reduzido preservam acesso à jornada.
- Não há testes cognitivos ou pontuações fictícias na intro.


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
