# Contrato dos sprites

## Entregue
- Idle front/back: PNG RGBA, 256 × 320, uma pose, mãos nos bolsos.
- Walk front/back/left/right: 8 PNGs individuais e uma faixa horizontal de 2048 × 320 por direção, em `assets/staging/character/walk/`.
- Cada célula tem 256 × 320; ponto de apoio (128,304); origem normalizada (0.5,0.95).
- Metadados: `data/animations/bowler.json`. GIFs de inspeção a 8 fps, fundo creme, em `assets/previews/`.

## Preparação realizada
Recorte das grades de origem 4 × 2 em ordem por linhas; enquadramento via alfa >=32; escala comum para as quatro caminhadas; pés centralizados no mesmo ponto; RGBA preservado. Idle ajustado à mesma caixa útil. Remoção conservadora de ilhas desconectadas menores que 0,5% do maior componente em cada célula, para eliminar fragmentos de poses vizinhas. Isso não reconstrói anatomia, não redesenha poses nem garante escala aparente perfeita.

## Limitações que exigem revisão
As poses foram geradas como imagens independentes dentro de folhas. Há pequenas mudanças de silhueta, inclinação e luz. Algumas poses se repetem e a alternância dos passos não está garantida. A ordem fornecida NÃO é um ciclo final validado. Não chamá-lo de animação pronta para produção.
Há pixels semitransparentes e possíveis resíduos nos contornos; conferir em fundo branco, creme e escuro. Não apagar todos os pixels verdes automaticamente: são partes legítimas da roupa. A preparação conserva esses pixels dentro da caixa de recorte.
Não espelhar cegamente laterais, por causa do lenço e assimetria do chapéu. Não há diagonais, correr, salto, transição mão/bolso, idle lateral nem respiração animada.

## Aceite antes de promover para public
1. Ciclo visto em movimento sem salto na emenda e sem variação aparente de escala.
2. Passos e braços alternam coerentemente, sem pé deslizando excessivamente.
3. Contorno limpo, fundo transparente, cores/rosto/camisa corretos em todo quadro.
4. Cabeça, chapéu e pés não cortam a célula; pivô consistente.
5. Aprovação visual do usuário. Só então copiar para `public/assets/characters/bowler/walk/` e atualizar manifestos.


## Ajuste de apoio no piso e nomes — 16/10/2026

Portais ampliados para altura de referência 420 px (limitada pela viewport), com câmera de resposta mais rápida e sem pulsação das molduras. Entradas das extremidades inclinadas 54 graus para dentro; intermediárias em 22/9 graus. Projeção difusa em perspectiva no piso à frente da base, baixa saturação/opacidade, sem espelho vertical. Sombra de contato alinhada à soleira e pivô da imagem a 94% de altura.

Todos os nomes divididos explicitamente em duas linhas, em pt-BR e inglês (ex.: Raciocínio / abstrato). Sequência esquerda alterada para [0,1,4,6] para alternar poses diferentes; sprites originais preservados. Continuam candidatos artísticos.

Verificação no Chromium: capturas da cena com oito portais revisadas; desbloqueio após recuo; quatro quadros distintos da caminhada esquerda observados pelo drawImage; oito rótulos com duas linhas; nenhum erro de JavaScript.
