# Pendências legais e éticas antes do lançamento

Documento de requisitos para revisão futura, não parecer jurídico nem confirmação de conformidade.

- Conferir licenças e termos de cada instrumento, edição, tradução, figuras, tabelas e embedding. Registar evidências e links primários no inventário antes de uso.
- Arte gerada aqui usa referências visuais do próprio projeto. Não foi realizada busca de marcas, análise de exclusividade, registrabilidade ou auditoria dos termos da ferramenta.
- A logo entregue é PNG, sem arquivo de fonte ou vetor. Não há licença de uma fonte tipográfica externa anexada.
- O áudio “The Case of the Missing Note.mp3” foi encontrado na pasta; autoria, origem e permissão desconhecidas. Manter fora de `public/` até comprovação. Não inferir licença a partir do título.
- Antes de coletar: definir responsável/controlador, propósito, base aplicável, dados necessários, retenção, exclusão, segurança e eventuais transferências. Pesquisar LGPD e regras vigentes em fontes oficiais quando essa implementação for solicitada.
- Separar uso do jogo de consentimento opcional para pesquisa; não chamar dado de anônimo se houver identificadores, IP persistido ou possibilidade razoável de reidentificação.
- Definir público etário, tratamento de menores e eventual revisão ética. Não coletar data de nascimento completa sem necessidade demonstrada.
- Não usar resultados exploratórios para diagnóstico, emprego, crédito, seleção escolar ou decisões de alto impacto. Deixar limites claros no retrato.

## Inventário inicial
| Grupo | Origem | Situação |
| --- | --- | --- |
| PNGs de personagem/logo | Geração integrada nesta conversa | Proveniência registrada; revisão de direitos/marca pendente. |
| MP3 | Arquivo pré-existente na pasta do usuário | Uso público bloqueado por licença desconhecida. |
| Itens/instrumentos | Gerados por regra (matrizes, séries, cubos, chapéus); trios autorais; IPIP-50 (domínio público, tradução livre) | ICAR não usado (uso acadêmico exclusivo). Raven/WAIS/SDMT não copiados. Revisão humana dos trios e da tradução pendente. |
| Vetores de palavras | spaCy `pt_core_news_lg`/`en_core_web_lg` 3.8, vetores Explosion declarados CC0 nos metadados | Derivado em `public/data/words/`. Pacotes de pipeline completos têm outras licenças (pt CC BY-SA 4.0, en MIT); só os vetores são usados. Confirmar antes de publicar. |
| Dependência Pillow | Ferramenta de preparação, instalada no ambiente | Fixar versão no ambiente reprodutível; não é dependência do jogo. |
# Atualização de implementação — 18/10/2026

Diário, arquivo e coleção permanecem inteiramente locais. Além de respostas e resultados, o navegador guarda idioma, versão da regra, data do desafio e data real da conclusão. Esses campos permitem separar idiomas e calcular sequência sem atribuir uma prática de arquivo a um dia passado. Não há envio, conta ou telemetria. Limpar os dados locais remove o histórico; armazenamento bloqueado mantém apenas a sessão em memória.

As nove peças da coleção e do retrato são geometria SVG original produzida para este projeto, com PNGs derivados. Fontes, estudos e procedência estão em `assets/collection.provenance.json`. Declaração CC0-1.0 restrita a essas novas ilustrações e seus renders, sem relicenciar assets anteriores. Sons novos são receitas autorais de síntese Web Audio, também CC0-1.0, sem gravações ou samples; registro em `assets/audio-cues.provenance.json`. O MP3 anterior não foi movido para public e não é mais reproduzido pela aplicação.

Comparações do relatório são apenas pessoais e exploratórias. Tamanho do objeto é uma decisão artística; não é unidade psicológica. Personalidade não recebe nota de desempenho. Itens existentes e traduções continuam sem validação brasileira; cobertura de 50 frases não implica estabilidade do perfil.

