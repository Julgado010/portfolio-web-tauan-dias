# portfolio-web-tauan-dias

Site de portfólio pessoal de **Tauan Dias**, estudante de Análise e Desenvolvimento de Sistemas (ADS) na UDF, com tema medieval escuro e referências ao Minecraft.

> 🤖 **Aviso:** este projeto foi desenvolvido por mim com o apoio de IA (Claude). Eu defini a ideia e o visual, guiei a IA, revisei o código e ajustei o resultado.

🔗 **Demonstração:** https://julgado010.github.io/portfolio-web-tauan-dias/

---

## 📖 Visão geral

Um site de uma página que apresenta quem eu sou, o que estou estudando, minhas habilidades e meus projetos. O projeto aplica o que aprendo nas matérias de **Desenvolvimento Web** e **Design Profissional**.

**Destaques do visual:**
- **Abertura com baú**: ao entrar, o visitante abre um baú em pixel art para acessar o site (com botão de pular, navegação por teclado e suporte a movimento reduzido)
- Cursor de espada em pixel art, desenhado por código (sem imagens externas)
- Barra de itens (hotbar) fixa no rodapé, que também responde às teclas **1 a 6**
- Barras de XP para as habilidades, que enchem quando aparecem na tela
- Notificações de conquista ao navegar pelas seções
- **Som ambiente medieval** gerado por código (Web Audio API), ligado só quando o visitante clica
- **Jukebox na Taverna** com 3 discos (rock clássico, abertura de anime e trilha do Minecraft), tocando pelo player oficial do YouTube
- Tochas animadas e brasas no fundo (respeitam `prefers-reduced-motion`)
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
├── script.js    # cursor, conquistas, hotbar e barras de XP
├── LICENSE
└── README.md
```

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

Minecraft é marca da Mojang Studios. Este projeto é feito para estudo e não tem vínculo com a Mojang ou a Microsoft. Todos os elementos visuais (espada, tochas, ícones) são desenhados por código.

## 📜 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE).

## 👤 Autor

**Tauan Dias**
💼 [LinkedIn](https://www.linkedin.com/in/tauan-dias-1b078741a) · 🐙 [GitHub](https://github.com/Julgado010) · ✉️ tauanv347@gmail.com
