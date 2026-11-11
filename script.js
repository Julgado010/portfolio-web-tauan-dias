// Cursor de espada em pixel art (desenhado aqui, sem imagens externas)
(function setupCursor() {
  const blade = "#dfe6ea", edge = "#aab6bd", gold = "#e6b84a", wood = "#7a4a22";
  function sword(bladeColor) {
    const px = [];
    for (let i = 1; i <= 9; i++) px.push([i, i, bladeColor]);
    for (let i = 1; i <= 8; i++) px.push([i + 1, i, edge]);
    [[7, 12], [8, 11], [9, 10], [10, 9], [11, 8], [12, 7]].forEach(([x, y]) => px.push([x, y, gold]));
    [[10, 10], [11, 11], [12, 12]].forEach(([x, y]) => px.push([x, y, wood]));
    px.push([13, 13, gold]);
    const rects = px.map(([x, y, c]) => `<rect x='${x}' y='${y}' width='1' height='1' fill='${c.replace("#", "%23")}'/>`).join("");
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16' shape-rendering='crispEdges'>${rects}</svg>`;
    return `url("data:image/svg+xml,${svg}") 2 2, auto`;
  }
  const root = document.documentElement.style;
  root.setProperty("--cursor", sword(blade));
  root.setProperty("--cursor-hand", sword("#ffd966"));
})();

// Brasas subindo no fundo
(function embers() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.getElementById("embers");
  for (let i = 0; i < 22; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDuration = 8 + Math.random() * 10 + "s";
    s.style.animationDelay = -Math.random() * 14 + "s";
    box.appendChild(s);
  }
})();

// Conquistas (toasts)
const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");
const seen = new Set();
let toastTimer;
function achieve(id, text) {
  if (seen.has(id)) return;
  seen.add(id);
  toastText.textContent = text;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
}

// Barras de XP enchem quando aparecem na tela
document.querySelectorAll(".xp").forEach((el) => el.style.setProperty("--lvl", el.dataset.level));
const xpObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("on");
      xpObserver.unobserve(e.target);
      achieve("skills", "Aprendiz de ferreiro");
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll(".xp").forEach((el) => xpObserver.observe(el));

// Barra de itens: destaca a seção atual
const slots = [...document.querySelectorAll(".slot")];
const sections = slots.map((s) => document.querySelector(s.getAttribute("href")));
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const idx = sections.indexOf(e.target);
    slots.forEach((s, i) => s.classList.toggle("active", i === idx));
    if (e.target.id === "projetos") achieve("projects", "Mestre de obras");
    if (e.target.id === "contato") achieve("contact", "Mensageiro real");
  });
}, { rootMargin: "-40% 0px -50% 0px" });
sections.forEach((s) => navObserver.observe(s));

// Teclas 1 a 5 funcionam como a barra de itens do jogo
addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (introActive) return;
  if (e.target.matches && e.target.matches("input, textarea")) return;
  const i = Number(e.key) - 1;
  if (i >= 0 && i < sections.length) sections[i].scrollIntoView({ behavior: "smooth" });
});

