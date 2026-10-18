# Passagem para Astra

Atualização: o usuário autorizou implementar a intro local. Ela está pronta para revisão visual. Leia ../engineering/LOCAL-PROTOTYPE.md e execute npm run dev.

## Ordem de leitura
`README.md` → `AGENTS.md` → `docs/DECISIONS.md` → `docs/design/ANIMATION.md` → `data/animations/bowler.json` → `assets/manifest.json` → `docs/ROADMAP.md`.

## Referências certas
- Intro: ler `docs/design/INTRO.md` antes de planejar o hub. Cenário branco com névoa leve; personagem central no início, mãos nos bolsos; logo acima; música escolhida. Só recuar revela portas ao fundo; avançar não dispara a revelação.
- Personagem: `assets/sources/character/reference/bowler-approved.png`.
- Logo atual: `public/assets/brand/bowler-test-logo.png`.
- Idle: `public/assets/characters/bowler/idle/front.png` e `back.png`.
- Walk: `assets/staging/character/walk/walk-{front,back,left,right}.png` e subpastas de frames.
- Inspeção: GIFs em `assets/previews/`, candidatos a 8 fps, não animação aprovada.

## Contrato de integração sugerido
Sprites 256 × 320; origem 0.5,0.95; faixa 8 × 1, índices 0..7; 8 fps inicial a revisar. A velocidade de deslocamento pertence ao jogo, não está definida pela faixa. Não existe garantia de duração física, direção isométrica ou seamless loop.
Ao parar, usar pose com mãos nos bolsos; ao andar, braços livres. Idle lateral e transições ainda faltam: combinar estratégia com usuário no protótipo.
Pré-processamento já enquadrou os quadros; não recortar cada frame na aplicação e perder o pivô. Não usar logo como sprite do boneco. Não usar arquivos antigos vermelhos ou de camisa verde.

## Limites
Não existe QI, percentil, faixa normativa ou scoring validado. Não transformar placeholders em avaliação. Personalidade/forças separadas de desempenho. Idiomas pt-BR e inglês desde a estrutura inicial, com tarefas verbais independentes.
O MP3 foi preservado sem publicação e sem licença conhecida. Não servir `assets/sources`, `assets/archive` ou o projeto inteiro como diretório público.

## Primeiro pedido de implementação adequado
Quando o usuário autorizar implementação, construir a intro descrita em `docs/design/INTRO.md` e o hub visual navegável, com movimento, pose parada, música, névoa sutil, idioma, dica de recuo, revelação de portas e modo em lista, sem testes psicológicos reais. Escolha do motor e escopo final dependem da próxima autorização. Esse escopo de intro foi autorizado e implementado no pedido posterior de visualização local.
