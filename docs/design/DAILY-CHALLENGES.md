# Desafios diários das salas

Documento de estudo e especificação, 18/10/2026. Define o desafio do dia de cada uma das oito portas, o ciclo que traz o jogador de volta e o relatório. Complementa `docs/product/BRIEF.md` e obedece a `docs/science/TESTS.md`: os desafios são jogos inspirados em métodos publicados, não testes validados. Nenhuma tela mostra QI, percentil ou faixa populacional até existir norma própria.

## 1. Ideia central

Cada porta abre uma sala com **um desafio por dia, igual para todo mundo**. O jogo pega o que faz Wordle, Termo e Contexto viciarem (um quebra-cabeça curto, o mesmo para todos, resultado compartilhável e vontade de voltar amanhã) e aplica a oito habilidades diferentes. Em vez de um teste longo e cansativo, o perfil se forma aos poucos, dia após dia.

Três regras de desenho:

1. **Curto e completo.** De 2 a 6 minutos por sala. Dá para fazer uma sala no café e as oito numa noite.
2. **Justo e igual para todos.** O conteúdo do dia nasce de uma semente fixa (a data no fuso de Brasília). Dois amigos jogam exatamente o mesmo desafio e podem comparar.
3. **Honesto.** O placar é do jogo: tentativas, acertos, tempo, sequência de dias. O relatório fala em tendências pessoais ("seu melhor resultado", "você vai melhor em X do que em Y") e marca tudo como exploratório.

## 2. O ciclo diário

```
Hub ──► escolhe porta ──► desafio do dia ──► resultado + cartão para compartilhar
 ▲                                                   │
 └── porta muda de estado (feita hoje) ◄─────────────┘
         │
         └─► 8 de 8 no dia ──► Retrato do dia (relatório) ──► volta amanhã
```

- **Reinício:** meia-noite de Brasília. Desafios de dias anteriores ficam no "Arquivo" (fase futura).
- **Estado das portas no hub:** não feita hoje, em andamento, feita hoje (com o resultado no rótulo).
- **Sequência (streak):** dias seguidos com ao menos uma sala concluída. Recompensa visual, nunca punição: perder a sequência não apaga nada.
- **Coleção surreal:** cada sala concluída deixa um objeto no hub (maçã, cachimbo, nuvem, chave, chapéu...). Com o tempo o salão branco se enche de objetos flutuantes. É a recompensa estética que combina com Magritte.
- **Compartilhar:** cada sala gera um texto curto com emojis, sem spoiler, no padrão Wordle. Exemplo: `BOWLER TEST · Perto Demais #12 · 23 tentativas 🟩🟩🟨🟥 · bowlertest`.

## 3. Referências estudadas

| Referência | O que aproveitamos | O que não pode |
| --- | --- | --- |
| **Contexto** (Nildo Junior, lançado em português em fev/2022, inspirado no Semantle) | Adivinhar a palavra secreta; cada palpite mostra só a posição (1 = a palavra). Simplicidade, frustração seguida de grande recompensa, compartilhamento. | Nome, visual, lista de palavras do Contexto. Nossa versão usa vetores próprios e identidade própria. |
| **Semantle** | Similaridade por vetores de palavras e cosseno. | Escala numérica confusa, que o Contexto corrigiu mostrando posição. |
| **Wordle / Termo** | Um por dia, igual para todos, cartão com emojis. | Mecânica de letras. |
| **DAT**, Olson et al., PNAS 2021 | Pedir 10 substantivos distantes; pontuar a distância semântica média entre os 7 primeiros válidos, multiplicada por 100. Código de referência com licença MIT, usando GloVe 840B. | Comparar nossa nota com a do DAT oficial: modelo de vetores diferente, idioma diferente. |
| **Usos alternativos (AUT)**, Guilford; pontuação automática por distância semântica (SemDis, Beaty & Johnson) e modelos treinados (Open Creativity Scoring, Organisciak et al.) | Fluência (quantas ideias) e originalidade (distância do objeto). | Afirmar validade em português sem estudo. |
| **Associações remotas (RAT)**, Mednick 1962; versões de compostos (Bowden & Jung-Beeman) | Três palavras, achar a quarta que liga todas. | Itens originais em inglês: criamos trios novos por idioma. |
| **Matrizes progressivas** (Raven) e **ICAR** (Condon & Revelle) | A ideia de matriz 3×3 governada por regras, com dificuldade crescente e geração automática. | Itens, figuras e layout de Raven/WAIS. O ICAR é declarado para **uso acadêmico exclusivo**; não entra num produto. Geramos as nossas. |
| **Rotação mental**, Shepard & Metzler 1971 | Decidir se duas figuras 3D são a mesma girada ou o espelho. | Figuras originais dos estudos. |
| **Blocos de Corsi**, **dígitos**, **n-back** | Lembrar sequências espaciais que crescem até falhar. | Materiais de testes comerciais. |
| **Pareamento símbolo-número** (estilo código/SDMT) | Velocidade de processamento com símbolos próprios. | Símbolos e folha do SDMT/WAIS (comerciais). |
| **IPIP** (Goldberg, Oregon Research Institute) | Itens de personalidade Big Five em domínio público. | Usar tradução não adaptada como se fosse validada: nossa versão em português é livre e marcada assim. |
| **NYT Connections** | Agrupar 16 palavras em 4 grupos escondidos. Ideia de variante futura para a sala convergente. | Nome e formato visual. |