// ---------- Trilha de fundo (arquivos de áudio em assets/music, em loop e bem baixinha) ----------
const Bgm = (() => {
  const tracks = (document.body.dataset.bgm || "").split(",").map((t) => t.trim()).filter(Boolean);
  const VOLUME = 0.12;                       // bem baixinho, para não incomodar
  let audio = null, idx = 0, on = false, failed = false, fadeIv = null, listener = null;
  const prefOff = () => { try { return localStorage.getItem("bgmOff") === "1"; } catch (_) { return false; } };
  const setPref = (off) => { try { localStorage.setItem("bgmOff", off ? "1" : "0"); } catch (_) {} };

  function fade(to, ms, done) {
    clearInterval(fadeIv);
    const from = audio.volume, steps = Math.max(1, Math.round(ms / 50));
    let i = 0;
    fadeIv = setInterval(() => {
      i++;
      audio.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
      if (i >= steps) { clearInterval(fadeIv); if (done) done(); }
    }, 50);
  }
  function ensure() {
    if (audio) return audio;
    audio = new Audio();
    audio.preload = "auto";
    audio.volume = 0;
    audio.loop = tracks.length === 1;
    audio.src = tracks[0];
    audio.addEventListener("ended", () => {  // passa para a próxima parte e volta ao início no fim
      idx = (idx + 1) % tracks.length;
      audio.src = tracks[idx];
      audio.play().catch(() => {});
    });
    audio.addEventListener("error", () => {
      if (tracks.length > 1 && idx > 0) {     // parte ausente: volta para a primeira
        idx = 0; audio.src = tracks[0]; audio.play().catch(() => {});
        return;
      }
      failed = true; on = false; render();
    });
    return audio;
  }
  async function start() {
    if (!tracks.length || failed) return false;
    const a = ensure();
    try { await a.play(); } catch (_) { return false; }
    on = true;
    fade(VOLUME, 2500);
    render();
    return true;
  }
  function stop(ms = 700) {
    if (!audio || !on) return;
    on = false;
    const a = audio;
    fade(0, ms, () => { if (!on) a.pause(); });
    render();
  }
  // A primeira interação do visitante (clique ou tecla) inicia a trilha, se ele não a desligou antes
  function arm() {
    if (!tracks.length || prefOff()) return;
    listener = (e) => {
      if (e.target && e.target.closest && e.target.closest(".jukebox, .ambient")) return;
      removeEventListener("pointerdown", listener, true);
      removeEventListener("keydown", listener, true);
      start();
    };
    addEventListener("pointerdown", listener, true);
    addEventListener("keydown", listener, true);
  }
  function disarm() {
    if (!listener) return;
    removeEventListener("pointerdown", listener, true);
    removeEventListener("keydown", listener, true);
    listener = null;
  }
  function check() {                         // confere se a primeira parte existe no site publicado
    if (!tracks.length || !location.protocol.startsWith("http")) return;
    fetch(tracks[0], { method: "HEAD" }).then((res) => { if (!res.ok) { failed = true; render(); } }).catch(() => {});
  }
  return { start, stop, arm, disarm, check, setPref, get on() { return on; }, get failed() { return failed; }, get has() { return tracks.length > 0; } };
})();

const bgmBtn = document.getElementById("bgm");
function render() {
  if (!bgmBtn) return;
  bgmBtn.textContent = "Música de fundo: " + (Bgm.failed ? "indisponível" : Bgm.on ? "ligada" : "desligada");
  bgmBtn.setAttribute("aria-pressed", String(Bgm.on));
  bgmBtn.hidden = !Bgm.has || Bgm.failed;   // sem arquivo de música, o botão não aparece
}
if (bgmBtn) {
  bgmBtn.addEventListener("click", async () => {
    Bgm.disarm();
    if (Bgm.on) { Bgm.stop(); Bgm.setPref(true); }
    else {
      try { if (player && player.pauseVideo) player.pauseVideo(); } catch (_) {}
      Bgm.setPref(false);
      if (await Bgm.start()) achieve("bgm", "Trilha da taverna");
    }
    render();
  });
  render();
  Bgm.arm();
  Bgm.check();
}

// ---------- Jukebox (player oficial do YouTube, carregado só depois do clique) ----------
const discs = [...document.querySelectorAll(".disc")];
const frame = document.getElementById("player-frame");
const nowEl = document.getElementById("now");
const playBtn = document.getElementById("play");
const vol = document.getElementById("vol");
let player = null, apiState = "idle", pending = null, current = null;

