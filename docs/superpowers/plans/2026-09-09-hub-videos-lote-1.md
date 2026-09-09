# Hub de vídeos — Lote 1 — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Colocar no site a infraestrutura de vídeo (arquivos, bloco HTML, `VideoObject`, sitemap de vídeo, hub `/videos/`) e três artigos novos com vídeo: Mounjaro e mau hálito, escova macia ou dura, trocar aparelho fixo por alinhador invisível.

**Architecture:** Site estático HTML no GitHub Pages, sem build. Cada página com vídeo reutiliza o componente `.vids > .vidcard[data-video]` já existente (poster adiado pelo `main.js`), ganha um nó `VideoObject` no `@graph` do JSON-LD e uma entrada `<video:video>` no sitemap. O hub `/videos/` é uma página estática com grade 9:16 que lista essas páginas.

**Tech Stack:** HTML/CSS/JS puro · ffmpeg 8 + ffprobe (instalados via winget) · Python 3.12 com `faster-whisper` (instalado) e `yt-dlp` (instalar) · Node 24 para validar JSON-LD · PowerShell 7 para validar XML · Lighthouse CI (`lighthouserc.json`).

**Spec:** `docs/superpowers/specs/2026-09-09-hub-videos-reels-design.md`

## Global Constraints

- Repositório público: nenhum número de GSC/GA4, alcance de Reel ou nome de concorrente entra em arquivo do repo.
- **Nenhum commit pelo assistente.** Cada tarefa termina com verificação e mensagem de commit sugerida; William revisa no GitHub Desktop e publica.
- Compliance CFO 196/2019 e 271/2025: proibido resultado garantido, "sem dor"/indolor, preço/promoção/desconto, superlativo ("o melhor", "único"). Transcrição fiel ao áudio; frase vedada no áudio tira o vídeo do lote.
- Contrato por página do `CLAUDE.md`: `<title>` ≤60 chars; meta description ≤155 chars; canonical absoluto `https://sorriemais.com/<path>/`; JSON-LD validado com `node -e`; bloco `Dentist` idêntico ao dos irmãos (`reviewCount` "50"); FAQ com paridade exata HTML ↔ `FAQPage`; datas coerentes nas 3 fontes (byline visível, `dateModified`, `lastmod`); nav/header/footer idênticos aos irmãos; zero links internos quebrados.
- Padrões GEO: lead citável de 2–3 frases após o H1; H2s como perguntas; tabela `table.cmp` dentro de `.table-wrap` quando compara opções; passagem transacional "Onde (fazer|avaliar) … em Vitória?" com SORRIE+, Enseada do Suá e endereço na mesma frase; autoria Dra. Karine Marinho Ribeiro, CRO-ES 10983.
- Telefones: todo `wa.me` → `5527995828585`; todo `tel:` e o schema → `+55-27-99989-3314`.
- Vídeo: `preload="none"`, poster em `data-poster` (WebP), MP4 H.264 720×1280 ≤ 4 MB, `-movflags +faststart`. `thumbnailUrl` do schema em JPG.
- Data de publicação das páginas novas: `2026-09-09`. Se William publicar em outro dia, trocar nas três fontes juntas (byline "setembro de 2026" continua válida no mesmo mês).
- Pastas de trabalho não versionadas: `videos/raw/` (originais, transcrições). Entra no `.gitignore` na Tarefa 1.

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `.gitignore` | Modificar | Ignorar `videos/raw/` |
| `videos/raw/*` | Criar (ignorado) | Reels originais, transcrições `.txt`, `duracoes.txt` |
| `videos/mounjaro-mau-halito.mp4` + `_poster.webp` + `_poster.jpg` | Criar | Mídia do artigo 1 |
| `videos/escova-de-dente-macia-ou-dura.mp4` + posters | Criar | Mídia do artigo 2 |
| `videos/trocar-aparelho-fixo-por-alinhador-invisivel.mp4` + posters | Criar | Mídia do artigo 3 |
| `index.html` | Modificar | `VideoObject` ×2 (tour, abordagem) + link para `/videos/` |
| `facetas-lentes-de-contato-vitoria/index.html` | Modificar | `VideoObject` (prova de lentes) |
| `sitemap.xml` | Modificar | namespace `video`, entradas de vídeo, URLs novas |
| `blog/mounjaro-mau-halito/index.html` | Criar | Artigo 1 |
| `blog/escova-de-dente-macia-ou-dura/index.html` | Criar | Artigo 2 |
| `blog/trocar-aparelho-fixo-por-alinhador-invisivel/index.html` | Criar | Artigo 3 |
| `blog/index.html` | Modificar | 3 cards no topo, 3 posições no `ItemList`, link para `/videos/` |
| `alinhadores-invisiveis-vitoria/index.html` | Modificar | Link recíproco para o artigo 3 |
| `videos/index.html` | Criar | Hub |
| `llms.txt` | Modificar | Contagem de artigos e linha do hub |

---

### Task 1: Ferramentas, download dos três Reels e duração

**Files:**
- Modify: `.gitignore`
- Create (ignorado): `videos/raw/mounjaro-mau-halito.orig.mp4`, `videos/raw/escova-de-dente-macia-ou-dura.orig.mp4`, `videos/raw/trocar-aparelho-fixo-por-alinhador-invisivel.orig.mp4`

**Interfaces:**
- Produces: três arquivos `.orig.mp4` e as durações em segundos anotadas em `videos/raw/duracoes.txt` no formato `<slug> <segundos>` (uma linha por vídeo).

- [ ] **Step 1: Ignorar a pasta de originais**

Anexar ao fim de `.gitignore`:

```
# Originais dos Reels e transcrições — insumo local, nunca versionar
videos/raw/
```

- [ ] **Step 2: Instalar o yt-dlp (pedir ok ao William antes, é instalação no sistema)**

Run: `py -m pip install yt-dlp`
Expected: última linha `Successfully installed yt-dlp-…`

- [ ] **Step 3: Pedir confirmação de download**

Antes de baixar, apresentar ao William a lista: origem `https://www.instagram.com/reel/<ID>/`, nome de destino e tamanho estimado (Reels de 30–90 s ficam entre 2 e 12 MB). Só seguir com o "sim".

- [ ] **Step 4: Baixar os três Reels (sem cookies; são públicos)**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie" && mkdir -p videos/raw
py -m yt_dlp -f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b" -o "videos/raw/mounjaro-mau-halito.orig.%(ext)s" "https://www.instagram.com/reel/DdCtZ54h8oe/"
py -m yt_dlp -f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b" -o "videos/raw/escova-de-dente-macia-ou-dura.orig.%(ext)s" "https://www.instagram.com/reel/DboqdEmJ43d/"
py -m yt_dlp -f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b" -o "videos/raw/trocar-aparelho-fixo-por-alinhador-invisivel.orig.%(ext)s" "https://www.instagram.com/reel/DPkXd6hkQYM/"
```

Expected: três arquivos `.orig.mp4` em `videos/raw/`. Se o Instagram recusar ("login required"), parar e perguntar ao William se autoriza `--cookies-from-browser chrome` (usa a sessão do navegador dele) ou se prefere enviar os arquivos.

- [ ] **Step 5: Verificar e registrar durações**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie/videos/raw" && : > duracoes.txt
for s in mounjaro-mau-halito escova-de-dente-macia-ou-dura trocar-aparelho-fixo-por-alinhador-invisivel; do
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$s.orig.mp4"); echo "$s $d" >> duracoes.txt
done; cat duracoes.txt; ls -la *.orig.mp4
```

Expected: três linhas com número de segundos > 5; três arquivos com tamanho > 0.

- [ ] **Step 6: Checkpoint**

`git status` deve mostrar só `.gitignore` modificado (a pasta `videos/raw/` não aparece). Mensagem sugerida: `chore: ignora videos/raw (originais dos Reels)`.

---

### Task 2: Conversão para o site e posters

**Files:**
- Create: `videos/mounjaro-mau-halito.mp4`, `videos/mounjaro-mau-halito_poster.webp`, `videos/mounjaro-mau-halito_poster.jpg`
- Create: `videos/escova-de-dente-macia-ou-dura.mp4` + `_poster.webp` + `_poster.jpg`
- Create: `videos/trocar-aparelho-fixo-por-alinhador-invisivel.mp4` + `_poster.webp` + `_poster.jpg`

**Interfaces:**
- Consumes: `videos/raw/<slug>.orig.mp4` (Task 1)
- Produces: para cada slug, `videos/<slug>.mp4` (≤ 4 MB, 720×1280), `videos/<slug>_poster.webp` (≤ 60 KB) e `videos/<slug>_poster.jpg` (720×1280). Duração ISO 8601 anotada em `videos/raw/duracoes.txt` como terceira coluna (ex.: `PT0M42S`).

