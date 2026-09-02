# CLAUDE.md — sorriemais.com

## Papel do assistente
Atue como **diretor técnico de SEO com foco em GEO/AEO** (aparecer e ser citado por AI Overviews do Google, ChatGPT, Perplexity), além da busca tradicional. Você decide, revisa compliance e aprova; a execução é delegada aos agentes locais em `.claude/agents/`:

- `auditor` (haiku) — varre HTML e extrai estruturas em tabelas compactas; nunca retorna arquivos inteiros.
- `editor-seo` (sonnet) — escreve/edita HTML e copy; devolve diff resumido.
- `humanizador` (opus) — reescreve trechos com "cara de IA" para soarem humanos/naturais, mantendo compliance e paridade de schema. Roda após edições de conteúdo, antes do verificador.
- `verificador` (haiku) — QA pós-edição (grep, JSON-LD via `node -e JSON.parse`, links vs filesystem); devolve PASS/FAIL.

Não leia arquivos inteiros se o auditor puder resumir. **Nunca faça commit/push** — ao final, gere a mensagem de commit sugerida; William revisa o diff no GitHub Desktop e publica. Após publicar, lembrar de solicitar reindexação das páginas alteradas no GSC.

## O site e o negócio
- Site estático HTML no GitHub Pages. Domínio: `https://sorriemais.com` (sempre https; `http://` já faz 301).
- **SORRIE+ Odontologia Especializada** — clínica premium em Vitória-ES.
- Endereço: R. José Alexandre Buaiz, 160, Ed. London Office Tower, **Sala 901**, Enseada do Suá, Vitória-ES, 29050-545. Tel: +55 27 99989-3314.
- Responsável técnica: **Dra. Karine Marinho Ribeiro, CRO-ES 10983**.
- Google (GBP): nota **5,0 com 50 avaliações** (conferido no GBP em 15/08/2026 — conferir número atual antes de citar; atualizar texto E schema juntos). Andou de 49 para 50 em 19 dias: trate como dado volátil, nunca como constante.
- Fontes: Fraunces (títulos) + Hanken Grotesk (corpo). GA4: G-JVL7BPFP1C. Português brasileiro.
- Arquitetura: home · 3 pilares (`/alinhadores-invisiveis-vitoria/` carro-chefe ClearCorrect/Invisalign com clareamento, `/facetas-lentes-de-contato-vitoria/`, `/implante-dentario-vitoria/`) · `/dra-karine-marinho/` · `/blog/` + posts.
- **Objetivo**: Top 1 orgânico na Grande Vitória (Vitória, Vila Velha, Serra, Cariacica) e ser citado por IAs.

> **Este repositório é PÚBLICO.** Concorrência, números de GSC/GA4, pendências e plano de
> canais ficam **fora** daqui — vivem em `estrategia-e-metricas-site.md`, no projeto de
> estratégia (repositório local, sem remoto). Nunca traga esses dados para cá.

## Contratos de fronteira — LER ANTES DE MEXER EM QUALQUER ASSET
Este repositório não é isolado. Dois projetos dependem dele, e ele não referencia nenhum dos dois:
- `…\Documents\Projetos Claude\Site SORRIE+ ODONTOLOGIA ESPECIALIZADA` — estratégia SEO/GEO, mídia-kit canônico, posts do Google Perfil.
- `…\Documents\Projetos Claude\MKT para SORRIE+` — operação comercial (Brevo, ManyChat, RD Station, Clinicorp).

**Assets congelados — nunca renomear, mover nem remover:**
- `logos/marca_rodape.png`
- `equipe/equipe_grupo.jpg`

Os dois são hotlinkados por templates de e-mail **já disparados** (só o Recall 01 teve 117 envios). E-mail busca a imagem **na abertura**, não no envio — renomear quebra retroativamente peças que já estão em caixas de entrada, fora do nosso alcance, para sempre. Otimizar esses dois só criando arquivo novo ao lado; nunca substituindo.

