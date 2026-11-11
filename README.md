# portfolio-web-tauan-dias

Site de portfólio pessoal de **Tauan Dias**, estudante de Análise e Desenvolvimento de Sistemas (ADS) na UDF, com tema medieval escuro e referências ao Minecraft.

> 🤖 **Aviso:** este projeto foi desenvolvido por mim com o apoio de IA (Claude). Eu defini a ideia e o visual, guiei a IA, revisei o código e ajustei o resultado.

🔗 **Demonstração:** https://julgado010.github.io/portfolio-web-tauan-dias/

---

## 📖 Visão geral

Um site de uma página que apresenta quem eu sou, o que estou estudando, minhas habilidades e meus projetos. O projeto aplica o que aprendo nas matérias de **Desenvolvimento Web** e **Design Profissional**.

**Destaques do visual:**
- **Logo "DIAZ"** em um retângulo de latão com a placa do meu nome, no topo, na abertura e no início
- **Abertura com personagem e baú**: ao entrar, meu personagem (a minha skin de Minecraft) chega andando, o visitante clica em abrir, ele alcança o baú e comemora (com botão de pular, navegação por teclado e suporte a movimento reduzido)
- **Personagem animado no início**: ele respira, acena sozinho, acompanha o mouse com a cabeça e acena ao clique
- **Botão "Baixar skin"** para baixar a skin (Minecraft Java, modelo Classic)
- **Layout de ponta a ponta**, com barras de título e caixas em vez de elementos soltos
- Cursor de espada em pixel art, desenhado por código (sem imagens externas)
- Barra de itens (hotbar) fixa no rodapé, que também responde às teclas **1 a 6**
- Barras de XP para as habilidades, que enchem quando aparecem na tela
- Notificações de conquista ao navegar pelas seções
- **Som ambiente medieval** gerado por código (Web Audio API), ligado só quando o visitante clica
- **Jukebox na Taverna** com 3 discos (rock clássico, abertura de anime e trilha do Minecraft), tocando pelo player oficial do YouTube
- Brasas subindo no fundo (respeitam `prefers-reduced-motion`)
- Layout responsivo, com foco visível para navegação por teclado

---

## 🛠️ Tecnologias

- **HTML5**
- **CSS3** (variáveis, grid, flexbox, pixel art com `box-shadow`)
- **JavaScript** puro, sem bibliotecas (inclui Web Audio API e YouTube IFrame Player API)
- Fontes: MedievalSharp e VT323 (Google Fonts)

---

## 📂 Estrutura

```
portfolio-web-tauan-dias/
├── index.html   # estrutura e conteúdo
├── style.css    # visual e responsividade
├── script.js    # cursor, personagem, abertura, conquistas, hotbar, XP e jukebox
├── assets/
│   ├── skin-diaz.png   # a skin (64x64, modelo Classic)
│   └── char/           # quadros do personagem usados nas animações
├── LICENSE
└── README.md
```

---

## 🧍 Sobre o personagem

A skin foi criada com apoio de IA e é minha. As animações usam **quadros PNG pré-renderizados** da própria skin (parado, acenando, olhando para os lados, andando e abrindo o baú), trocados por JavaScript. Assim o site continua sem bibliotecas e carrega rápido.

---

## 🚀 Como executar

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` no navegador.

Não precisa instalar nada.

---

## 🌐 Publicação

O site é publicado com **GitHub Pages**, a partir da branch `main`.

---

## 🎵 Sobre a música

- O **som ambiente** é gerado por código, sem arquivos de áudio, então não usa material de terceiros.
- O **jukebox** não hospeda nenhuma música. Ele usa o player oficial do YouTube, que só é carregado depois que o visitante escolhe um disco. As músicas pertencem aos seus artistas e canais.
- O jukebox só funciona com o site publicado (https). Ao abrir o `index.html` direto no computador, o YouTube não permite o player e o site mostra um aviso.
- Se um vídeo deixar de permitir incorporação, o site mostra uma mensagem com o link para abrir no YouTube.
- Para trocar ou adicionar discos, edite os botões `.disc` no `index.html` (`data-type` é `video` ou `list`, e `data-id` é o código do vídeo ou da playlist).

## ⚖️ Créditos e avisos

Minecraft é marca da Mojang Studios. Este projeto é feito para estudo e não tem vínculo com a Mojang ou a Microsoft. Os elementos visuais (espada, ícones, logo, baú) são desenhados por código. O personagem é a minha skin original.

## 📜 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE).

## 👤 Autor

**Tauan Dias**
💼 [LinkedIn](https://www.linkedin.com/in/tauan-dias-1b078741a) · 🐙 [GitHub](https://github.com/Julgado010) · ✉️ tauanv347@gmail.com
