# Hub de vídeos: o site toma a forma dos Reels — especificação de design

Data: 2026-09-09 · Status: aprovado em conversa, aguardando revisão do arquivo

> Este repositório é público. Esta especificação contém só decisões técnicas e editoriais.
> Métricas, alcance dos Reels e posição competitiva ficam no projeto de estratégia.

## 1. Objetivo

Fazer os Reels educativos do @sorriemais.vix existirem também como páginas do site, com o
vídeo hospedado em `sorriemais.com`, transcrição em texto e marcação `VideoObject`. Três
efeitos esperados:

1. Cada tema vira uma página citável por IAs (AI Overviews, ChatGPT, Perplexity), que
   citam páginas web e não Reels.
2. O Google recebe um link rastreável para cada Reel a partir de uma página já indexada,
   o que ajuda a indexação do próprio Reel.
3. As páginas com vídeo passam a aparecer no relatório "Vídeos" do Search Console, que
   hoje acusa páginas de vídeo não indexadas por falta de marcação.

O Instagram não é alterado por este projeto.

## 2. Escopo

### 2.1 Reels que entram e destino de cada um

| Reel (ID) | Tema | Destino |
|---|---|---|
| DPkXd6hkQYM | Trocar aparelho fixo por alinhador invisível | Artigo novo `blog/trocar-aparelho-fixo-por-alinhador-invisivel/` |
| DNRGH6yJjxs | Meu caso pode usar alinhador invisível? | Artigo novo `blog/meu-caso-pode-usar-alinhador-invisivel/` |
| DdCtZ54h8oe | Mounjaro e mau hálito | Artigo novo `blog/mounjaro-mau-halito/` |
| DcUZNY_pCmF | Pasta clareadora e carvão ativado | Artigo novo `blog/pasta-de-dente-clareadora-funciona/` |
| DboqdEmJ43d | Escova macia ou dura | Artigo novo `blog/escova-de-dente-macia-ou-dura/` |
| Da0-4O3h8eG | Alinhador invisível antes do casamento | Artigo novo `blog/alinhador-invisivel-antes-do-casamento/` |
| DOG6KUvEZyz | Alinhador invisível ou aparelho fixo | Vídeo dentro do post existente `blog/alinhador-invisivel-ou-aparelho-fixo/` |
| DOtShw1kaL7 | Clareamento | Vídeo dentro do post existente `blog/clareamento-no-alinhador-invisivel/` |
| DNUDkuFp_wh | Alinhadores: sem fios, sem metal | Vídeo no pilar `alinhadores-invisiveis-vitoria/` |

Regra de não duplicação: um tema tem uma única página. Se já existe post sobre o tema, o
vídeo entra nele. Só nasce artigo novo quando o tema não tem página.

### 2.2 Fora do escopo

- Reels de campanha com oferta, preço ou prazo, e Reels de antes e depois: vedados pelo
  compliance CFO adotado no `CLAUDE.md` e no briefing do curador de Instagram.
- Reels institucionais (recepção, bastidores): a home já tem o tour da clínica.
- Alteração do menu de navegação: ele é idêntico em todas as páginas; entra em fase futura.
- Player embutido do Instagram (iframe): rejeitado por peso no Lighthouse, ausência de
  `VideoObject` e dependência de terceiro.

### 2.3 Correção de carona

A home (`tour_clinica.mp4`, `promessa_valor.mp4`) e a página de facetas
(`lentes-de-contato.mp4`) já têm vídeo sem `VideoObject`. Recebem a marcação no mesmo lote,
sem mudar o HTML visível.

## 3. Arquitetura

Nada muda na stack: HTML estático, sem build, GitHub Pages. Quatro unidades:

| Unidade | O que faz | Depende de |
|---|---|---|
| Arquivos de mídia em `/videos/` | MP4 comprimido + poster por vídeo | ffmpeg |
| Bloco de vídeo (trecho HTML padrão) | Player, link para o Reel, transcrição | CSS/JS já existentes (`.vids`, `.vidcard`, `data-video`) |
| Marcação `VideoObject` + sitemap de vídeo | Torna o vídeo indexável e liga ao Reel | JSON-LD de cada página, `sitemap.xml` |
| Hub `/videos/` | Grade estilo Reels listando as páginas com vídeo | Cards com poster e título |

### 3.1 Arquivos de mídia