function setNow(text, href) {
  nowEl.textContent = text;
  if (href) {
    nowEl.append(" ");
    const a = document.createElement("a");
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    a.textContent = "Abrir no YouTube";
    nowEl.append(a);
  }
}
function ytLink(d) {
  return d.dataset.type === "list"
    ? "https://www.youtube.com/playlist?list=" + d.dataset.id
    : "https://www.youtube.com/watch?v=" + d.dataset.id;
}
function loadApi() {
  if (apiState !== "idle") return;
  apiState = "loading";
  window.onYouTubeIframeAPIReady = () => { apiState = "ready"; createPlayer(); };
  const s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  s.onerror = () => { apiState = "idle"; setNow("Não foi possível carregar o player do YouTube. Verifique sua conexão e tente de novo."); };
  document.head.appendChild(s);
}
function createPlayer() {
  const vars = { playsinline: 1, rel: 0, modestbranding: 1 };
  if (location.protocol.startsWith("http")) vars.origin = location.origin;
  player = new YT.Player("yt-player", {
    width: "100%", height: "100%", playerVars: vars,
    events: {
      onReady: () => {
        frame.classList.add("loaded");
        player.setVolume(Number(vol.value));
        if (pending) { const d = pending; pending = null; startDisc(d); }
      },
      onStateChange: onState,
      onError: onErr,
    },
  });
}
function startDisc(d) {
  if (d.dataset.type === "list") player.loadPlaylist({ listType: "playlist", list: d.dataset.id });
  else player.loadVideoById(d.dataset.id);
}
function onState(e) {
  const S = YT.PlayerState;
  if (e.data === S.PLAYING) {
    Bgm.stop(); render();
    playBtn.textContent = "Pausar";
    const title = player.getVideoData && player.getVideoData().title;
    setNow("Tocando: " + (title || "disco"));
  } else if (e.data === S.PAUSED || e.data === S.ENDED) {
    playBtn.textContent = "Tocar";
  } else if (e.data === S.BUFFERING) {
    setNow("Carregando o disco...");
  }
}
function onErr(e) {
  const code = e.data;
  const link = current ? ytLink(current) : null;
  if (code === 101 || code === 150) setNow("O dono deste vídeo não permite tocar em outros sites.", link);
  else if (code === 153) setNow("O YouTube só toca neste site quando ele está publicado na internet.", link);
  else setNow("Não foi possível tocar este disco.", link);
  playBtn.textContent = "Tocar";
}
function chooseDisc(d) {
  Bgm.stop(); Bgm.disarm();                  // escolheu um disco: a trilha de fundo para
  current = d;
  discs.forEach((b) => b.classList.toggle("active", b === d));
  if (location.protocol === "file:") {
    setNow("O jukebox só funciona no site publicado (GitHub Pages), não ao abrir o arquivo direto no computador.", ytLink(d));
    return;
  }
  achieve("jukebox", "Disco inserido");
  if (!player) { pending = d; setNow("Carregando o player..."); loadApi(); }
  else startDisc(d);
}
discs.forEach((d) => d.addEventListener("click", () => chooseDisc(d)));
playBtn.addEventListener("click", () => {
  if (!current) { chooseDisc(discs[0]); return; }
  if (!player) { chooseDisc(current); return; }
  const st = player.getPlayerState();
  if (st === YT.PlayerState.PLAYING) player.pauseVideo();
  else { Bgm.stop(); player.playVideo(); }
});
vol.addEventListener("input", () => { if (player && player.setVolume) player.setVolume(Number(vol.value)); });

// ---------- Personagem (quadros pré-renderizados da minha skin) ----------
const CHAR_DIR = "assets/char/";
["idle0","idle1","wave0","wave1","wave2","wave3","look0","look1","look2","look3","look4",
 "stand0","stand1","reach0","reach1","reach2","reach3","cheer0","cheer1","walk0","walk1","walk2","walk3"]
  .forEach((n) => { const i = new Image(); i.src = CHAR_DIR + n + ".png"; });
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

