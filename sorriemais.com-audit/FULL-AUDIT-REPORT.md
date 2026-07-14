# Auditoria SEO Completa — sorriemais.com

**Data:** 14/07/2026
**Metodologia:** [claude-seo](https://github.com/AgriciDaniel/claude-seo) v2.2.0 — skill `seo-audit` (delegação paralela a especialistas: on-page, técnico, schema, conteúdo/E-E-A-T, local, GEO/IA, imagens)
**Tipo de negócio detectado:** Serviço local de saúde (clínica odontológica), brick-and-mortar — Enseada do Suá, Vitória-ES
**Escopo:** 16 páginas HTML (fonte do deploy no GitHub Pages, commit `d44358c`)

> **Limitação registrada:** o ambiente desta sessão bloqueia acesso HTTP direto a `sorriemais.com` (política de egress do proxy). Os itens que exigem o site ao vivo — cadeia de redirects www/não-www, headers de resposta, TTFB, compressão e Core Web Vitals de campo — não puderam ser medidos e estão listados como pendência no plano de ação (verificáveis via Google Search Console / PageSpeed Insights). Todo o restante foi auditado sobre a fonte exata do que o GitHub Pages serve.

---

## Nota de Saúde SEO: **84/100**

| Categoria | Peso | Nota | Ponderado |
|---|---|---|---|
| SEO Técnico | 22% | 88 | 19,4 |
| Qualidade de Conteúdo | 23% | 86 | 19,8 |
| SEO On-Page | 20% | 84 | 16,8 |
| Schema / Dados Estruturados | 10% | 82 | 8,2 |
| Performance | 10% | 74 | 7,4 |
| Prontidão para Busca por IA (GEO) | 10% | 85 | 8,5 |
| Imagens | 5% | 82 | 4,1 |
| **Total** | | | **84,1** |

**Resumo executivo:** o site está em estado muito acima da média para uma clínica local — arquitetura de URLs limpa, NAP 100% consistente nas 16 páginas, 71 blocos JSON-LD todos válidos, zero links quebrados, zero titles/descriptions duplicados, E-E-A-T forte (autora nomeada com CRO-ES, `reviewedBy`, TCLE citado nas fotos de antes/depois). Os pontos de atenção são pontuais: risco de política do Google no `aggregateRating` auto-declarado, titles/descriptions acima do limite de exibição em ~5 páginas, hero de 247 KB em JPG sem WebP/AVIF, e uma lacuna de conteúdo (Clareamento Dental sem página própria, embora ofertado no schema).

### Top 5 problemas

1. **`aggregateRating` auto-declarado no schema `Dentist`** (home e demais páginas) — política de review snippets do Google considera "self-serving"; risco de ação manual de dados estruturados. *(Alta)*
2. **Titles de 75–95 caracteres e meta descriptions de 187–276** em ~5 páginas — truncamento na SERP reduz CTR. *(Média)*
3. **Hero da home: 247 KB JPG sem variante WebP/AVIF** — maior recurso do LCP. *(Média)*
4. **4 imagens da home sem `loading="lazy"` e sem `width`/`height`** (`marca_topo.png`, `antes_apos_1/2.jpeg`, `marca_rodape.png`) — risco de CLS. *(Média)*
5. **"Clareamento Dental" listado no `OfferCatalog` sem URL e sem página dedicada** — lacuna de conteúdo para uma keyword local de alto volume. *(Média)*

### Top 5 vitórias rápidas

1. Encurtar os titles/descriptions das 5 páginas que excedem os limites (30 min de trabalho, impacto direto em CTR).
2. Remover o `aggregateRating` do JSON-LD (ou migrar para exibição sem markup) — elimina o risco de penalidade.
3. Converter o hero para WebP/AVIF com `<picture>` (o padrão já existe no site: `dra-karine-scanner.webp`).
4. Adicionar `loading="lazy"` + dimensões nas 4 imagens abaixo da dobra.
5. Remover os comentários de template/autoria deixados no HTML de 5 arquivos (higiene; hoje expõem o processo de produção do conteúdo no view-source).

---

## 1. SEO Técnico — 88/100

**O que está bom:**
- `robots.txt` válido: `User-agent: * / Allow: /` + referência ao sitemap. Nenhum bloqueio a crawlers de busca ou de IA.
- `sitemap.xml` com as 15 URLs indexáveis, todas com `lastmod` real, trailing slash consistente, sem www — batendo 1:1 com os canonicals.
- Canonical presente e autorreferente em 15/15 páginas indexáveis.
- `404.html` customizada com `noindex` (correto).
- HTTPS forçado pelo GitHub Pages; zero links internos `http://`.
- `favicon.ico`, favicon PNG 96px, apple-touch-icon e `site.webmanifest` presentes.
- Domínio canônico único (`sorriemais.com`, sem www) em todos os canonicals, OGs e schemas.

**Achados:**

| Severidade | Achado | Recomendação |
|---|---|---|
| Info | Headers customizados (HSTS, Cache-Control, X-Frame-Options) não são configuráveis no GitHub Pages | Aceitável para o porte; se migrar para Cloudflare Pages/Netlify no futuro, habilitar HSTS e cache imutável de assets |
| Info | Redirects www→apex e http→https não verificados ao vivo (bloqueio de rede da sessão) | Conferir no GSC / `curl -I` fora deste ambiente; GitHub Pages com CNAME costuma resolver ambos por padrão |
| Baixa | `styles.css?v=3` usa query-string para cache busting | Funciona, mas fingerprint no nome do arquivo é mais confiável com CDNs |

## 2. Qualidade de Conteúdo (E-E-A-T) — 86/100

**O que está bom:**
- Autoria real e verificável: Dra. Karine Marinho Ribeiro (CRO-ES 10983) nomeada como responsável técnica em todas as páginas, com página de perfil dedicada (`/dra-karine-marinho/` com `ProfilePage` + `Person`).
- Artigos com `author` e `reviewedBy` resolvidos via `@id` para a entidade da dentista — padrão forte para YMYL/saúde.
- Posts entre ~1.800 e ~3.300 palavras, únicos, com FAQs visíveis idênticas ao schema (sem cloaking).
- Compliance CFO cuidado: antes/depois com TCLE citado no HTML, disclaimers de variação de resultado, CNPJ/CRO/EPAO no rodapé.
- Cluster temático coerente: 3 páginas-pilar de serviço + 9 posts de suporte com links internos para os pilares.

**Achados:**

| Severidade | Achado | Recomendação |
|---|---|---|
| Média | "Clareamento Dental" aparece no `OfferCatalog` e no formulário, mas não tem página própria | Criar `/clareamento-dental-vitoria/` (pilar) — keyword local de alto volume já "prometida" no schema |
| Baixa | Comentários de template/instrução de autoria deixados no HTML de 5 arquivos (`blog/index.html:133`, posts `quanto-custa`, `invisalign-vitoria`, `lente-de-contato-dental-ou-faceta`, `como-limpar`, e nota interna em `dra-karine-marinho/index.html:217`) | Remover — são invisíveis ao usuário, mas expõem o processo editorial no view-source e adicionam bytes |
| Baixa | Perfil da Dra. Karine sem instituição/ano de graduação e sem `hasCredential` (a própria nota interna do arquivo reconhece) | Obter o dado e preencher texto + JSON-LD; reforça E-E-A-T em nicho YMYL |
| Info | 9 posts, todos de jul/2026 | Manter cadência (o `changefreq: weekly` do blog no sitemap cria essa expectativa) |

## 3. SEO On-Page — 84/100

**O que está bom:**
- 16/16 titles únicos; 15/15 descriptions únicas; H1 único em todas as páginas; hierarquia H2/H3 correta.
- `lang="pt-BR"` em 16/16; Open Graph e Twitter Card completos em 15/15 indexáveis (com `og:image` 1920×960 e dimensões declaradas).
- 92 links internos verificados contra o filesystem — **zero quebrados**.
- Breadcrumbs visíveis + `BreadcrumbList` em todas as páginas internas.
- Âncoras descritivas ("Conhecer o tratamento →"), navegação e rodapé com links para todos os pilares.

**Achados:**

| Severidade | Achado | Recomendação |
|---|---|---|
| Média | Titles acima de ~60 chars: `/dra-karine-marinho/` (95), `/blog/` (77), `clareamento-no-alinhador-invisivel` (77), `alinhador-invisivel-ou-aparelho-fixo` (75), `facetas-de-porcelana` (71) | Reescrever mantendo a keyword no início; ex.: "Dra. Karine Marinho Ribeiro · Dentista em Vitória-ES" (52) |
| Média | Descriptions acima de ~160 chars: `/dra-karine-marinho/` (276), `clareamento-no-alinhador` (209), `/blog/` (192), `alinhador-ou-aparelho` (187), `invisalign-vitoria` (176), `como-limpar` (177) | Cortar para 150–160 chars preservando CTA e localidade |
| Baixa | `meta keywords` presente na home | Inócuo para o Google; pode remover |

## 4. Schema / Dados Estruturados — 82/100

**O que está bom:**
- 71 blocos JSON-LD em 15 páginas — **100% com parse válido** (verificado via parser).
- Grafo de entidades bem construído: `Dentist` (@id `#clinica`) ↔ `Person` (@id `#dentista`) referenciados por `@id` em todo o site; telefone e endereço idênticos em todos os blocos.
- `Dentist` completo: address, geo, openingHoursSpecification, priceRange, sameAs (Google Maps, Instagram, Doctoralia), `areaServed` (Vitória, Vila Velha, Serra, Cariacica), hasMap, identifier EPAO.
- 13 `FAQPage` com 64 perguntas, todas com correspondência visível na página.
- 9 `BlogPosting` com headline, datas válidas (nenhuma futura; `dateModified ≥ datePublished`), author/reviewedBy, image e publisher.

**Achados:**

| Severidade | Achado | Recomendação |
|---|---|---|
| Alta | `aggregateRating` (5.0, 46 avaliações do Google) dentro do schema `Dentist` do próprio site — as diretrizes de review snippet do Google classificam avaliações coletadas de terceiros e auto-publicadas como "self-serving"; o markup é ignorado e pode gerar ação manual de dados estruturados | Remover o bloco `aggregateRating` do JSON-LD; manter a nota 5,0 apenas no conteúdo visível com link para o perfil do Google (que é onde as estrelas legitimamente aparecem) |
| Baixa | `FAQPage` em 13 páginas — desde 2023 o Google só exibe rich result de FAQ para sites governamentais/saúde de alta autoridade; utilidade atual é primariamente para GEO/IA | Manter (custo zero e útil para IA), mas sem expectativa de rich snippet |
| Info | `Service` de Clareamento no `OfferCatalog` sem `url` | Resolver junto com a criação da página de clareamento |

## 5. Performance — 74/100

**O que está bom:**
- Peso base excelente: HTML da home 34,9 KB, CSS 25 KB, JS próprio 6,4 KB — sem frameworks, sem jQuery.
- `preconnect` para Google Fonts; `fetchpriority="high"` + dimensões declaradas no hero (LCP); vídeos com `preload="none"` e poster (5,6 MB + 3,1 MB não entram no carregamento inicial).
- Único third-party: GA4 (async).

**Achados:**

| Severidade | Achado | Recomendação |
|---|---|---|
| Média | Hero `hero_reception_1920x960.jpg` = 247,8 KB, sem WebP/AVIF — é o candidato a LCP de todas as páginas que o usam | Servir via `<picture>` com AVIF/WebP (~60-90 KB) como já feito com `dra-karine-scanner.webp` |
| Média | 4 imagens da home sem `loading="lazy"` e sem `width/height`: `marca_topo.png` (34 KB), `antes_apos_1.jpeg` (102 KB), `antes_apos_2.jpeg` (115 KB), `marca_rodape.png` (52 KB) | Adicionar dimensões (evita CLS) e lazy nas que ficam abaixo da dobra |
| Baixa | Google Fonts com 2 famílias/9 pesos via CSS externo | Considerar self-host com `font-display: swap` e subset latin; ganho de ~1 RTT no primeiro carregamento |
| Info | CWV de campo (LCP/INP/CLS reais) não medidos — sem acesso ao vivo nesta sessão | Rodar PageSpeed Insights / conferir CrUX no GSC |

## 6. Prontidão para Busca por IA (GEO) — 85/100

**O que está bom:**
- `robots.txt` permite todos os crawlers de IA (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot) — nenhum bloqueio.
- Conteúdo altamente citável: respostas autocontidas nas FAQs (64 perguntas), definições diretas no primeiro parágrafo dos posts, dados concretos (horários, endereço, sistemas ClearCorrect/Invisalign).
- Entidade consistente em todo o site + `sameAs` para Google Maps, Instagram e Doctoralia (sinal de entidade para LLMs).
- Seção transacional "onde fazer a avaliação" com `areaServed` — bom para consultas locais em AI Overviews/ChatGPT.

**Achados:**

| Severidade | Achado | Recomendação |
|---|---|---|
| Baixa | `/llms.txt` ausente | Criar por higiene/custo-zero — **nota da metodologia claude-seo:** a evidência atual (Mueller/Illyes, estudo SE Ranking de 300k domínios) mostra que llms.txt *não* é fator de citação hoje; presença é reportada sem peso na nota |
| Baixa | Nenhuma presença declarada em Wikidata/Wikipedia ou diretórios de autoridade além do Doctoralia | Ampliar citações: CRO-ES online, perfis de associações, GBP posts — fortalece o "entity graph" usado por LLMs |

## 7. Imagens — 82/100

**O que está bom:**
- ~98% das imagens com `alt` descritivo e localizado ("...na SORRIE+, em Vitória-ES") — ótimo para busca local.
- Todas as 26 imagens referenciadas existem no filesystem; `og:image` válido em todas as páginas.
- Nomes de arquivo descritivos (`dra-karine-scanner.webp`, `hero_reception_1920x960.jpg`).

**Achados:**

| Severidade | Achado | Recomendação |
|---|---|---|
| Média | Formatos legados: hero (248 KB JPG), antes/depois (102+115 KB JPEG), logos PNG (34–52 KB) | Converter para WebP/AVIF; logos para SVG quando possível (já existe `logo.svg`) |
| Baixa | ~1 imagem decorativa por página sem alt explícito | Usar `alt=""` deliberado em decorativas |

## 8. SEO Local

**O que está bom (não pontua categoria própria; distribui em Técnico/Schema/Conteúdo):**
- NAP 100% consistente nas 16 páginas (verificado por parser): `+55-27-99989-3314` / R. José Alexandre Buaiz, 160, Sala 901, Enseada do Suá, Vitória-ES, 29050-545.
- Mapa embed do Google, link "Como chegar", WhatsApp com mensagem pré-preenchida, telefone clicável (`tel:`), barra mobile fixa de conversão.
- `geo.position`/ICBM meta + `GeoCoordinates` no schema, coordenadas idênticas.
- Keywords locais nos titles dos pilares ("em Vitória ES", "Enseada do Suá") e naturalmente no corpo.
- 4 avaliações do Google exibidas com link para o perfil (46 avaliações, 5,0).

**Pendências fora do site (não auditáveis aqui):** consistência de citations em diretórios locais, categoria primária e posts do Google Business Profile, velocidade de resposta a reviews. Recomenda-se auditoria GBP separada (`/seo maps` com DataForSEO, ou manual).

---

## Arquivos desta auditoria

- `FULL-AUDIT-REPORT.md` — este relatório
- `ACTION-PLAN.md` — plano de ação priorizado
- `audit-data.json` — envelope estruturado (formato claude-seo, utilizável por `scripts/google_report.py --type full` para gerar PDF)