- Origem: download do próprio Reel público no Instagram, um por vez, com confirmação do
  William antes de cada lote (nome, origem e tamanho).
- Conversão com ffmpeg: H.264, 720p (720×1280), áudio AAC 96 kbps, `-movflags +faststart`,
  alvo de até 4 MB por arquivo. Nome: `/videos/<slug-do-post>.mp4`.
- Poster: frame escolhido do vídeo, exportado em WebP e JPG (`<slug>_poster.webp`,
  `<slug>_poster.jpg`), 720×1280, seguindo o padrão dos três vídeos existentes.
- Duração lida com ffprobe e gravada em ISO 8601 no `VideoObject` (ex.: `PT0M42S`).

### 3.2 Bloco de vídeo

Reutiliza o componente já existente na página de facetas (`div.vids > div.vidcard[data-video]`
com `video[preload="none"][data-poster]`, botão `.play` e `.vlabel`). Acréscimos:

```html
<div class="vids reveal d1 video-post" style="max-width:420px;margin-inline:auto;grid-template-columns:1fr">
  <div class="vidcard" data-video>
    <video preload="none" playsinline controls data-poster="/videos/<slug>_poster.jpg" style="aspect-ratio:9/16">
      <source src="/videos/<slug>.mp4" type="video/mp4">
    </video>
    <button class="play" aria-label="Reproduzir vídeo: <título>"><span class="circle"><svg …/></span></button>
    <span class="vlabel"><título curto></span>
  </div>
</div>
<p class="video-source">Vídeo publicado originalmente no Instagram da clínica.
  <a href="https://www.instagram.com/reel/<ID>/" rel="noopener">Ver no Instagram</a></p>
```

Posição: nos artigos novos, logo após o lead citável (primeiro parágrafo depois do H1).
Nos posts existentes e no pilar, na seção cujo assunto o vídeo responde.

Transcrição: seção própria, visível, com H2 "O que a Dra. Karine explica no vídeo" e o texto
falado em parágrafos curtos. Não usar `<details>`: conteúdo recolhido tem menos peso para
Google e IAs. A transcrição é fiel ao áudio, com limpeza só de vícios de fala.

### 3.3 Marcação estruturada

Em cada página com vídeo, dentro do `@graph` existente:

```json
{
  "@type": "VideoObject",
  "@id": "https://sorriemais.com/blog/<slug>/#video",
  "name": "<título em pergunta>",
  "description": "<lead citável>",
  "thumbnailUrl": ["https://sorriemais.com/videos/<slug>_poster.jpg"],
  "uploadDate": "<data de publicação no Instagram, ISO 8601>",
  "duration": "PT0M42S",
  "contentUrl": "https://sorriemais.com/videos/<slug>.mp4",
  "inLanguage": "pt-BR",
  "transcript": "<transcrição completa>",
  "publisher": { "@id": "https://sorriemais.com/#clinica" },
  "sameAs": "https://www.instagram.com/reel/<ID>/"
}
```

- O `BlogPosting` (ou `WebPage` do pilar) recebe `"video": { "@id": "…#video" }`.
- `sameAs` com a URL do Reel é a ligação explícita site → Reel.
- `sitemap.xml` passa a declarar `xmlns:video` e, nas páginas com vídeo, um bloco
  `<video:video>` com `thumbnail_loc`, `title`, `description`, `content_url`,
  `duration` e `publication_date`.
- Validação: `node -e 'JSON.parse(...)'` no JSON-LD e Teste de Pesquisa Aprimorada do
  Google após publicar.

### 3.4 Hub `/videos/`

- URL `https://sorriemais.com/videos/`, arquivo `videos/index.html`. A pasta já guarda os
  MP4; a página convive com eles.
- H1: "Vídeos da Dra. Karine: respostas rápidas sobre alinhadores, facetas e saúde bucal".
- Lead de duas frases explicando que são os vídeos do Instagram da clínica com a resposta
  completa em texto em cada página.
- Grade de três colunas no desktop e duas no mobile, cards 9:16 com poster, título em
  pergunta, duração e link para a página. Ordem: mais recente primeiro.
- JSON-LD: `CollectionPage` + `ItemList` referenciando cada `VideoObject` pelo `@id`, mais o
  bloco `Dentist` padrão.