(function heroChar() {
  const img = document.getElementById("hero-char");
  const stage = document.getElementById("stage");
  if (!img || !stage) return;
  const set = (n) => { img.src = CHAR_DIR + n + ".png"; };
  if (reducedMotion) return;
  let waving = false, tick = 0, lastMove = 0;
  setInterval(() => {                       // respira quando ninguém mexe o mouse
    if (waving || performance.now() - lastMove < 1200) return;
    tick ^= 1; set("idle" + tick);
  }, 700);
  addEventListener("pointermove", (e) => {  // a cabeça acompanha o mouse
    if (waving) return;
    lastMove = performance.now();
    const r = stage.getBoundingClientRect();
    const t = (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2);
    set("look" + Math.max(0, Math.min(4, Math.round(2 + t * 2.4))));
  });
  function wave() {
    if (waving) return;
    waving = true;
    const seq = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 0];
    let k = 0;
    const iv = setInterval(() => {
      if (k >= seq.length) { clearInterval(iv); waving = false; set("idle0"); return; }
      set("wave" + seq[k++]);
    }, 140);
  }
  img.addEventListener("click", () => { wave(); achieve("wave", "Cumprimentou o dono da taverna"); });
  window.heroWave = wave;
  const io = new IntersectionObserver((es) => {
    if (es[0].isIntersecting && !introActive) { setTimeout(wave, 800); io.disconnect(); }
  }, { threshold: 0.6 });
  io.observe(img);
})();

// ---------- Abertura: o personagem abre o baú ----------
const intro = document.getElementById("intro");
let introActive = !!intro;
(function setupIntro() {
  if (!intro) return;
  let seenBefore = false;
  try { seenBefore = sessionStorage.getItem("introSeen") === "1"; } catch (_) {}
  // Quem entra por um link direto (#projetos) ou já abriu o baú nesta visita não vê a abertura de novo
  if (seenBefore || location.hash) {
    introActive = false;
    intro.remove();
    setTimeout(() => achieve("welcome", "Bem-vindo à taverna"), 700);
    return;
  }
  const rest = [...document.body.children].filter((el) => el !== intro && el.tagName !== "SCRIPT");
  const openBtn = document.getElementById("open-chest");
  const skipBtn = document.getElementById("skip-intro");
  const chest = document.getElementById("chest");
  const stage = intro.querySelector(".intro-stage");
  const ch = document.getElementById("intro-char");
  const setC = (n) => { ch.src = CHAR_DIR + n + ".png"; };
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  let walkIv, idleIv, cheerIv;
  rest.forEach((el) => { el.inert = true; });
  document.body.classList.add("intro-lock");
  openBtn.focus();

  function finish(message) {
    introActive = false;
    clearInterval(walkIv); clearInterval(idleIv); clearInterval(cheerIv);
    timers.forEach(clearTimeout);
    rest.forEach((el) => { el.inert = false; });
    document.body.classList.remove("intro-lock");
    intro.remove();
    try { sessionStorage.setItem("introSeen", "1"); } catch (_) {}
    window.scrollTo(0, 0);
    setTimeout(() => achieve("welcome", message), 500);
    setTimeout(() => { if (window.heroWave) window.heroWave(); }, 1200);
  }

  // O personagem entra andando e para ao lado do baú
  if (reducedMotion) {
    stage.classList.add("arrived"); setC("stand0");
  } else {
    let w = 0, t = 0;
    walkIv = setInterval(() => setC("walk" + (w++ % 4)), 160);
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add("arrived")));
    later(() => {
      clearInterval(walkIv); setC("stand0");
      idleIv = setInterval(() => { t ^= 1; setC("stand" + t); }, 700);
    }, 1350);
  }

  let opened = false;
  function leave() {
    intro.classList.add("leaving");
    later(() => finish("Baú aberto"), reducedMotion ? 0 : 600);
  }
  function open() {
    if (opened) return;
    opened = true;
    clearInterval(walkIv); clearInterval(idleIv);
    stage.classList.add("arrived");
    openBtn.disabled = true;
    skipBtn.style.visibility = "hidden";
    if (reducedMotion) {
      intro.classList.add("opening"); chest.classList.add("open"); setC("cheer0");
      later(leave, 250);
      return;
    }
    setC("reach0");
    later(() => setC("reach1"), 150);
    later(() => { setC("reach2"); intro.classList.add("opening"); chest.classList.add("open"); }, 300);
    later(() => setC("reach3"), 450);
    later(() => { let c = 0; setC("cheer0"); cheerIv = setInterval(() => setC("cheer" + (++c % 2)), 220); }, 800);
    later(leave, 2200);
  }
  openBtn.addEventListener("click", open);
  chest.addEventListener("click", open);
  skipBtn.addEventListener("click", () => finish("Bem-vindo à taverna"));
})();
