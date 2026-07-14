# Plano de Ação SEO — sorriemais.com

Priorizado conforme a metodologia claude-seo: **Crítico** (bloqueia indexação/risco de penalidade) → **Alto** (impacto direto em ranking/CTR) → **Médio** (otimização) → **Baixo** (backlog).

Nenhum item **Crítico** foi encontrado — o site não tem bloqueios de indexação, links quebrados ou erros de schema.

## Fase 1 — Correções de risco (Semana 1)

| # | Prioridade | Ação | Arquivo(s) | Por quê |
|---|---|---|---|---|
| 1 | Alta | Remover o bloco `aggregateRating` do JSON-LD `Dentist` em todas as páginas que o incluem | `index.html` e demais páginas com o schema da clínica | Política de review snippets do Google: avaliações auto-publicadas são "self-serving"; risco de ação manual. A nota 5,0 continua visível no conteúdo com link para o Google |
| 2 | Alta | Encurtar titles > 60 chars (5 páginas) e descriptions > 160 chars (6 páginas) | `/dra-karine-marinho/`, `/blog/`, posts `clareamento-no-alinhador`, `alinhador-ou-aparelho-fixo`, `facetas-de-porcelana`, `invisalign-vitoria`, `como-limpar` | Truncamento na SERP reduz CTR; title do perfil tem 95 chars e description 276 |

**Falseabilidade:** após o deploy, validar no [Teste de Pesquisa Aprimorada](https://search.google.com/test/rich-results) (sem warnings de review) e conferir os snippets renderizados via `site:sorriemais.com` em 1–2 semanas.

## Fase 2 — Melhorias de alto impacto (Semanas 2–3)

| # | Prioridade | Ação | Por quê |
|---|---|---|---|
| 3 | Média | Converter `hero_reception_1920x960.jpg` (248 KB) para AVIF/WebP via `<picture>` | Candidato a LCP; alvo < 90 KB |
| 4 | Média | Adicionar `width`/`height` + `loading="lazy"` em `marca_topo.png`, `antes_apos_1.jpeg`, `antes_apos_2.jpeg`, `marca_rodape.png` | Elimina CLS e adia ~300 KB abaixo da dobra |
| 5 | Média | Converter antes/depois e logos para WebP/SVG | ~40–60% de redução de bytes de imagem |
| 6 | Média | Medir CWV reais: PageSpeed Insights + relatório CrUX no Search Console; verificar redirects www→apex e http→https com `curl -I` (itens não verificáveis desta sessão) | Fecha a lacuna da auditoria; confirma o comportamento default do GitHub Pages |

**Falseabilidade:** LCP da home < 2,5 s e CLS < 0,1 no PageSpeed Insights móvel.

## Fase 3 — Conteúdo e autoridade (Mês 2)

| # | Prioridade | Ação | Por quê |
|---|---|---|---|
| 7 | Média | Criar página-pilar `/clareamento-dental-vitoria/` e adicionar a `url` no `Offer` correspondente do `OfferCatalog` | O serviço já é ofertado no schema e no formulário, mas não tem landing — lacuna para keyword local de alto volume |
| 8 | Baixa | Completar credenciais da Dra. Karine (instituição/ano de graduação) no texto e como `hasCredential` no `Person` | Reforço E-E-A-T em nicho YMYL; a nota interna no HTML já reconhece a pendência |
| 9 | Baixa | Remover comentários de template/instruções de autoria do HTML (`blog/index.html`, 4 posts, `dra-karine-marinho/index.html`) | Higiene: expõem processo editorial no view-source |
| 10 | Baixa | Criar `/llms.txt` (índice do site para LLMs) | Custo zero; sem peso de ranking comprovado (evidência claude-seo), mas inofensivo e organiza o conteúdo para agentes |
| 11 | Baixa | Ampliar o grafo de entidade: perfis em diretórios de saúde além do Doctoralia, posts regulares no Google Business Profile | Sinais de entidade usados por busca tradicional e por IA |

## Fase 4 — Monitoramento e iteração (Contínuo)

| # | Ação |
|---|---|
| 12 | Manter cadência do blog (o sitemap declara `changefreq: weekly` para `/blog/`) com `lastmod` real a cada publicação |
| 13 | Acompanhar no GSC: cobertura de indexação das 15 URLs, CTR por página (validar o efeito da Fase 1), consultas locais ("dentista vitória", "alinhador invisível vitória") |
| 14 | Responder reviews no Google (sinal de review = ~20% do peso do local pack, Whitespark 2026) |
| 15 | Repetir esta auditoria após as fases 1–2 (`/seo audit https://sorriemais.com`) e comparar via `/seo drift` |