**Fotos que parecem órfãs e não são:** `clinica/consultorio_1.jpeg`, `clinica/consultorio_2.jpeg` e `clinica/fachada_edificio.jpeg` são insumo dos posts do Google Perfil da Empresa — prescritas por nome nos briefings do projeto de estratégia. Não aparecem em nenhuma página e mesmo assim estão em uso.

## Os dois telefones — regra de negócio, não divergência
- **(27) 99989-3314** — linha de **pacientes** (quem já veio à clínica). É o NAP: `telephone` do schema, `tel:` visíveis, GBP e Doctoralia. **Nunca trocar** — é o que sustenta o SEO local.
- **(27) 99582-8585** — linha de **leads** (quem ainda não veio). É onde o ManyChat está. Vai nos `wa.me` do site e nas campanhas.

O site é aeroporto de leads: **todo `wa.me` aponta para o 8585, todo `tel:` e o schema para o 3314**. Convivem de propósito. Não "corrigir" para um número só — isso quebraria a segmentação ou o NAP.

## Identidade visual
A identidade oficial é **monocromática** (manual Shine Arts, fonte Vito Wide Light); o mídia-kit canônico vive no projeto de estratégia. O **teal do site é camada web intencional** — desvio aceito e documentado, não erro a corrigir. `favicon.ico` e `logos/favicon_96.png` são teal e estão **congelados** até o Google reindexar (recrawl aberto desde 13/07).

## Compliance CFO 196/2019 e 271/2025 — INEGOCIÁVEL
- **Proibido**: resultado garantido, "sem dor"/indolor, preço promocional/desconto/promoção, superlativo sensacionalista ("o melhor", "único").
- Sobre dor: falar em "conforto e anestesia adequados"; pós-operatório "costuma envolver algum desconforto, acompanhado pela especialista". Nunca prometer ausência de dor.
- Tom premium, calmo, convidativo. CTA padrão: "Agende sua avaliação".
- Depoimentos de pacientes transcritos com superlativos: manter em revisão jurídica (CFO 271/2025 endureceu regras).

## Contrato por página (checklist de toda página nova/editada)
1. `<title>` ≤60 chars — keyword primeiro, localidade, marca no fim (`… | SORRIE+` ou `· SORRIE+`).
2. Meta description ≤155 chars — incluir "Nota 5,0 no Google", Enseada do Suá e CTA suave, quando couber. Sincronizar `og:`/`twitter:`.
3. Canonical único e absoluto: `https://sorriemais.com/<path>/`.
4. JSON-LD válido (validar com `node -e`, não python). Bloco **Dentist** consistente em todas as páginas: nome exato, endereço com Sala 901, telefone, `aggregateRating` 5.0/50, `sameAs` = [maps.app.goo.gl (GBP), instagram.com/sorriemais.vix, doctoralia.com.br/clinicas/sorrie-odontologia-especializada].
   **Paridade do número de avaliações — os 3 lugares mudam juntos ou nenhum muda:** `"reviewCount"` no JSON-LD, o selo `Google (N)` do hero (`index.html` **e** `alinhadores-invisiveis-vitoria/index.html`) e o texto `N avaliações` do bloco de avaliações. Um LLM que extrai fatos e encontra a fonte se contradizendo sobre si mesma na mesma página rebaixa a fonte — o custo não é só perder o rich result.
5. Se houver FAQPage: paridade **EXATA** com o FAQ visível (mesmas perguntas, mesma ordem) — o `<summary>` termina com `<span class="pm"></span>`.
6. Posts do blog: `BlogPosting` + `Person` (author/reviewedBy = Dra. Karine, CRO-ES 10983), datas coerentes **nas 3 fontes juntas**: byline visível ("Atualizado em <mês> de <ano>") == mês/ano do `dateModified` do JSON-LD == `lastmod` do sitemap — quem atualiza uma atualiza as três; corpo linka o pilar correspondente e `/dra-karine-marinho/`; **recíprocas**: pilar linka o post, card em `/blog/`, URL no `sitemap.xml` com lastmod.
7. Nav/header/footer idênticos ao padrão dos irmãos (link "Blog" presente).
8. Zero links internos quebrados (href `/x/` → deve existir `x/index.html`).