## 4. Vetores de palavras (base das salas verbal e divergente)

- **Português:** vetores do `pt_core_news_lg` 3.8 do spaCy, "Explosion fastText Vectors (cbow, OSCAR Common Crawl + Wikipedia)", **licença CC0**, 300 dimensões, 500 mil palavras.
- **Inglês:** vetores do `en_core_web_lg` 3.8, "Explosion Vectors (OSCAR 2109 + Wikipedia + OpenSubtitles + WMT News Crawl)", **licença CC0**.
- `tools/build_word_space.py` gera o espaço usado no navegador: palavras frequentes, só formas-base (lematizadas), sem palavras vazias, vetores normalizados, reduzidos por PCA e quantizados em 8 bits. Plurais e flexões comuns são convertidos para a forma-base ("gatos" vira "gato").
- Tudo roda no navegador. Nenhuma palavra digitada sai do computador do jogador.
- Limite conhecido: vetores aprendem com textos da internet e podem refletir associações estranhas ou enviesadas. A lista de palavras secretas é curada à mão para evitar termos sensíveis.

## 5. As oito salas

Formato de cada ficha: nome do desafio, referência, como se joga, o que gera o conteúdo do dia, placar, cartão de compartilhar e status.

### Sala 1 · Raciocínio abstrato · "A Janela"

- **Referência:** matrizes por regras (método das matrizes progressivas, com gerador próprio).
- **Como se joga:** 6 matrizes 3×3 com a última célula vazia, da mais fácil à mais difícil. Escolher entre 6 opções. Sem limite rígido de tempo; o tempo fica registrado.
- **Conteúdo do dia:** cada célula combina forma (círculo, quadrado, triângulo, losango, maçã, chapéu), quantidade (1 a 3), preenchimento (preto, verde, contorno) e rotação. Cada atributo segue uma regra por linha: constante, progressão, ou "distribuição de três" (cada valor aparece uma vez por linha). Quanto mais atributos variando, mais difícil. As alternativas erradas mudam exatamente um atributo da resposta, para não haver atalho visual.
- **Placar:** acertos de 6, tempo total. Cartão: `🟩🟩🟩🟨⬛🟩` (verde = certo de primeira).
- **Status:** jogável no protótipo.

### Sala 2 · Raciocínio verbal · "Perto Demais"

