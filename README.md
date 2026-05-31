# SORRIE+ Odontologia Especializada

Site institucional da **SORRIE+ Odontologia Especializada** — Vitória-ES.
Referência em alinhadores invisíveis (ClearCorrect e Invisalign®) com clareamento incluso.

🔗 **No ar:** [sorriemais.com](https://sorriemais.com)

---

## Sobre o projeto

Site estático de página única (landing page), construído em **HTML, CSS e JavaScript puros** — sem frameworks ou dependências de build. A prioridade foi desempenho, SEO local e uma experiência elegante no celular, onde está a maior parte do público.

### Destaques

- **Performance:** sem bibliotecas externas; imagens otimizadas e vídeos comprimidos.
- **Responsivo:** pensado primeiro para o mobile (barra de ações fixa, menu próprio, toques).
- **SEO local:** dados estruturados (JSON-LD) de clínica odontológica e de perguntas frequentes, metatags sociais, sitemap e robots.
- **Acessível:** navegação por teclado, textos alternativos e bom contraste.

---

## Estrutura

```
site-sorrie/
├── index.html            Página principal
├── 404.html              Página de erro
├── robots.txt            Orientações para buscadores
├── sitemap.xml           Mapa do site
├── site.webmanifest      Manifesto (ícones / nome do app)
├── CNAME                 Domínio próprio (GitHub Pages)
├── assets/
│   ├── css/styles.css    Estilos
│   └── js/main.js        Interações (menu, slider, FAQ, reveal…)
├── logos/                Logomarcas e selos de parceiros
├── hero/                 Imagem principal
├── clinica/              Fotos da clínica
├── antes-depois/         Resultados
├── equipe/               Fotos da equipe
└── videos/               Vídeos + capas
```

---

## Como editar

Por ser um site estático, basta abrir os arquivos e editar:

- **Textos e seções:** `index.html`
- **Cores, espaçamentos, tipografia:** `assets/css/styles.css`
- **Comportamentos (menu, slider, perguntas):** `assets/js/main.js`

Para visualizar localmente, abra o `index.html` direto no navegador (duplo clique) ou rode um servidor simples:

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

---

## Publicação

Hospedado no **GitHub Pages** com domínio próprio.

1. As alterações vão para o branch `main`.
2. O GitHub Pages publica automaticamente em poucos minutos.
3. O domínio `sorriemais.com` aponta para o GitHub via DNS (registros A + CNAME `www`).

> O e-mail profissional (`@sorriemais.com`) usa Google Workspace — os registros MX/TXT do domínio **não devem ser alterados**.

---

## Identidade da marca

- **Tipografia do site:** Fraunces (títulos) e Hanken Grotesk (texto).
- **Logomarca:** "SORRIE" na fonte original da marca; versão escura no topo e versão clara (ícone + nome) no rodapé.
- **Cores:** tons de teal e creme, com base escura para contraste.

---

## Dados da clínica

- **Razão social:** WK Serviços LTDA — CNPJ 59.262.418/0001-10
- **Responsável Técnica:** Dra. Karine Marinho Ribeiro — CRO-ES 10983 · EPAO 3015
- **Endereço:** R. José Alexandre Buaiz, 160 — Ed. London Office Tower, Sala 901, Enseada do Suá, Vitória-ES · CEP 29.050-545
- **Contato:** (27) 99989-3314 · [Instagram @sorriemais.vix](https://www.instagram.com/sorriemais.vix)

---

<sub>© SORRIE+ Odontologia Especializada. Todos os direitos reservados.</sub>