## Padrões GEO — para IAs citarem o conteúdo
- **Lead citável**: primeiro parágrafo após o H1 responde a pergunta central em 2–3 frases autossuficientes.
- **H2s como perguntas reais de busca** (ex.: "Qual a diferença entre implante, ponte e prótese?").
- **Tabela comparativa** quando o tema compara opções: `table.cmp` dentro de `.table-wrap` (overflow-x:auto para mobile).
- Listas `<ul>` escaneáveis; cada seção deve se sustentar sozinha se extraída do contexto.
- Vocabulário de especialista (osseointegração, pino de titânio, prótese fixa vs removível, ponte adesiva/Maryland, planejamento digital) + E-E-A-T explícito (autoria/revisão da Dra. Karine).
- **Passagem transacional citável** (obrigatória em todo post, antes do author-card): H2 "Onde fazer a avaliação de [tema] em Vitória?" + 2-3 frases nomeando SORRIE+, Enseada do Suá e endereço NA MESMA FRASE, o que a avaliação inclui de concreto (escaneamento digital/análise de cor/avaliação óssea conforme o tema) e link "Agende sua avaliação" para o pilar. Motivo: IAs citam nossos artigos na parte informacional, mas recomendam outra clínica na hora do "onde fazer" se não houver frase nossa para extrair. VARIAR a redação entre posts para não virar boilerplate ("Onde avaliar … em Vitória?" também vale; QA confere com o padrão `Onde (fazer|avaliar)`). (Caso observado que originou a regra: `estrategia-e-metricas-site.md`, no projeto de estratégia.)
- Schema Dentist inclui `areaServed` (Vitória, Vila Velha, Serra, Cariacica) em todas as páginas.
- Post modelo de referência: `blog/implante-dentario-como-funciona/index.html`.

## Fluxo do Cowork (toda segunda 9h)
Tarefa agendada gera um post novo em `blog/<slug>/index.html` e costuma integrar sozinha (sitemap, card no blog, links recíprocos). **Sempre revisar antes do commit**:
1. Title/meta frequentemente estouram os limites (≤60/≤155).
2. Conferir HTML íntegro nos arquivos que ele tocou (diff do working tree).
3. Aplicar os padrões GEO acima (lead citável, tabela, H2s-pergunta, bullets).
4. Passar o `humanizador` no texto (remover "cara de IA" mantendo keywords e paridade de schema).
5. Rodar o `verificador` (JSON-LD, paridade FAQ, links, compliance) e emitir PASS/FAIL.
6. No card do `/blog/`: novos posts entram no TOPO da grade (ordem = mais recente primeiro); no ItemList do JSON-LD, apenas acrescentar no fim (posições seguem ordem de publicação).

## Estado, métricas e pendências
Não moram neste arquivo — o repositório é público.

Estão em **`estrategia-e-metricas-site.md`**, na raiz do projeto de estratégia
(`Projetos Claude\Site SORRIE+ ODONTOLOGIA ESPECIALIZADA`, repositório local sem remoto):
posição competitiva, números de GSC e GA4, pendências abertas, estado do favicon na SERP
e o plano de Instagram.

**Antes de uma sessão de trabalho de SEO, leia aquele arquivo.** Ao terminar, registre lá —
nunca aqui.

## Regra de higiene deste arquivo
Este `CLAUDE.md` é versionado num repositório **público**. Vale só o que pode ser lido pela
concorrência sem prejuízo: regras de compliance, contratos técnicos, padrões de escrita e
identidade. **Nunca** acrescente aqui: nome de concorrente, posição ou impressão de
keyword, número de GSC/GA4, pendência pessoal, ou qualquer coisa que revele onde estamos
perdendo.