- **Referência:** Contexto/Semantle, com o lema da marca: quanto mais perto você olha, menos você vê.
- **Como se joga:** descobrir a palavra secreta. Cada palpite recebe sua posição na lista de todas as palavras ordenadas por proximidade com a secreta (1 = acertou). Lista de palpites ordenada da mais próxima à mais distante, com barra colorida (verde até 300, amarelo até 1.500, vermelho acima).
- **Ajudas:** até 3 dicas; cada dica revela uma palavra mais próxima que o seu melhor palpite. Botão "desistir" mostra a palavra e as 30 mais próximas.
- **Conteúdo do dia:** palavra secreta sorteada pela semente da data numa lista curada de substantivos comuns e concretos, em português e em inglês separadamente.
- **Placar:** número de palpites e de dicas. Cartão: `Perto Demais #N · 23 palpites · 1 dica` mais 4 quadradinhos da trajetória.
- **O que observar:** é um jogo de vocabulário e associação, divertido e viciante. Não mede raciocínio verbal sozinho; a sala ganhará depois um bloco curto de analogias e semelhanças autorais.
- **Status:** jogável no protótipo (pt-BR e inglês).

### Sala 3 · Raciocínio numérico · "A Balança"

- **Referência:** séries numéricas e problemas de alvo (estilo Contagem/Countdown).
- **Como se joga:** 5 séries ("2, 6, 12, 20, 30, ?") com dificuldade crescente, resposta digitada. Depois, o desafio final **Alvo**: chegar a um número usando 4 números dados e as quatro operações.
- **Conteúdo do dia:** geradores por regra: aritmética, geométrica, diferenças crescentes, intercaladas (duas séries alternadas), Fibonacci com sementes, quadrados/cubos com deslocamento. O Alvo é gerado de trás para frente, garantindo que tem solução.
- **Placar:** acertos de 5 + Alvo exato ou distância. Cartão: `🟩🟩🟩🟥🟩 · 🎯`.
- **Status:** séries jogáveis no protótipo; Alvo especificado.

### Sala 4 · Raciocínio espacial · "O Cubo no Céu"

- **Referência:** rotação mental (Shepard & Metzler).
- **Como se joga:** uma peça feita de cubos de mármore e malaquita flutua no céu. Entre 4 vistas, escolher a que é a mesma peça girada (as outras são o espelho ou uma peça parecida). 6 rodadas; ângulos maiores e peças com mais cubos ficam para o fim.
- **Conteúdo do dia:** peças de 6 a 9 cubos geradas por caminho aleatório sem simetria espelhada (para o espelho sempre ser diferente). Desenho isométrico no Canvas.
- **Placar:** acertos de 6, tempo médio. Cartão: `🟩🟩🟨🟩🟥🟩`.
- **Status:** jogável no protótipo.

### Sala 5 · Memória e velocidade · "Chapéus que Somem"

- **Referência:** blocos de Corsi (memória de trabalho espacial) e pareamento símbolo-número (velocidade).
- **Como se joga, parte 1:** chapéus-coco espalhados pelo chão se acendem em sequência; o jogador repete clicando. Começa em 3 e cresce 1 a cada acerto; duas falhas seguidas no mesmo tamanho encerram.
- **Como se joga, parte 2 (fase seguinte):** 60 segundos combinando símbolos surreais (maçã, cachimbo, nuvem...) aos números de uma legenda.
- **Conteúdo do dia:** posições dos chapéus e sequências pela semente da data.
- **Placar:** maior sequência lembrada ("span") e, na parte 2, acertos por minuto. Cartão: `🎩 span 7`.
- **Cuidado:** separar a latência do aparelho da velocidade da pessoa; não comparar celular com computador.
- **Status:** parte 1 jogável no protótipo.

### Sala 6 · Criatividade divergente · "Dez Palavras Distantes"

- **Referência:** DAT (método publicado) e usos alternativos.
- **Como se joga:** escrever 10 substantivos o mais diferentes possível entre si. A nota é a distância semântica média entre os 7 primeiros válidos × 100, com a mesma matriz colorida de pares que o jogador viu no DAT oficial (vermelho = pares próximos demais).
- **Toque diário:** uma **palavra-âncora** do dia aparece no espelho; um bônus mostra o quanto sua lista ficou longe dela. Mantém a sala nova a cada dia sem mudar a medida principal.
- **Variação futura:** usos alternativos de um objeto surreal do dia ("um guarda-chuva de pedra"), com fluência e originalidade por distância semântica.
- **Placar:** nota BowlerTest de distância (não comparável à do DAT oficial) e melhor marca pessoal. Cartão: `Dez Palavras · 84 · ⚓ 91`.
- **Status:** jogável no protótipo (pt-BR e inglês).

