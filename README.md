# SORRIE+ Odontologia — Site institucional

Site estático (HTML, CSS e JavaScript puros, sem dependências de build) da clínica
**SORRIE+ Odontologia Especializada** — Enseada do Suá, Vitória-ES.
Foco em conversão de leads, performance no mobile e SEO local.

---

## 📁 Estrutura do projeto

```
site-sorrie/
├── index.html              # Página principal
├── 404.html                # Página de erro
├── robots.txt              # Instruções para buscadores
├── sitemap.xml             # Mapa do site (SEO)
├── site.webmanifest        # Metadados PWA / ícone
├── .gitignore
├── assets/
│   ├── css/styles.css      # Todo o design (sistema de cores, layout, mobile)
│   └── js/main.js          # Interações (menu, slider, vídeo, formulário, reveal)
├── logos/                  # logo.svg (usado no site), logo_180/512/1024.png
├── hero/                   # hero_reception_1920x960.jpg
├── clinica/                # consultorio_1, consultorio_2, fachada_edificio
├── antes-depois/           # antes_apos_1, antes_apos_2 (slider de resultados)
├── equipe/                 # equipe_grupo
└── videos/                 # tour_clinica.mp4, promessa_valor.mp4 + capas (_poster.jpg)
```

> ✅ As imagens já foram **otimizadas** (de ~12,7 MB para ~1,8 MB, sem perda visível)
> e os vídeos **comprimidos** para a web. Os arquivos `_poster.jpg` são as capas
> dos vídeos (não apague). Guarde suas imagens originais em um backup separado.

---

## ✅ O que você PRECISA ajustar antes de publicar

Procure e substitua em **todos os arquivos**:

| Placeholder | Substituir por |
|---|---|
| `www.SEU-DOMINIO.com.br` | Seu domínio real (ex.: `sorriemais.com.br`) |
| `SEU-INSTAGRAM` | Usuário do Instagram da clínica |
| `Dr(a). [Nome] CRO-ES [nº]` | Responsável técnico e nº do CRO (exigência do CFO) |
| `CNPJ 00.000.000/0001-00` | CNPJ real da clínica |

Dica (terminal, dentro da pasta):
```bash
grep -rl "SEU-DOMINIO" . --include="*.html" --include="*.xml" --include="*.txt"
```

### Conferir os dados da clínica
Os horários e o endereço foram atualizados conforme o **Perfil do Google**:
- Seg–Sex: 9h–20h · Sáb: 8h–14h · Dom: fechado
- R. José Alexandre Buaiz — Ed. London Office Tower, Sala 901, Enseada do Suá

Se algum dado estiver diferente, ajuste no `index.html` **e** no Google Business
(eles precisam ser idênticos para o SEO local funcionar bem).

---

## 💻 Pré-visualizar no seu computador

Não precisa instalar nada. Abra o `index.html` no navegador, ou rode um servidor local:

```bash
# Python (já vem no Mac/Linux)
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

---

## 🔧 Git — versionar o projeto

```bash
cd sorriemais

git init
git add .
git commit -m "Site SORRIE+ v2 — redesign, mobile e SEO"
git branch -M main
```

Crie um repositório vazio no GitHub (pelo site, em github.com/new — **sem** README).
Depois conecte e envie:

```bash
git remote add origin https://github.com/SEU-USUARIO/sorriemais.git
git push -u origin main
```

A cada alteração:
```bash
git add .
git commit -m "descreva a mudança"
git push
```

---

## 🚀 Deploy — 3 opções (escolha uma)

### Opção A — GitHub Pages (grátis, mais simples)
1. No repositório → **Settings → Pages**
2. Em *Source*, selecione branch `main` / pasta `/root` → **Save**
3. Em ~1 min o site sai em `https://SEU-USUARIO.github.io/sorriemais/`
4. Para domínio próprio: em *Pages → Custom domain* informe seu domínio e
   aponte o DNS conforme as instruções do GitHub.

### Opção B — Netlify (grátis, deploy automático + HTTPS)
1. Acesse app.netlify.com → *Add new site → Import from Git*
2. Conecte seu GitHub e escolha o repositório
3. Build command: *(deixe vazio)* · Publish directory: `/`
4. Cada `git push` publica sozinho. Domínio próprio em *Domain settings*.

### Opção C — Vercel (grátis)
1. Acesse vercel.com → *Add New → Project* → importe o repositório
2. Framework: *Other* · sem build command
3. Deploy. Domínio próprio em *Settings → Domains*.

> Em todas as opções o HTTPS é automático. Por segurança, **a criação de contas e a
> autenticação devem ser feitas por você** — nunca compartilhe senhas.

---

## 🔎 Checklist de SEO pós-deploy

- [ ] Substituir todos os placeholders (tabela acima)
- [ ] Confirmar que `sitemap.xml` e `robots.txt` abrem no navegador
- [ ] Cadastrar o site no **Google Search Console** e enviar o `sitemap.xml`
- [ ] Conferir que o **Perfil do Google** tem o mesmo nome, endereço, telefone e
      horários do site (consistência NAP)
- [ ] Adicionar o link do site no Perfil do Google e no Instagram
- [ ] Testar os dados estruturados em `search.google.com/test/rich-results`
- [ ] Rodar o **PageSpeed Insights** (mobile) em `pagespeed.web.dev`
- [ ] Trocar a imagem `og:` por uma arte 1200×630 específica para compartilhamento (opcional)

---

## 🧩 Manutenção rápida

- **Textos, telefones, horários:** edite o `index.html` (está comentado por seções).
- **Cores e espaçamentos:** edite as variáveis no topo de `assets/css/styles.css`.
- **Avaliações:** atualize os 3 cards na seção `AVALIAÇÕES` quando tiver novos depoimentos.
- **Antes/depois:** troque as imagens em `antes-depois/` mantendo os nomes.