- Entradas: link no topo de `/blog/`, link na home na seção que apresenta o blog, linha no
  `llms.txt`, URL no `sitemap.xml`. Nav e footer permanecem como estão.
- Metadados conforme contrato por página do `CLAUDE.md` (title ≤60, description ≤155,
  canonical, og/twitter).

## 4. Regras editoriais para os artigos novos

Seguem integralmente o contrato por página e os padrões GEO do `CLAUDE.md`:

- Título em forma de pergunta de busca; lead citável de 2–3 frases que responde à pergunta.
- Vídeo logo após o lead; transcrição em seção própria.
- H2s como perguntas reais; tabela comparativa quando o tema compara opções (aparelho fixo
  vs alinhador; pasta comum vs clareadora vs carvão; escova dura vs macia vs extra macia).
- FAQ com paridade exata entre HTML e `FAQPage`.
- Passagem transacional "Onde fazer a avaliação de … em Vitória?" com SORRIE+, Enseada do
  Suá e endereço na mesma frase, redação variada entre posts.
- Autoria e revisão: Dra. Karine Marinho Ribeiro, CRO-ES 10983. Datas coerentes nas três
  fontes (byline, `dateModified`, `lastmod`).
- Links recíprocos: post → pilar e `/dra-karine-marinho/`; pilar → post; card no `/blog/`
  no topo da grade; posição nova no fim do `ItemList` do blog.
- Compliance CFO: sem promessa de resultado, sem "sem dor", sem preço, sem superlativo.
  No tema Mounjaro, falar de efeito possível e acompanhamento, sem prescrever ou desaconselhar
  o medicamento.

## 5. Fluxo de produção por vídeo

1. Baixar o Reel (confirmação do William por lote).
2. Converter e gerar poster com ffmpeg; ler duração com ffprobe.
3. Transcrever o áudio com `faster-whisper` (modelo `small`, pt-BR) instalado localmente
   via pip, com aprovação prévia. Revisão humana da transcrição.
4. Checagem de compliance da transcrição. Frase vedada no áudio tira o vídeo do lote; a
   transcrição não é reescrita para "passar".
5. `editor-seo` escreve ou edita a página; `humanizador` revisa o texto; `verificador`
   roda JSON-LD, paridade FAQ, links, datas e sitemap. PASS obrigatório.
6. Lighthouse CI local (`lighthouserc.json`) na página nova.
7. William revisa o diff no GitHub Desktop e publica. Nenhum commit é feito pelo assistente.
8. Após publicar: solicitar indexação das páginas alteradas no GSC e acompanhar os
   relatórios "Vídeos" e da propriedade do Instagram.

Ordem dos lotes:

- Lote 1 (infraestrutura + 3 páginas): bloco de vídeo, `VideoObject` nas 3 páginas antigas,
  sitemap com namespace de vídeo, hub `/videos/`, e os artigos de Mounjaro, trocar aparelho
  fixo por alinhador e escova.
- Lote 2: pasta clareadora, casamento, meu caso pode usar alinhador.
- Lote 3: vídeos nos posts existentes e no pilar.

## 6. Tratamento de erros e riscos

| Risco | Tratamento |
|---|---|
| Download do Reel falha ou vídeo é privado | Pular o vídeo, registrar no relatório do lote, seguir com os demais |
| `faster-whisper` não instala ou transcreve mal | William fornece o texto falado, ou usa-se a legenda automática do Instagram como base para revisão |
| Áudio contém frase vedada pelo CFO | Vídeo sai do lote; página do tema pode existir sem vídeo |
| MP4 acima de 4 MB após conversão | Reduzir bitrate; se ainda passar, 540p |
| Lighthouse cai na página nova | `preload="none"` já evita download; checar poster em WebP e tamanho |
| GSC continua acusando vídeo não indexado | Conferir proeminência do player (acima da dobra) e validar `VideoObject` no Teste de Pesquisa Aprimorada |

## 7. Verificação de sucesso

- `verificador` PASS em todas as páginas do lote.
- JSON-LD válido; `VideoObject` reconhecido no Teste de Pesquisa Aprimorada.
- Zero links internos quebrados; sitemap válido com namespace de vídeo.
- Em 2 a 4 semanas após publicar: páginas novas indexadas no GSC; relatório "Vídeos" sem
  as páginas antigas como não indexadas; impressões novas na propriedade do Instagram para
  os Reels ligados.