### Sala 7 · Criatividade convergente · "A Chave"

- **Referência:** associações remotas.
- **Como se joga:** três palavras ("pé · bolo · fubá") e uma quarta escondida que liga as três ("milho"... ou outra que o jogador defenda, ver abaixo). 5 trios por dia, do mais fácil ao mais difícil. Dica 1: número de letras. Dica 2: primeira letra.
- **Conteúdo do dia:** banco autoral por idioma, com trios escritos à mão e revisados (expressões, compostos e associações culturais brasileiras em pt-BR; versão própria em inglês). Sorteio sem repetição por semente.
- **Respostas alternativas:** aceitar respostas fortes que não estão no banco e registrar para revisão humana.
- **Variação futura:** "O Armário", 16 palavras em 4 grupos escondidos.
- **Placar:** trios resolvidos e dicas usadas. Cartão: `🗝️ 4/5`.
- **Status:** jogável no protótipo, com 40 trios em pt-BR e 35 em inglês em `src/rooms/convergent-items.js` (revisão humana pendente).

### Sala 8 · Personalidade e forças · "O Espelho"

- **Referência:** IPIP Big Five (domínio público).
- **Como se joga:** 5 frases por dia aparecem no espelho ("Sou a alma da festa"); o jogador responde de "nada a ver comigo" a "sou exatamente assim". Dez datas consecutivas cobrem os 50 itens; completar a cobertura não demonstra estabilidade ou validade do perfil.
- **Conteúdo do dia:** rodízio fixo dos itens, equilibrando os cinco fatores e itens invertidos.
- **Placar:** não há certo ou errado e não há nota. Mostra o perfil parcial e quanto falta para completar.
- **Cuidado:** tradução livre, não validada; personalidade nunca entra em índice de inteligência.
- **Status:** jogável no protótipo; respostas acumuladas no navegador.

## 6. Relatório ("Retrato do dia" e retrato semanal)

- **Retrato do dia** abre quando as 8 salas do dia terminam: o Bowler de costas diante do espelho, cercado pelos objetos das salas; cada objeto maior onde o resultado do dia foi melhor **em relação às próprias marcas da pessoa**.
- **Retrato semanal:** tendências de 7 dias por sala, melhor marca, regularidade, e um parágrafo em linguagem simples ("Você foi mais consistente em memória e mais variável no Perto Demais").
- **Nunca:** QI, percentil, "acima da média", diagnóstico. Nesta experiência as comparações são exclusivamente com as marcas da própria pessoa. Não há índice geral; personalidade é separada de desempenho.

## 7. Engenharia

- `src/rooms/daily.js`: data de Brasília, número do desafio, semente e gerador pseudoaleatório determinístico (mulberry32 sobre hash da data + sala).
- `src/rooms/<sala>.js`: cada sala exporta `mount(container, ctx)` e devolve `destroy()`. `ctx` traz idioma, textos, semente, e `finish(result)` para salvar e compartilhar.
- Progresso por dia no `localStorage` (`bowlertest.daily.<data>.<sala>`), com fallback silencioso. Sem conta e sem servidor nesta fase.
- Espaço semântico em `public/data/words/<idioma>/` (vocabulário, mapa de flexões, vetores int8 e lista de palavras secretas), carregado só quando a sala verbal ou divergente abre.
- Testes de lógica para cada gerador (mesma data, mesmo conteúdo; respostas únicas; distratores válidos).

## 8. Ordem de implementação

1. Motor diário e moldura das salas. Feito.
2. Perto Demais (verbal) e Dez Palavras Distantes (divergente), que dividem o espaço semântico. Feito.
3. A Janela (abstrato), A Balança (séries) e Chapéus que Somem (memória, parte 1). Feito.
4. A Chave (convergente), O Cubo no Céu (espacial), O Espelho (personalidade). Feito.
5. Estados das portas no hub, coleção de objetos, sequência de dias. **Implementados em 18/10/2026.**
6. Retrato do dia e semanal. **Implementados em 18/10/2026**, com primeira marca neutra e comparação pessoal por idioma/versão. Espelho de personalidade com tamanho fixo.
7. Arquivo de dias anteriores. **Implementado em 18/10/2026.** Alvo numérico, parte 2 da memória e usos alternativos continuam futuros.