- [ ] **Step 1: Converter os três vídeos**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie"
for s in mounjaro-mau-halito escova-de-dente-macia-ou-dura trocar-aparelho-fixo-por-alinhador-invisivel; do
  ffmpeg -y -i "videos/raw/$s.orig.mp4" -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" \
    -c:v libx264 -profile:v high -level 4.0 -preset slow -crf 26 -pix_fmt yuv420p \
    -c:a aac -b:a 96k -ac 2 -movflags +faststart "videos/$s.mp4"
done; ls -la videos/*.mp4
```

Expected: três MP4 novos. Se algum passar de 4.000.000 bytes, reconverter só ele com `-crf 29`; se ainda passar, com `scale=540:960` e `pad=540:960`.

- [ ] **Step 2: Gerar posters (frame aos 1,5 s, que evita a tela preta inicial)**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie"
for s in mounjaro-mau-halito escova-de-dente-macia-ou-dura trocar-aparelho-fixo-por-alinhador-invisivel; do
  ffmpeg -y -ss 1.5 -i "videos/$s.mp4" -frames:v 1 -q:v 3 "videos/${s}_poster.jpg"
  ffmpeg -y -ss 1.5 -i "videos/$s.mp4" -frames:v 1 -c:v libwebp -quality 72 "videos/${s}_poster.webp"
done; ls -la videos/*_poster.*
```

Expected: seis arquivos; cada `.webp` abaixo de 60 KB. Abrir os três JPG e conferir que o quadro mostra a Dra. Karine ou o objeto do vídeo, não um frame borrado; se estiver ruim, trocar `-ss 1.5` por `-ss 3` naquele vídeo.

Gerar também o WebP que falta para o poster antigo das lentes (o hub da Task 8 usa e o Lighthouse exige formato moderno):

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie" && ffmpeg -y -i videos/lentes-de-contato_poster.jpg -c:v libwebp -quality 72 videos/lentes-de-contato_poster.webp && ls -la videos/lentes-de-contato_poster.webp
```

Expected: arquivo criado, abaixo de 60 KB. Não tocar no JPG nem na página de facetas.

- [ ] **Step 3: Converter durações para ISO 8601**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie/videos/raw"
while read s d; do m=$(printf '%d' "${d%.*}"); printf '%s %s PT%dM%dS\n' "$s" "$d" $((m/60)) $((m%60)); done < duracoes.txt > duracoes.iso.txt && mv duracoes.iso.txt duracoes.txt && cat duracoes.txt
```

Expected: três linhas no formato `slug segundos PTxMyS`.

- [ ] **Step 4: Verificar dimensões e tamanho**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie"
for f in videos/mounjaro-mau-halito.mp4 videos/escova-de-dente-macia-ou-dura.mp4 videos/trocar-aparelho-fixo-por-alinhador-invisivel.mp4; do
  echo "$f $(stat -c%s "$f") bytes $(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$f")"
done
```

Expected: cada linha com `bytes` ≤ 4000000 e `720,1280` (ou `540,960` se houve fallback).

- [ ] **Step 5: Checkpoint**

`git status` mostra 10 arquivos novos em `videos/` (9 do lote + o WebP das lentes). Mensagem sugerida: `feat: mídia dos três Reels do lote 1 (MP4 720p + posters)`.

---

### Task 3: Transcrição e checagem de compliance

**Files:**
- Create (ignorado): `videos/raw/<slug>.txt` para os três slugs

**Interfaces:**
- Consumes: `videos/<slug>.mp4` (Task 2)
- Produces: `videos/raw/<slug>.txt` com a transcrição revisada em parágrafos curtos, sem marcas de tempo, pronta para colar no HTML e no campo `transcript`.

- [ ] **Step 1: Transcrever com faster-whisper**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie"
py - <<'EOF'
from faster_whisper import WhisperModel
model = WhisperModel("small", device="cpu", compute_type="int8")
for s in ["mounjaro-mau-halito","escova-de-dente-macia-ou-dura","trocar-aparelho-fixo-por-alinhador-invisivel"]:
    segs, info = model.transcribe(f"videos/{s}.mp4", language="pt", vad_filter=True)
    txt = " ".join(seg.text.strip() for seg in segs)
    open(f"videos/raw/{s}.txt","w",encoding="utf-8").write(txt+"\n")
    print(s, len(txt), "chars")
EOF
```

Expected: três linhas `slug N chars` com N > 100. Na primeira execução o modelo `small` é baixado (~460 MB).

- [ ] **Step 2: Revisar cada transcrição**

Abrir cada `videos/raw/<slug>.txt`, ouvir o vídeo e corrigir nomes próprios (Mounjaro, tirzepatida, ClearCorrect, Invisalign), remover "né", "tipo", repetições, e quebrar em parágrafos de 2–3 frases. Manter o sentido. Não acrescentar frases que não foram ditas.

- [ ] **Step 3: Checar termos vedados na fala**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie"
grep -n -i -E "sem dor|indolor|garant|promo|desconto|o melhor|a melhor|único|única|100%|resultado certo" videos/raw/*.txt || echo "OK: sem termos vedados"
```

Expected: `OK: sem termos vedados`. Se aparecer ocorrência, registrar o trecho e a decisão: o vídeo sai do lote (a página do tema pode seguir sem vídeo) e o plano continua com os demais.

- [ ] **Step 4: Checkpoint**

Nada a commitar (pasta ignorada). Registrar no chat as três transcrições finais para o William ler.

---

### Task 4: `VideoObject` nas páginas que já têm vídeo e sitemap com namespace de vídeo

**Files:**
- Modify: `index.html` (JSON-LD `@graph`, nó `WebPage` `https://sorriemais.com/#webpage`)
- Modify: `facetas-lentes-de-contato-vitoria/index.html` (JSON-LD `@graph`, nó `MedicalWebPage` `…/facetas-lentes-de-contato-vitoria/#webpage`)
- Modify: `sitemap.xml`

**Interfaces:**
- Produces: padrão de nó `VideoObject` e de bloco `<video:video>` que as Tasks 5–8 repetem.

- [ ] **Step 1: Teste de estado inicial (deve falhar)**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie"
grep -c '"VideoObject"' index.html facetas-lentes-de-contato-vitoria/index.html; grep -c 'xmlns:video' sitemap.xml
```

Expected: `0`, `0`, `0`.

- [ ] **Step 2: Acrescentar os nós `VideoObject` na home**

Em `index.html`, dentro do array `@graph`, antes do nó `"@type": "WebPage"` (linha ~150), inserir:

```json
    {
      "@type": "VideoObject",
      "@id": "https://sorriemais.com/#video-tour",
      "name": "Tour pela clínica SORRIE+ na Enseada do Suá",
      "description": "Um tour pela estrutura da SORRIE+ Odontologia Especializada, no Ed. London Office Tower, Enseada do Suá, Vitória-ES.",
      "thumbnailUrl": ["https://sorriemais.com/videos/tour_clinica_poster.jpg"],
      "uploadDate": "2026-07-01",
      "contentUrl": "https://sorriemais.com/videos/tour_clinica.mp4",
      "inLanguage": "pt-BR",
      "publisher": { "@id": "https://sorriemais.com/#clinica" }
    },
    {
      "@type": "VideoObject",
      "@id": "https://sorriemais.com/#video-abordagem",
      "name": "Nossa abordagem: como a SORRIE+ conduz a avaliação",
      "description": "A Dra. Karine Marinho Ribeiro explica como a clínica conduz a avaliação e o plano de tratamento personalizado.",
      "thumbnailUrl": ["https://sorriemais.com/videos/promessa_valor_poster.jpg"],
      "uploadDate": "2026-07-01",
      "contentUrl": "https://sorriemais.com/videos/promessa_valor.mp4",
      "inLanguage": "pt-BR",
      "publisher": { "@id": "https://sorriemais.com/#clinica" }
    },
```

Depois, no nó `WebPage` da home, acrescentar a propriedade:

```json
      "video": [ { "@id": "https://sorriemais.com/#video-tour" }, { "@id": "https://sorriemais.com/#video-abordagem" } ],
```

Duração: obter com `ffprobe -v error -show_entries format=duration -of csv=p=0 videos/tour_clinica.mp4` (e `promessa_valor.mp4`), converter para `PTxMyS` e acrescentar `"duration": "PTxMyS",` em cada nó.

- [ ] **Step 3: Acrescentar o nó `VideoObject` na página de facetas**

Em `facetas-lentes-de-contato-vitoria/index.html`, antes do nó `"@type": "MedicalWebPage"` (linha ~156), inserir:

```json
    {
      "@type": "VideoObject",
      "@id": "https://sorriemais.com/facetas-lentes-de-contato-vitoria/#video-prova",
      "name": "Prova de lentes de contato dental na SORRIE+",
      "description": "Momento da prova de lentes de contato dental em porcelana, com autorização da paciente por TCLE. Os resultados variam conforme cada caso.",
      "thumbnailUrl": ["https://sorriemais.com/videos/lentes-de-contato_poster.jpg"],
      "uploadDate": "2026-07-01",
      "contentUrl": "https://sorriemais.com/videos/lentes-de-contato.mp4",
      "inLanguage": "pt-BR",
      "publisher": { "@id": "https://sorriemais.com/#clinica" }
    },
```

E no nó `MedicalWebPage`, acrescentar `"video": { "@id": "https://sorriemais.com/facetas-lentes-de-contato-vitoria/#video-prova" },`. Duração via ffprobe como no passo anterior.

- [ ] **Step 4: Reescrever o cabeçalho do sitemap e as três entradas**

Trocar a linha 2 de `sitemap.xml` por:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
```

Trocar a entrada da home por (mantendo o `lastmod` atual `2026-08-18` até a Task 8 mudar):

```xml
  <url><loc>https://sorriemais.com/</loc><lastmod>2026-08-18</lastmod><changefreq>monthly</changefreq><priority>1.0</priority>
    <video:video><video:thumbnail_loc>https://sorriemais.com/videos/tour_clinica_poster.jpg</video:thumbnail_loc><video:title>Tour pela clínica SORRIE+ na Enseada do Suá</video:title><video:description>Um tour pela estrutura da SORRIE+ Odontologia Especializada, no Ed. London Office Tower, Enseada do Suá, Vitória-ES.</video:description><video:content_loc>https://sorriemais.com/videos/tour_clinica.mp4</video:content_loc><video:duration>SEGUNDOS_TOUR</video:duration><video:publication_date>2026-07-01</video:publication_date></video:video>
    <video:video><video:thumbnail_loc>https://sorriemais.com/videos/promessa_valor_poster.jpg</video:thumbnail_loc><video:title>Nossa abordagem: como a SORRIE+ conduz a avaliação</video:title><video:description>A Dra. Karine Marinho Ribeiro explica como a clínica conduz a avaliação e o plano de tratamento personalizado.</video:description><video:content_loc>https://sorriemais.com/videos/promessa_valor.mp4</video:content_loc><video:duration>SEGUNDOS_ABORDAGEM</video:duration><video:publication_date>2026-07-01</video:publication_date></video:video>
  </url>
```

`SEGUNDOS_TOUR` e `SEGUNDOS_ABORDAGEM` são os inteiros do ffprobe do Step 2. Fazer o mesmo na entrada de facetas com o vídeo `lentes-de-contato` (título e descrição do Step 3).

- [ ] **Step 5: Validar JSON-LD e XML**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie"
for f in index.html facetas-lentes-de-contato-vitoria/index.html; do
  node -e "const h=require('fs').readFileSync('$f','utf8');const m=[...h.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)];m.forEach((x,i)=>{JSON.parse(x[1]);});console.log('$f JSON-LD OK ('+m.length+' blocos)')"
done
grep -c '"VideoObject"' index.html facetas-lentes-de-contato-vitoria/index.html
```

Expected: `index.html JSON-LD OK`, `facetas… JSON-LD OK`, contagens `2` e `1`.

PowerShell (validação do XML):

```powershell
[xml]$x = Get-Content "C:\Users\Liga Vitória\Documents\GitHub\site-sorrie\sitemap.xml" -Raw; $x.urlset.url.Count; ($x.urlset.url | Where-Object { $_.video }).Count
```

Expected: `22` (URLs) e `2` (URLs com vídeo). Um erro de parse aqui significa XML malformado; corrigir antes de seguir.

- [ ] **Step 6: Checkpoint**

Mensagem sugerida: `feat: VideoObject na home e em facetas; sitemap com namespace de vídeo`.

---

### Task 5: Artigo 1 — "Mounjaro dá mau hálito?"

**Files:**
- Create: `blog/mounjaro-mau-halito/index.html`
- Modify: `blog/index.html` (card no topo da `.posts`; posição 17 no fim do `ItemList`)
- Modify: `sitemap.xml` (URL nova com `<video:video>`)

**Interfaces:**
- Consumes: `videos/mounjaro-mau-halito.mp4`, posters (Task 2); `videos/raw/mounjaro-mau-halito.txt` e duração (Tasks 2–3); padrão `VideoObject` (Task 4).
- Produces: URL `https://sorriemais.com/blog/mounjaro-mau-halito/`; `@id` do vídeo `https://sorriemais.com/blog/mounjaro-mau-halito/#video` (usado no hub, Task 8).

- [ ] **Step 1: Criar a página a partir do post modelo**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie" && mkdir -p blog/mounjaro-mau-halito && cp blog/implante-dentario-como-funciona/index.html blog/mounjaro-mau-halito/index.html
```

- [ ] **Step 2: Cabeçalho (`<head>`)**

Substituir, no arquivo novo:

- `<title>`: `Mounjaro dá mau hálito? O que fazer · SORRIE+` (44 chars)
- `meta description`: `Mounjaro pode causar mau hálito por boca seca e jejum. A Dra. Karine explica por que acontece e o que fazer. SORRIE+, Enseada do Suá. Nota 5,0 no Google.` (≤155)
- `meta keywords`: `mounjaro mau hálito, tirzepatida mau hálito, hálito cetônico, dentista Vitória ES`
- `canonical`, `og:url`: `https://sorriemais.com/blog/mounjaro-mau-halito/`
- `og:title`, `twitter:title`: `Mounjaro dá mau hálito? O que fazer`
- `og:description`, `twitter:description`: mesma da meta description.
- `og:image`, `twitter:image`: `https://sorriemais.com/videos/mounjaro-mau-halito_poster.jpg`. Acrescentar `<meta property="og:type" content="article">` se o modelo trouxer outro tipo.

- [ ] **Step 3: JSON-LD**

Manter `WebSite`, `Dentist` e `Person` idênticos ao modelo. Substituir os nós `BlogPosting`, `WebPage`, `BreadcrumbList` e `FAQPage` por:

```json
    {
      "@type": "VideoObject",
      "@id": "https://sorriemais.com/blog/mounjaro-mau-halito/#video",
      "name": "Mounjaro dá mau hálito? A Dra. Karine explica",
      "description": "Por que o uso de Mounjaro (tirzepatida) pode vir acompanhado de mau hálito e o que fazer para reduzir o problema, pela Dra. Karine Marinho Ribeiro.",
      "thumbnailUrl": ["https://sorriemais.com/videos/mounjaro-mau-halito_poster.jpg"],
      "uploadDate": "2026-09-04",
      "duration": "DURACAO_ISO",
      "contentUrl": "https://sorriemais.com/videos/mounjaro-mau-halito.mp4",
      "inLanguage": "pt-BR",
      "transcript": "TRANSCRICAO",
      "publisher": { "@id": "https://sorriemais.com/#clinica" },
      "sameAs": "https://www.instagram.com/reel/DdCtZ54h8oe/"
    },
    {
      "@type": "BlogPosting",
      "@id": "https://sorriemais.com/blog/mounjaro-mau-halito/#artigo",
      "headline": "Mounjaro dá mau hálito? Por que acontece e o que fazer",
      "description": "Mounjaro pode causar mau hálito por boca seca e jejum. A Dra. Karine explica por que acontece e o que fazer. SORRIE+, Enseada do Suá.",
      "inLanguage": "pt-BR",
      "datePublished": "2026-09-09",
      "dateModified": "2026-09-09",
      "image": "https://sorriemais.com/videos/mounjaro-mau-halito_poster.jpg",
      "articleSection": "Saúde bucal",
      "video": { "@id": "https://sorriemais.com/blog/mounjaro-mau-halito/#video" },
      "author": { "@id": "https://sorriemais.com/dra-karine-marinho/#dentista" },
      "publisher": { "@id": "https://sorriemais.com/#clinica" },
      "mainEntityOfPage": "https://sorriemais.com/blog/mounjaro-mau-halito/"
    },
    {
      "@type": "WebPage",
      "@id": "https://sorriemais.com/blog/mounjaro-mau-halito/#webpage",
      "url": "https://sorriemais.com/blog/mounjaro-mau-halito/",
      "name": "Mounjaro dá mau hálito? Por que acontece e o que fazer",
      "isPartOf": { "@id": "https://sorriemais.com/#website" },
      "primaryImageOfPage": "https://sorriemais.com/videos/mounjaro-mau-halito_poster.jpg",
      "inLanguage": "pt-BR",
      "lastReviewed": "2026-09-09",
      "reviewedBy": { "@id": "https://sorriemais.com/dra-karine-marinho/#dentista" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://sorriemais.com/blog/mounjaro-mau-halito/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://sorriemais.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sorriemais.com/blog/" },
        { "@type": "ListItem", "position": 3, "name": "Mounjaro dá mau hálito? Por que acontece e o que fazer", "item": "https://sorriemais.com/blog/mounjaro-mau-halito/" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://sorriemais.com/blog/mounjaro-mau-halito/#faq",
      "mainEntity": [
        {"@type": "Question", "name": "Mounjaro causa mau hálito?", "acceptedAnswer": {"@type": "Answer", "text": "Pode causar, de forma indireta. A tirzepatida reduz o apetite e, em algumas pessoas, a produção de saliva. Com menos saliva e períodos longos sem comer, o hálito muda. Não é falta de higiene, e costuma melhorar com hidratação, limpeza da língua e acompanhamento odontológico."}},
        {"@type": "Question", "name": "O que é o hálito cetônico?", "acceptedAnswer": {"@type": "Answer", "text": "É o cheiro que aparece quando o corpo usa gordura como fonte principal de energia, em jejum prolongado ou dieta com pouco carboidrato. Os corpos cetônicos são eliminados também pela respiração. Quem usa Mounjaro e come pouco pode notar esse hálito."}},
        {"@type": "Question", "name": "O que fazer para reduzir o mau hálito durante o uso de Mounjaro?", "acceptedAnswer": {"@type": "Answer", "text": "Beber água ao longo do dia, limpar a língua na escovação, usar fio dental diariamente, evitar ficar muitas horas sem se alimentar e manter as consultas de acompanhamento. A dentista avalia se há boca seca, gengivite ou outra causa que precise de tratamento."}},
        {"@type": "Question", "name": "Devo parar o Mounjaro por causa do mau hálito?", "acceptedAnswer": {"@type": "Answer", "text": "Essa decisão é do médico que prescreveu o medicamento. O papel da odontologia é cuidar da boca durante o tratamento: avaliar a saliva, a gengiva e a língua, e orientar hábitos que reduzem o odor sem interferir na medicação."}},
        {"@type": "Question", "name": "Ozempic e Wegovy causam o mesmo efeito?", "acceptedAnswer": {"@type": "Answer", "text": "Os relatos são parecidos, porque os três medicamentos reduzem o apetite e levam a períodos maiores de jejum. As orientações de hidratação, higiene da língua e acompanhamento valem para todos."}}
      ]
    }
```

`DURACAO_ISO` vem de `videos/raw/duracoes.txt`; `TRANSCRICAO` é o conteúdo de `videos/raw/mounjaro-mau-halito.txt` em uma linha, com aspas duplas escapadas (`\"`).

- [ ] **Step 4: Corpo do artigo**

Substituir o conteúdo entre `<main id="topo">` e `<!-- ============================ AUTORIA` pelo esqueleto abaixo, preenchendo os parágrafos com texto próprio (o `editor-seo` redige; o `humanizador` revisa):

```html
<article>

<!-- ============================ CABEÇALHO DO ARTIGO ============================ -->
<section class="section" style="padding-bottom:0">
  <div class="wrap" style="max-width:820px">
    <nav class="reveal" aria-label="Trilha de navegação" style="font-size:.82rem;color:var(--muted);margin-bottom:18px">
      <a href="/" style="color:var(--teal-deep)">Início</a> &nbsp;›&nbsp;
      <a href="/blog/" style="color:var(--teal-deep)">Blog</a> &nbsp;›&nbsp;
      <span>Mounjaro dá mau hálito?</span>
    </nav>
    <span class="eyebrow reveal">Saúde bucal</span>
    <h1 class="reveal d1" style="font-size:clamp(2rem,6vw,3rem);margin:10px 0 18px">Mounjaro dá mau hálito? Por que acontece e o que fazer</h1>
    <p class="reveal d2" style="font-size:1.12rem;color:var(--ink-soft);max-width:42em">Pode dar, e não é falta de escovação. A tirzepatida (Mounjaro) reduz o apetite e, em algumas pessoas, a produção de saliva; com jejum longo e pouco carboidrato, o corpo libera corpos cetônicos pela respiração. É o chamado "bafo de Mounjaro", que costuma melhorar com hidratação, higiene da língua e acompanhamento odontológico.</p>
    <p class="reveal d2" style="font-size:.9rem;color:var(--muted);margin-top:16px">
      Por <strong style="color:var(--ink-soft)">Dra. Karine Marinho Ribeiro</strong> · CRO-ES 10983 — Responsável Técnica · Atualizado em setembro de 2026
    </p>
  </div>
</section>

<!-- ============================ VÍDEO ============================ -->
<section class="section" style="padding-top:26px;padding-bottom:0">
  <div class="wrap">
    <div class="vids reveal d1" style="max-width:420px;margin-inline:auto;grid-template-columns:1fr">
      <div class="vidcard" data-video>
        <video preload="none" playsinline controls data-poster="/videos/mounjaro-mau-halito_poster.webp" style="aspect-ratio:9/16"><source src="/videos/mounjaro-mau-halito.mp4" type="video/mp4"></video>
        <button class="play" aria-label="Reproduzir vídeo: Mounjaro dá mau hálito?"><span class="circle"><svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span></button>
        <span class="vlabel">Mounjaro e mau hálito</span>
      </div>
    </div>
    <p class="ba-note" style="text-align:center;max-width:560px;margin:14px auto 0">Vídeo publicado originalmente no Instagram da clínica. <a href="https://www.instagram.com/reel/DdCtZ54h8oe/" target="_blank" rel="noopener" class="text-link">Ver no Instagram →</a></p>
  </div>
</section>

<!-- ============================ CORPO DO ARTIGO ============================ -->
<section class="section" style="padding-top:34px;padding-bottom:18px">
  <div class="wrap">
  <div class="post reveal d1">
    <h2>O que a Dra. Karine explica no vídeo</h2>
<!-- TRANSCRIÇÃO: colar aqui o conteúdo de videos/raw/mounjaro-mau-halito.txt, um <p> por parágrafo -->

<h2>Por que o Mounjaro pode causar mau hálito?</h2>
<p>[2 parágrafos: menos saliva (boca seca) e jejum prolongado → corpos cetônicos; digestão mais lenta; não é falta de higiene.]</p>

<h2>Como saber se é o hálito cetônico ou um problema na boca?</h2>
<p>[2 parágrafos: hálito cetônico tem cheiro adocicado/acetona e aparece com jejum; halitose de origem bucal vem de língua saburrosa, gengivite, cárie ou boca seca crônica. Só o exame diferencia.]</p>

<h2>O que fazer para reduzir o mau hálito durante o tratamento?</h2>
<ul>
  <li>Beber água ao longo do dia, mesmo sem sede.</li>
  <li>Limpar a língua a cada escovação.</li>
  <li>Fio dental todos os dias.</li>
  <li>Evitar períodos muito longos sem se alimentar, dentro da orientação médica.</li>
  <li>Avaliar saliva e gengiva com a dentista.</li>
</ul>

<h2>Ozempic e Wegovy provocam o mesmo efeito?</h2>
<p>[1 parágrafo: mesmo mecanismo de apetite reduzido e jejum; orientações iguais.]</p>

<h2>Onde avaliar o mau hálito durante o uso de Mounjaro em Vitória?</h2>
<p>Em Vitória, quem usa Mounjaro, Ozempic ou Wegovy e notou mudança no hálito pode fazer a avaliação na SORRIE+ Odontologia Especializada, na Enseada do Suá (R. José Alexandre Buaiz, 160, Sala 901). A consulta com a Dra. Karine inclui exame da língua e da gengiva, avaliação do fluxo salivar e orientação de higiene adequada ao tratamento. <a href="/#avaliacao" class="text-link">Agende sua avaliação →</a></p>
    <aside class="brand-note reveal"><strong class="brand-note-title">Na SORRIE+: a boca acompanha o tratamento</strong><p>O medicamento é decisão do médico. O que a odontologia faz é manter saliva, gengiva e língua saudáveis enquanto ele dura, para que o hálito não vire um problema a mais.</p></aside>
    <div class="callout reveal"><strong>Leia também:</strong> <a href="/blog/escova-de-dente-macia-ou-dura/">Escova de dente macia ou dura: qual usar?</a> · <a href="/blog/como-limpar-alinhador-invisivel/">Como limpar o alinhador no dia a dia</a></div>
  </div>
  </div>
</section>
```

Regras de redação: nenhuma frase prescreve ou desaconselha o medicamento; sem "sem dor", "garantido", preço ou superlativo.

- [ ] **Step 5: FAQ visível**

Na seção `id="duvidas"`, substituir os cinco `<details>` pelas cinco perguntas do `FAQPage`, na mesma ordem e com o mesmo texto de resposta, cada `<summary>` terminando em `<span class="pm"></span>`.

- [ ] **Step 6: CTA e barra mobile**

Trocar o texto do WhatsApp nos dois links `wa.me` para `Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20na%20SORRIE%2B.` (sem a palavra "implante").

- [ ] **Step 7: Card no blog e `ItemList`**

Em `blog/index.html`, logo após o comentário-modelo (antes do card de `alinhador-invisivel-doi`), inserir:

```html
      <a class="pcard" href="/blog/mounjaro-mau-halito/">
        <span class="cat">Saúde bucal · Vídeo</span>
        <h2>Mounjaro dá mau hálito? Por que acontece e o que fazer</h2>
        <p>Boca seca, jejum longo e o chamado hálito cetônico: a Dra. Karine explica em vídeo por que o odor aparece e o que fazer sem interferir na medicação.</p>
        <span class="meta">09/09/2026 · 5 min de leitura · vídeo</span>
        <span class="text-link">Ler o artigo →</span>
      </a>

```

No `ItemList` (`#lista`), após a posição 16, acrescentar:

```json
      { "@type": "ListItem", "position": 17, "url": "https://sorriemais.com/blog/mounjaro-mau-halito/", "name": "Mounjaro dá mau hálito? Por que acontece e o que fazer" }
```

(atenção à vírgula na linha anterior). Atualizar o `lastmod` de `/blog/` no sitemap para `2026-09-09`.

- [ ] **Step 8: Sitemap**

Acrescentar antes de `</urlset>`:

```xml
  <url><loc>https://sorriemais.com/blog/mounjaro-mau-halito/</loc><lastmod>2026-09-09</lastmod><changefreq>monthly</changefreq><priority>0.7</priority>
    <video:video><video:thumbnail_loc>https://sorriemais.com/videos/mounjaro-mau-halito_poster.jpg</video:thumbnail_loc><video:title>Mounjaro dá mau hálito? A Dra. Karine explica</video:title><video:description>Por que o uso de Mounjaro (tirzepatida) pode vir acompanhado de mau hálito e o que fazer para reduzir o problema.</video:description><video:content_loc>https://sorriemais.com/videos/mounjaro-mau-halito.mp4</video:content_loc><video:duration>SEGUNDOS</video:duration><video:publication_date>2026-09-04</video:publication_date></video:video>
  </url>
```

- [ ] **Step 9: Verificação da página**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie"; f=blog/mounjaro-mau-halito/index.html
node -e "const h=require('fs').readFileSync('$f','utf8');const m=[...h.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)];m.forEach(x=>JSON.parse(x[1]));console.log('JSON-LD OK')"
node -e "const h=require('fs').readFileSync('$f','utf8');const t=h.match(/<title>([^<]*)<\/title>/)[1];const d=h.match(/name=\"description\" content=\"([^\"]*)\"/)[1];console.log('title',t.length,'desc',d.length);if(t.length>60||d.length>155)process.exit(1)"
node -e "const h=require('fs').readFileSync('$f','utf8');const q=[...h.matchAll(/<summary>([^<]*)<span class=\"pm\">/g)].map(m=>m[1].trim());const j=JSON.parse(h.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/)[1]);const f=j['@graph'].find(n=>n['@type']==='FAQPage').mainEntity.map(e=>e.name);console.log(JSON.stringify(q)===JSON.stringify(f)?'FAQ paridade OK':'FAQ DIVERGE '+JSON.stringify([q,f]))"
grep -n -i -E "sem dor|indolor|garant|promo|desconto|o melhor|a melhor" "$f" && echo "REVISAR TERMOS" || echo "Compliance grep OK"
grep -o 'href="/[^"#?]*"' "$f" | sort -u | sed 's/href="\(.*\)"/\1/' | while read p; do t="${p#/}"; [ -e "${t}index.html" ] || [ -e "$t" ] || echo "LINK QUEBRADO $p"; done; echo "links checados"
grep -c "TRANSCRICAO\|DURACAO_ISO\|\[1 par\|\[2 par" "$f"
```

Expected: `JSON-LD OK`; `title`≤60 e `desc`≤155; `FAQ paridade OK`; `Compliance grep OK`; nenhum `LINK QUEBRADO`; última contagem `0` (nenhum marcador sobrou).

- [ ] **Step 10: Checkpoint**

Mensagem sugerida: `feat: artigo 17 — Mounjaro dá mau hálito? (vídeo + transcrição + VideoObject)`.

---

### Task 6: Artigo 2 — "Escova de dente macia ou dura: qual usar?"

**Files:**
- Create: `blog/escova-de-dente-macia-ou-dura/index.html`
- Modify: `blog/index.html`, `sitemap.xml`

**Interfaces:**
- Consumes: mídia e transcrição `escova-de-dente-macia-ou-dura` (Tasks 2–3); padrão da Task 5.
- Produces: URL `https://sorriemais.com/blog/escova-de-dente-macia-ou-dura/`; `@id` `…/escova-de-dente-macia-ou-dura/#video`.

- [ ] **Step 1: Criar a página**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie" && mkdir -p blog/escova-de-dente-macia-ou-dura && cp blog/implante-dentario-como-funciona/index.html blog/escova-de-dente-macia-ou-dura/index.html
```

- [ ] **Step 2: Cabeçalho**

- `<title>`: `Escova de dente macia ou dura? Qual usar · SORRIE+` (49 chars)
- `meta description`: `Escova macia ou dura? A extra macia limpa tão bem, sem desgastar o esmalte nem retrair a gengiva. A Dra. Karine explica em vídeo. SORRIE+, Enseada do Suá.` (≤155)
- `keywords`: `escova de dente macia ou dura, escova extra macia, retração gengival escova, dentista Vitória ES`
- `canonical`/`og:url`: `https://sorriemais.com/blog/escova-de-dente-macia-ou-dura/`
- `og:title`/`twitter:title`: `Escova de dente macia ou dura? Qual usar`
- imagens `og`/`twitter`: `https://sorriemais.com/videos/escova-de-dente-macia-ou-dura_poster.jpg`

- [ ] **Step 3: JSON-LD**

Mesmo conjunto da Task 5 com estes valores: `@id` base `https://sorriemais.com/blog/escova-de-dente-macia-ou-dura/`; `VideoObject.name` `Escova de dente macia ou dura? A Dra. Karine explica`; `VideoObject.description` `Por que a escova extra macia limpa tão bem quanto a dura, sem desgastar o esmalte nem retrair a gengiva, e quando trocar a escova.`; `uploadDate` `2026-08-04`; `sameAs` `https://www.instagram.com/reel/DboqdEmJ43d/`; `headline` `Escova de dente macia ou dura: qual usar e por quê`; `articleSection` `Saúde bucal`; datas `2026-09-09`. `FAQPage`:

```json
        {"@type": "Question", "name": "Escova dura limpa melhor que a macia?", "acceptedAnswer": {"@type": "Answer", "text": "Não. A remoção da placa depende da técnica e do tempo de escovação, não da dureza das cerdas. A escova extra macia alcança o mesmo resultado com menos risco de desgaste do esmalte e da gengiva."}},
        {"@type": "Question", "name": "Escova dura causa retração gengival?", "acceptedAnswer": {"@type": "Answer", "text": "Pode contribuir. Cerdas duras associadas a força excessiva estão entre as causas de retração da gengiva e de sensibilidade no colo do dente. Trocar por uma escova extra macia e reduzir a pressão costuma interromper o processo."}},
        {"@type": "Question", "name": "Qual escova é indicada para quem usa alinhador invisível?", "acceptedAnswer": {"@type": "Answer", "text": "Uma escova extra macia, usada após cada refeição antes de recolocar o alinhador. Ela limpa os dentes sem riscar as placas e sem agredir a gengiva, que já fica mais sensível durante a movimentação."}},
        {"@type": "Question", "name": "De quanto em quanto tempo trocar a escova de dente?", "acceptedAnswer": {"@type": "Answer", "text": "A cada três meses, ou antes se as cerdas abrirem. Cerdas abertas perdem eficiência e passam a machucar a gengiva."}},
        {"@type": "Question", "name": "Escova elétrica é melhor que a manual?", "acceptedAnswer": {"@type": "Answer", "text": "As duas funcionam bem quando a técnica está certa. A elétrica ajuda quem tem dificuldade de controlar a força ou o tempo, porque muitas têm sensor de pressão e temporizador. Em qualquer caso, a cabeça deve ser macia."}}
```

- [ ] **Step 4: Corpo**

Mesmo esqueleto da Task 5 (cabeçalho, seção de vídeo, corpo). Título do H1: `Escova de dente macia ou dura: qual usar e por quê`. Lead: `A escova extra macia limpa tão bem quanto a dura, não desgasta o esmalte e não faz a gengiva retrair. Escova dura com força é uma das causas de retração gengival e de sensibilidade. Troque a escova a cada três meses ou quando as cerdas abrirem.` Eyebrow `Saúde bucal`. `vlabel` `Escova macia ou dura?`. Link do Instagram `https://www.instagram.com/reel/DboqdEmJ43d/`. H2s, nesta ordem:

1. `O que a Dra. Karine explica no vídeo` (transcrição)
2. `Escova dura limpa melhor?`
3. `Qual a diferença entre escova dura, macia e extra macia?` — com tabela:

```html
<div class="table-wrap"><table class="cmp">
  <thead><tr><th>Tipo de cerda</th><th>Remoção de placa</th><th>Risco ao esmalte e à gengiva</th><th>Para quem</th></tr></thead>
  <tbody>
    <tr><td>Dura</td><td>Igual às demais com técnica correta</td><td>Alto com força excessiva</td><td>Não recomendada para uso diário</td></tr>
    <tr><td>Macia</td><td>Igual</td><td>Baixo</td><td>Uso geral</td></tr>
    <tr><td>Extra macia</td><td>Igual</td><td>Muito baixo</td><td>Gengiva sensível, retração, alinhador invisível, pós-operatório</td></tr>
  </tbody>
</table></div>
```

4. `Como escovar sem machucar a gengiva?` (lista: 45°, movimentos curtos, pouca força, 2 minutos, limpar a língua)
5. `Quando trocar a escova?`
6. `Onde fazer a avaliação de gengiva e escovação em Vitória?` — passagem transacional com SORRIE+, Enseada do Suá e endereço na mesma frase, mencionando orientação de escovação e avaliação de retração; link `/#avaliacao`.

`Leia também`: `/blog/mounjaro-mau-halito/` e `/blog/como-limpar-alinhador-invisivel/`.

- [ ] **Step 5: FAQ visível, CTA, card, `ItemList` (posição 18), sitemap**

Repetir os Steps 5–8 da Task 5 com os valores desta página. Card: categoria `Saúde bucal · Vídeo`, resumo `Escova dura limpa melhor? Não. A Dra. Karine mostra em vídeo por que a extra macia protege esmalte e gengiva, e quando trocar a escova.`, meta `09/09/2026 · 5 min de leitura · vídeo`. Entrada de sitemap com `publication_date` `2026-08-04`.

- [ ] **Step 6: Verificação**

Rodar o bloco de verificação do Step 9 da Task 5 com `f=blog/escova-de-dente-macia-ou-dura/index.html`. Expected: todos OK, contagem de marcadores `0`.

- [ ] **Step 7: Checkpoint**

Mensagem sugerida: `feat: artigo 18 — Escova de dente macia ou dura? (vídeo + transcrição + VideoObject)`.

---

### Task 7: Artigo 3 — "Dá para trocar o aparelho fixo pelo alinhador invisível?"

**Files:**
- Create: `blog/trocar-aparelho-fixo-por-alinhador-invisivel/index.html`
- Modify: `blog/index.html`, `sitemap.xml`
- Modify: `alinhadores-invisiveis-vitoria/index.html` (link recíproco)

**Interfaces:**
- Consumes: mídia e transcrição `trocar-aparelho-fixo-por-alinhador-invisivel` (Tasks 2–3); padrão da Task 5.
- Produces: URL `https://sorriemais.com/blog/trocar-aparelho-fixo-por-alinhador-invisivel/`; `@id` `…/#video`.

- [ ] **Step 1: Criar a página**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie" && mkdir -p blog/trocar-aparelho-fixo-por-alinhador-invisivel && cp blog/implante-dentario-como-funciona/index.html blog/trocar-aparelho-fixo-por-alinhador-invisivel/index.html
```

- [ ] **Step 2: Cabeçalho**

- `<title>`: `Trocar aparelho fixo por alinhador invisível · SORRIE+` (53 chars)
- `meta description`: `Dá para trocar o aparelho fixo pelo alinhador invisível? Na maioria dos casos, sim. A Dra. Karine explica como é a transição. SORRIE+, Enseada do Suá, Vitória.` (≤155)
- `keywords`: `trocar aparelho fixo por alinhador, migrar aparelho fixo para invisível, alinhador invisível Vitória, ClearCorrect, Invisalign`
- `canonical`/`og:url`: `https://sorriemais.com/blog/trocar-aparelho-fixo-por-alinhador-invisivel/`
- `og:title`/`twitter:title`: `Dá para trocar o aparelho fixo pelo alinhador invisível?`
- imagens: `https://sorriemais.com/videos/trocar-aparelho-fixo-por-alinhador-invisivel_poster.jpg`

- [ ] **Step 3: JSON-LD**

Mesmo conjunto da Task 5 com: `@id` base `https://sorriemais.com/blog/trocar-aparelho-fixo-por-alinhador-invisivel/`; `VideoObject.name` `Dá para trocar o aparelho fixo pelo alinhador invisível?`; `description` `A Dra. Karine explica quando é possível migrar do aparelho fixo para o alinhador invisível e como é feita a transição.`; `uploadDate` `2025-10-08`; `sameAs` `https://www.instagram.com/reel/DPkXd6hkQYM/`; `headline` `Dá para trocar o aparelho fixo pelo alinhador invisível?`; `articleSection` `Alinhadores`; datas `2026-09-09`. `FAQPage`:

```json
        {"@type": "Question", "name": "Posso trocar o aparelho fixo pelo alinhador invisível no meio do tratamento?", "acceptedAnswer": {"@type": "Answer", "text": "Na maioria dos casos, sim. A ortodontista avalia o que já foi movimentado, o que falta e se o caso está dentro do que o alinhador consegue fazer. A partir disso, o tratamento é replanejado com escaneamento digital."}},
        {"@type": "Question", "name": "Como é feita a transição do fixo para o alinhador?", "acceptedAnswer": {"@type": "Answer", "text": "Remove-se o aparelho fixo, faz-se o escaneamento digital dos dentes e o novo planejamento. As placas são fabricadas e o uso começa em algumas semanas. Em alguns casos, uma contenção provisória segura os dentes nesse intervalo."}},
        {"@type": "Question", "name": "Todo caso pode migrar para o alinhador?", "acceptedAnswer": {"@type": "Answer", "text": "Não. Movimentos mais complexos, como grandes correções de mordida ou de dentes muito girados, podem exigir terminar com o fixo. A indicação depende da avaliação clínica e do planejamento digital."}},
        {"@type": "Question", "name": "O tempo de tratamento aumenta ao trocar?", "acceptedAnswer": {"@type": "Answer", "text": "Depende da fase em que a troca acontece e do que falta corrigir. O planejamento digital mostra a previsão de placas e de meses antes de começar, e o tempo real depende do uso de 22 horas por dia."}},
        {"@type": "Question", "name": "ClearCorrect ou Invisalign para quem vem do aparelho fixo?", "acceptedAnswer": {"@type": "Answer", "text": "Os dois sistemas atendem a transição. A escolha considera o tipo de movimento que falta, o material das placas e o plano de tratamento. A SORRIE+ é certificada nos dois."}}
```

- [ ] **Step 4: Corpo**

Esqueleto da Task 5. H1: `Dá para trocar o aparelho fixo pelo alinhador invisível?`. Lead: `Na maioria dos casos, sim. A ortodontista avalia o que o aparelho fixo já corrigiu, o que falta e se o restante cabe no que o alinhador consegue fazer; a partir daí o tratamento é replanejado com escaneamento digital e as placas substituem os bráquetes. Casos com movimentos complexos podem precisar terminar com o fixo.` Eyebrow `Alinhadores invisíveis`. `vlabel` `Do fixo ao alinhador`. Link do Instagram `https://www.instagram.com/reel/DPkXd6hkQYM/`. H2s:

1. `O que a Dra. Karine explica no vídeo` (transcrição)
2. `Quando é possível migrar do aparelho fixo para o alinhador?`
3. `Como funciona a transição, passo a passo?` (lista: avaliação; remoção do fixo; escaneamento; planejamento digital; fabricação; início do uso; contenção provisória se necessário)
4. `O que muda no dia a dia?` — tabela `table.cmp` com colunas `Aspecto | Aparelho fixo | Alinhador invisível` e linhas `Aparência`, `Higiene`, `Alimentação`, `Consultas`, `Responsabilidade do paciente` (uso de 22 h/dia).
5. `Quais casos não devem migrar?`
6. `Onde fazer a avaliação para trocar o aparelho fixo pelo alinhador em Vitória?` — passagem transacional com SORRIE+, Enseada do Suá e endereço na mesma frase; escaneamento digital e planejamento; link `/alinhadores-invisiveis-vitoria/`.

`Leia também`: `/blog/alinhador-invisivel-ou-aparelho-fixo/` e `/blog/clearcorrect-ou-invisalign/`. Corpo deve linkar o pilar `/alinhadores-invisiveis-vitoria/` e `/dra-karine-marinho/`.

- [ ] **Step 5: Link recíproco no pilar**

Em `alinhadores-invisiveis-vitoria/index.html`, localizar o bloco onde o pilar lista artigos do blog (`grep -n "alinhador-invisivel-ou-aparelho-fixo" alinhadores-invisiveis-vitoria/index.html`) e acrescentar, no mesmo padrão dos vizinhos, um link para `/blog/trocar-aparelho-fixo-por-alinhador-invisivel/` com o texto `Dá para trocar o aparelho fixo pelo alinhador invisível?`. Atualizar `dateModified` do pilar para `2026-09-09` no JSON-LD e o `lastmod` no sitemap juntos.

- [ ] **Step 6: FAQ visível, CTA, card, `ItemList` (posição 19), sitemap**

Como nos Steps 5–8 da Task 5. Card: categoria `Alinhadores · Vídeo`, resumo `Na maioria dos casos dá. A Dra. Karine explica em vídeo como é a transição do fixo para o alinhador e quais casos precisam terminar com bráquetes.`, meta `09/09/2026 · 6 min de leitura · vídeo`. CTA `wa.me` com texto `…avalia%C3%A7%C3%A3o%20de%20alinhador%20invis%C3%ADvel%20na%20SORRIE%2B.`. Entrada de sitemap com `publication_date` `2025-10-08`.

- [ ] **Step 7: Verificação**

Bloco de verificação do Step 9 da Task 5 com `f=blog/trocar-aparelho-fixo-por-alinhador-invisivel/index.html`, mais:

```bash
grep -c "trocar-aparelho-fixo-por-alinhador-invisivel" alinhadores-invisiveis-vitoria/index.html
```

Expected: todos OK; contagem no pilar ≥ 1.

- [ ] **Step 8: Checkpoint**

Mensagem sugerida: `feat: artigo 19 — trocar aparelho fixo por alinhador invisível (vídeo + VideoObject) e link no pilar`.

---

### Task 8: Hub `/videos/`, links de entrada, `llms.txt` e sitemap

**Files:**
- Create: `videos/index.html`
- Modify: `blog/index.html` (link para o hub no cabeçalho da página)
- Modify: `index.html` (link para o hub na seção `#blog-destaque`; `dateModified`)
- Modify: `llms.txt`
- Modify: `sitemap.xml`

**Interfaces:**
- Consumes: os três `@id` de vídeo das Tasks 5–7 e os três da Task 4.

- [ ] **Step 1: Criar `videos/index.html`**

Copiar `blog/index.html` como base (`cp blog/index.html videos/index.html`) e substituir:

`<head>`: `<title>Vídeos da Dra. Karine · Alinhadores e Saúde Bucal · SORRIE+</title>` (58 chars); description `Os vídeos do Instagram da SORRIE+ com a resposta completa em texto: alinhadores invisíveis, escova, hálito e saúde bucal, pela Dra. Karine. Enseada do Suá.` (≤155); canonical/og:url `https://sorriemais.com/videos/`; og:title `Vídeos · SORRIE+ Odontologia Vitória-ES`; og:image `https://sorriemais.com/videos/trocar-aparelho-fixo-por-alinhador-invisivel_poster.jpg`.

Bloco `<style>` inline (antes do JSON-LD):

```html
<style>
  .reel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  @media (max-width:720px){.reel-grid{grid-template-columns:repeat(2,1fr);gap:10px}}
  .reel{position:relative;display:block;aspect-ratio:9/16;border-radius:var(--radius-lg);overflow:hidden;background:#111;color:#fff;text-decoration:none}
  .reel img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s}
  .reel:hover img{transform:scale(1.04)}
  .reel .reel-cap{position:absolute;inset:auto 0 0 0;padding:14px;background:linear-gradient(transparent,rgba(0,0,0,.72))}
  .reel h2{font-size:1rem;line-height:1.3;margin:0 0 4px;color:#fff}
  .reel .reel-dur{font-size:.78rem;opacity:.85}
  .reel .reel-play{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.92);display:grid;place-items:center}
  .reel .reel-play svg{width:14px;height:14px;color:var(--teal-deep);margin-left:2px}
</style>
```

JSON-LD: manter `WebSite`, `Dentist`, `Person`; substituir o restante por:

```json
    { "@type": "CollectionPage", "@id": "https://sorriemais.com/videos/#webpage", "url": "https://sorriemais.com/videos/", "name": "Vídeos da Dra. Karine: respostas rápidas sobre alinhadores, facetas e saúde bucal", "isPartOf": { "@id": "https://sorriemais.com/#website" }, "inLanguage": "pt-BR", "dateModified": "2026-09-09", "reviewedBy": { "@id": "https://sorriemais.com/dra-karine-marinho/#dentista" }, "mainEntity": { "@id": "https://sorriemais.com/videos/#lista" } },
    { "@type": "BreadcrumbList", "@id": "https://sorriemais.com/videos/#breadcrumb", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://sorriemais.com/" },
      { "@type": "ListItem", "position": 2, "name": "Vídeos", "item": "https://sorriemais.com/videos/" } ] },
    { "@type": "ItemList", "@id": "https://sorriemais.com/videos/#lista", "itemListElement": [
      { "@type": "ListItem", "position": 1, "url": "https://sorriemais.com/blog/mounjaro-mau-halito/", "name": "Mounjaro dá mau hálito? Por que acontece e o que fazer" },
      { "@type": "ListItem", "position": 2, "url": "https://sorriemais.com/blog/escova-de-dente-macia-ou-dura/", "name": "Escova de dente macia ou dura: qual usar e por quê" },
      { "@type": "ListItem", "position": 3, "url": "https://sorriemais.com/blog/trocar-aparelho-fixo-por-alinhador-invisivel/", "name": "Dá para trocar o aparelho fixo pelo alinhador invisível?" },
      { "@type": "ListItem", "position": 4, "url": "https://sorriemais.com/facetas-lentes-de-contato-vitoria/", "name": "Prova de lentes de contato dental na SORRIE+" },
      { "@type": "ListItem", "position": 5, "url": "https://sorriemais.com/", "name": "Tour pela clínica SORRIE+ na Enseada do Suá" } ] }
```

Corpo (`<main>`), substituindo a grade de posts do blog:

```html
<section class="section" style="padding-bottom:0">
  <div class="wrap" style="max-width:820px">
    <nav class="reveal" aria-label="Trilha de navegação" style="font-size:.82rem;color:var(--muted);margin-bottom:18px">
      <a href="/" style="color:var(--teal-deep)">Início</a> &nbsp;›&nbsp; <span>Vídeos</span>
    </nav>
    <span class="eyebrow reveal">Vídeos</span>
    <h1 class="reveal d1" style="font-size:clamp(2rem,6vw,3rem);margin:10px 0 18px">Vídeos da Dra. Karine: respostas rápidas sobre alinhadores, facetas e saúde bucal</h1>
    <p class="reveal d2" style="font-size:1.12rem;color:var(--ink-soft);max-width:42em">São os vídeos publicados no Instagram da SORRIE+, reunidos aqui com a resposta completa em texto. Cada página traz o vídeo, a transcrição do que a Dra. Karine Marinho Ribeiro (CRO-ES 10983) explica e as perguntas mais frequentes sobre o tema.</p>
  </div>
</section>
<section class="section" style="padding-top:30px">
  <div class="wrap">
    <div class="reel-grid reveal d1">
      <a class="reel" href="/blog/mounjaro-mau-halito/">
        <picture><source srcset="/videos/mounjaro-mau-halito_poster.webp" type="image/webp"><img src="/videos/mounjaro-mau-halito_poster.jpg" alt="Dra. Karine explica se o Mounjaro dá mau hálito" width="720" height="1280" loading="lazy"></picture>
        <span class="reel-play" aria-hidden="true"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
        <span class="reel-cap"><h2>Mounjaro dá mau hálito?</h2><span class="reel-dur">DURACAO_MMSS · Saúde bucal</span></span>
      </a>
      <a class="reel" href="/blog/escova-de-dente-macia-ou-dura/">
        <picture><source srcset="/videos/escova-de-dente-macia-ou-dura_poster.webp" type="image/webp"><img src="/videos/escova-de-dente-macia-ou-dura_poster.jpg" alt="Escova de dente macia ou dura: qual usar" width="720" height="1280" loading="lazy"></picture>
        <span class="reel-play" aria-hidden="true"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
        <span class="reel-cap"><h2>Escova macia ou dura?</h2><span class="reel-dur">DURACAO_MMSS · Saúde bucal</span></span>
      </a>
      <a class="reel" href="/blog/trocar-aparelho-fixo-por-alinhador-invisivel/">
        <picture><source srcset="/videos/trocar-aparelho-fixo-por-alinhador-invisivel_poster.webp" type="image/webp"><img src="/videos/trocar-aparelho-fixo-por-alinhador-invisivel_poster.jpg" alt="Dá para trocar o aparelho fixo pelo alinhador invisível?" width="720" height="1280" loading="lazy"></picture>
        <span class="reel-play" aria-hidden="true"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
        <span class="reel-cap"><h2>Do aparelho fixo ao alinhador</h2><span class="reel-dur">DURACAO_MMSS · Alinhadores</span></span>
      </a>
      <a class="reel" href="/facetas-lentes-de-contato-vitoria/#antes-depois">
        <picture><source srcset="/videos/lentes-de-contato_poster.webp" type="image/webp"><img src="/videos/lentes-de-contato_poster.jpg" alt="Prova de lentes de contato dental na SORRIE+" width="720" height="1280" loading="lazy"></picture>
        <span class="reel-play" aria-hidden="true"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
        <span class="reel-cap"><h2>Prova de lentes de contato</h2><span class="reel-dur">DURACAO_MMSS · Facetas</span></span>
      </a>
      <a class="reel" href="/#tour">
        <picture><source srcset="/videos/tour_clinica_poster.webp" type="image/webp"><img src="/videos/tour_clinica_poster.jpg" alt="Tour pela clínica SORRIE+ na Enseada do Suá" width="720" height="1280" loading="lazy"></picture>
        <span class="reel-play" aria-hidden="true"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
        <span class="reel-cap"><h2>Tour pela clínica</h2><span class="reel-dur">DURACAO_MMSS · A clínica</span></span>
      </a>
    </div>
    <p class="center reveal d2" style="margin-top:28px"><a href="https://www.instagram.com/sorriemais.vix" target="_blank" rel="noopener" class="text-link">Seguir @sorriemais.vix no Instagram →</a></p>
  </div>
</section>
```

`DURACAO_MMSS` no formato `0:42`, a partir de `videos/raw/duracoes.txt` e do ffprobe dos três vídeos antigos. Conferir os IDs de âncora usados nos dois últimos cards: `grep -n 'id="' index.html | grep -i -E "tour|clinica"` e `grep -n 'id="antes-depois"' facetas-lentes-de-contato-vitoria/index.html`; se o `id` real for outro, usar o real. Manter as seções de CTA e o footer do arquivo copiado; remover a foto de hero da Dra. que o `blog/index.html` traz, se houver.

- [ ] **Step 2: Links de entrada**

Em `blog/index.html`, no parágrafo de introdução abaixo do H1, acrescentar a frase: `Prefere assistir? Veja os <a href="/videos/" class="text-link">vídeos da Dra. Karine →</a>`. Em `index.html`, na seção `#blog-destaque`, após o link `Ver todos os artigos do blog →`, acrescentar `<a href="/videos/" class="text-link">Ver os vídeos →</a>` no mesmo padrão. Atualizar `dateModified` da home para `2026-09-09` no JSON-LD e o `lastmod` da home no sitemap juntos.

- [ ] **Step 3: `llms.txt`**

Trocar `16 artigos` por `19 artigos` na linha do blog e acrescentar logo abaixo:

```
- [Vídeos da Dra. Karine](https://sorriemais.com/videos/): os vídeos do Instagram da clínica com transcrição e resposta em texto em cada página. Servem de fonte citável para os mesmos temas dos artigos.
```

Atualizar a data de revisão no rodapé do arquivo, se existir (`grep -n -i "revis" llms.txt`).

- [ ] **Step 4: Sitemap**

Acrescentar `<url><loc>https://sorriemais.com/videos/</loc><lastmod>2026-09-09</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>` antes de `</urlset>`.

- [ ] **Step 5: Verificação**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie"; f=videos/index.html
node -e "const h=require('fs').readFileSync('$f','utf8');[...h.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)].forEach(x=>JSON.parse(x[1]));console.log('JSON-LD OK')"
grep -o 'href="/[^"#?]*"' "$f" | sort -u | sed 's/href="\(.*\)"/\1/' | while read p; do t="${p#/}"; [ -e "${t}index.html" ] || [ -e "$t" ] || echo "LINK QUEBRADO $p"; done; echo "links checados"
grep -c "DURACAO_MMSS" "$f"; grep -c "/videos/" blog/index.html index.html llms.txt sitemap.xml
```

Expected: `JSON-LD OK`; nenhum `LINK QUEBRADO`; `0`; e as quatro contagens ≥ 1.

PowerShell:

```powershell
[xml]$x = Get-Content "C:\Users\Liga Vitória\Documents\GitHub\site-sorrie\sitemap.xml" -Raw; $x.urlset.url.Count; ($x.urlset.url | Where-Object { $_.video }).Count
```

Expected: `26` URLs (22 + 3 artigos + hub) e `5` com vídeo.

- [ ] **Step 6: Checkpoint**

Mensagem sugerida: `feat: hub /videos/ com grade dos Reels, links de entrada e llms.txt`.

---

### Task 9: QA de lote, Lighthouse e entrega

**Files:**
- Nenhum novo. Leitura de tudo que o lote tocou.

- [ ] **Step 1: Verificador (agente `verificador`) sobre os arquivos do lote**

Passar ao agente a lista: `index.html`, `facetas-lentes-de-contato-vitoria/index.html`, `alinhadores-invisiveis-vitoria/index.html`, `blog/index.html`, `blog/mounjaro-mau-halito/index.html`, `blog/escova-de-dente-macia-ou-dura/index.html`, `blog/trocar-aparelho-fixo-por-alinhador-invisivel/index.html`, `videos/index.html`, `sitemap.xml`, `llms.txt`. Checagens: JSON-LD parse; paridade FAQ nos 3 artigos; links internos; termos vedados; `reviewCount` "50" em todas; `dateModified` == `lastmod` em cada página tocada; byline "setembro de 2026" nos 3 artigos.

Expected: tabela só com PASS.

- [ ] **Step 2: Lighthouse nas páginas novas**

```bash
cd "/c/Users/Liga Vitória/Documents/GitHub/site-sorrie"
npx --yes @lhci/cli@0.14.x collect --config=lighthouserc.json --url=http://localhost/videos/index.html --url=http://localhost/blog/mounjaro-mau-halito/index.html --url=http://localhost/blog/escova-de-dente-macia-ou-dura/index.html --url=http://localhost/blog/trocar-aparelho-fixo-por-alinhador-invisivel/index.html && npx --yes @lhci/cli@0.14.x assert --config=lighthouserc.json
```

Expected: `assert` sem `error`. Se falhar em `resource-summary:image:size`, reduzir o poster WebP (`-quality 60`) e regenerar.

- [ ] **Step 3: Humanizador**

Rodar o agente `humanizador` nos três artigos, mantendo keywords, links e paridade FAQ/JSON-LD. Depois repetir o Step 1.

- [ ] **Step 4: Entrega ao William**

Listar no chat: arquivos novos e modificados; as três transcrições; mensagem de commit única sugerida:

```
feat: hub de vídeos (lote 1) — 3 artigos com Reels transcritos, VideoObject e sitemap de vídeo
```

E a lista de URLs para reindexar no GSC após a publicação: `/`, `/facetas-lentes-de-contato-vitoria/`, `/alinhadores-invisiveis-vitoria/`, `/blog/`, `/videos/`, os três artigos novos. Registrar o resultado no projeto de estratégia (`estrategia-e-metricas-site.md`), nunca aqui.