### Entrega visual e regras do diário — 18/10/2026

| Item solicitado | Estado |
| --- | --- |
| Retrato após oito salas | Cena de espelho, Bowler de costas e oito objetos; acesso pelo Diário e pelo último resultado |
| Sete dias | Uma linha por sala, datas sem jogo vazias, contagem, melhor marca comparável e diferença primeiro/último; sem inferência normativa |
| Coleção persistente | Objetos por conclusão de data distinta; até quatro miniaturas por porta, contagem completa no Diário |
| Estados das portas | Marca de andamento, ✓, luz no piso e objeto concluído |
| Ambientação | Oito vinhetas ilustradas com materiais comuns e fundos próprios no cabeçalho |
| Sequência e arquivo | Dia real jogado para sequência; data original para conteúdo arquivado; primeira conclusão preservada |
| Polimento | Emergência dos objetos, flutuação, transição de luz, quatro sons originais opt-in, foco visível e movimento reduzido do sistema |

Objetos: janela, livro, balança, cubo, chapéu, constelação, chave e espelho com maçã. A moldura do retrato é a nona peça. Fontes SVG, estudos, PNGs RGBA e proveniência registrados no manifesto. Nenhum item ou arte preexistente foi substituído.

Tamanho artístico: 1 + 0,2 × clamp(melhora / max(1, |melhor anterior|), −1, 1). Em palpites, menor é melhor e apenas palavras resolvidas entram; nas demais medidas, maior é melhor. Igualdade de dicas obrigatória nas salas verbal e convergente. Sem referência comparável ou na personalidade, escala 1. Não existe nota composta. A janela semanal não transforma ausência em zero e não descreve diferenças entre jogos como diferenças de capacidade.

As respostas de personalidade agora são datadas e separadas por idioma. O retrato parcial pode incorporar registros anteriores à data selecionada, nunca posteriores. Arquivos antigos sem respostas datadas ficam preservados, mas não servem de base inferida.

## 9. Fontes

- Contexto, origem: https://www.hey.gg/blog/contexto
- DAT, código de referência (MIT, GloVe 840B, 7 primeiras palavras válidas): https://github.com/jayolson/divergent-association-task
- ICAR, uso acadêmico exclusivo: https://sms.statistik.tu-dortmund.de/en/research/projects/completed-research-projects/international-cognitive-ability-resource-icar/
- IPIP, domínio público: https://en.wikipedia.org/wiki/International_Personality_Item_Pool
- SemDis (Beaty & Johnson): https://ecrhub.org/publications/automating-creativity-assessment-semdis-open-platform-computing-semantic-distance
- Vetores fastText Common Crawl (referência de método): https://github.com/facebookresearch/fastText/blob/main/docs/crawl-vectors.md
- Vetores usados: metadados dos pacotes `pt_core_news_lg` 3.8.0 e `en_core_web_lg` 3.8.0 (spaCy), licença CC0 dos vetores.

## Atualização visual — 18/10/2026

Cards clássicos implementados, sem rolagem interna: desafio, ajuda e resultado separados; palpites, vizinhança verbal, retrato, tendências e coleção paginados. Acesso a todos os detalhes preservado. Oito medalhões originais substituem as vinhetas do cabeçalho nesta apresentação. Tapete em perspectiva, luminárias e quadros flutuantes enriquecem o salão. Conteúdo e pontuação dos desafios não mudaram. Verificação de layout em desktop e celular concluída; aprovação artística final pendente da revisão do usuário.

Revisão posterior de materiais: decoração do salão e materiais dos cards substituídos por seis imagens geradas com aparência 3D. Piso contínuo sutil, sem tapete solto; objetos separados dos portais. Tipografia compartilhada entre salas. Mantidos desafios, paginação e limites científicos.

Revisão de cards: cada desafio passa a ter uma ilustração surrealista gerada exclusiva, sem reutilizar portais ou quadros. Ornamentos de canto proporcionais substituem a moldura esticada. Alteração apenas de apresentação, sem mudanças nas tarefas ou pontuação.
