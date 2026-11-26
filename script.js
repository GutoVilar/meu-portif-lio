// ===== Tema claro/escuro =====
const themeBtn = document.getElementById("theme-toggle");
let themeShowTimer;
const syncThemeAria = () => themeBtn.setAttribute("aria-pressed", document.documentElement.classList.contains("light"));
syncThemeAria();
themeBtn.addEventListener("click", () => {
    const light = document.documentElement.classList.toggle("light");
    localStorage.setItem("theme", light ? "light" : "dark");
    syncThemeAria();
    // Em telas de toque (sem hover), mostra a cena animada por um instante
    themeBtn.classList.add("show");
    clearTimeout(themeShowTimer);
    themeShowTimer = setTimeout(() => themeBtn.classList.remove("show"), 1800);
});

// ===== Skills em grupos =====
// Para adicionar/remover: edite a lista "itens" de cada grupo.
//   n = nome | i = classe do ícone (devicon ou Font Awesome) | c = cor | estudo = true (borda tracejada)
//   c = "mono" usa a cor de texto do tema (para logos pretos, como GitHub)
const SKILLS = [
    { titulo: "Front-End", icone: "fa-solid fa-code", cor: "#38bdf8", itens: [
        { n: "HTML5",        i: "devicon-html5-plain",         c: "#e34f26" },
        { n: "CSS3",         i: "devicon-css3-plain",          c: "#33a9dc" },
        { n: "JavaScript",   i: "devicon-javascript-plain",    c: "#f7df1e" },
        { n: "React.js",     i: "devicon-react-original",      c: "#61dafb" },
        { n: "TypeScript",   i: "devicon-typescript-plain",    c: "#4a90e2" },
        { n: "Tailwind CSS", i: "devicon-tailwindcss-original", c: "#38bdf8" },
        { n: "Bootstrap",    i: "devicon-bootstrap-plain",     c: "#9b6dff" }
    ]},
    { titulo: "Back-End", icone: "fa-solid fa-server", cor: "#a855f7", itens: [
        { n: "Java",           i: "devicon-java-plain",       c: "#f89820", estudo: true },
        { n: "Python",         i: "devicon-python-plain",     c: "#ffd43b", estudo: true },
        { n: "APIs RESTful",   i: "fa-solid fa-plug",         c: "#34d399", estudo: true },
        { n: "MySQL",          i: "devicon-mysql-plain",      c: "#4ba3c7", estudo: true },
        { n: "PostgreSQL",     i: "devicon-postgresql-plain", c: "#4f8fc9", estudo: true },
        { n: "MongoDB",        i: "devicon-mongodb-plain",    c: "#47a248", estudo: true }
    ]},
    { titulo: "Ferramentas", icone: "fa-solid fa-screwdriver-wrench", cor: "#22c55e", itens: [
        { n: "Git",      i: "devicon-git-plain",       c: "#f05032" },
        { n: "GitHub",   i: "devicon-github-original", c: "mono" },
        { n: "Terminal", i: "fa-solid fa-terminal",    c: "#34d399" },
        { n: "VS Code",  i: "devicon-vscode-plain",    c: "#3aa0ff" },
        { n: "Docker",   i: "fa-brands fa-docker",     c: "#2496ed", estudo: true },
        { n: "AWS",      i: "fa-brands fa-aws",        c: "#ff9900", estudo: true }
    ]}
];

const grid = document.getElementById("skills-grid");
const HUB = 300, CENTRO = HUB / 2, RAIO = 112;

SKILLS.forEach((g, gi) => {
    const n = g.itens.length;
    let linhas = "", pulsos = "", nos = "";

    g.itens.forEach((it, idx) => {
        const ang = ((360 / n) * idx - 90) * Math.PI / 180;
        const x = CENTRO + RAIO * Math.cos(ang);
        const y = CENTRO + RAIO * Math.sin(ang);
        const cor = it.c === "mono" ? "var(--mono)" : it.c;

        // energia que viaja da tecnologia até o núcleo, de vez em quando (cada fio com ritmo diferente)
        const per = (5.2 + ((idx * 7 + gi * 3) % 5) * 0.6).toFixed(1);
        const atraso = (1.6 + idx * 1.1 + gi * 0.6).toFixed(1);

        linhas += `<line x1="${CENTRO}" y1="${CENTRO}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" pathLength="1" style="--d:${idx}"/>`;
        pulsos += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${CENTRO}" y2="${CENTRO}" pathLength="1" style="--per:${per}s;--dl:${atraso}s"/>`;
        nos += `<div class="hub-node${it.estudo ? " estudo" : ""}" style="left:${(x / HUB * 100).toFixed(2)}%;top:${(y / HUB * 100).toFixed(2)}%;--c:${cor};--d:${idx}" data-name="${it.n}${it.estudo ? " (em estudo)" : ""}" tabindex="0" aria-label="${it.n}"><span class="node-btn"><i class="${it.i}"></i></span></div>`;
    });

    grid.insertAdjacentHTML("beforeend",
        `<div class="skill-group" style="--g:${g.cor}">
            <h3>${g.titulo}</h3>
            <div class="hub">
                <svg class="hub-lines" viewBox="0 0 ${HUB} ${HUB}" aria-hidden="true">${linhas}</svg>
                <svg class="hub-pulsos" viewBox="0 0 ${HUB} ${HUB}" aria-hidden="true">${pulsos}</svg>
                <div class="hub-core"><i class="${g.icone}"></i></div>
                ${nos}
            </div>
        </div>`);
});

// Anima os hubs quando aparecem na tela
const hubObs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); hubObs.unobserve(e.target); } });
}, { threshold: 0.25 });
document.querySelectorAll(".skill-group").forEach((el) => hubObs.observe(el));

// ===== Rolagem de linguagens =====
const marquee = document.getElementById("marquee-track");
const icones = SKILLS.flatMap((g) => g.itens.map((i) => i.i));
const faixa = icones.map((ic) => `<i class="${ic}"></i>`).join("");
marquee.innerHTML = faixa + faixa;

// ===== Esfera 3D girando (tipo planeta): tecnologias + redes sociais =====
(() => {
    const anel = document.getElementById("orbit-ring");
    if (!anel) return;
    const orbit = anel.parentElement;
    orbit.classList.add("esfera");
    anel.classList.add("esfera-anel");

    // usa as mesmas tecnologias da lista SKILLS + redes sociais
    const itens = SKILLS.flatMap((g) => g.itens)
        .filter((it) => it.n !== "GitHub")
        .map((it) => ({ n: it.n, i: it.i, c: it.c === "mono" ? "var(--mono)" : it.c }))
        .concat([
            { n: "GitHub",   i: "fa-brands fa-github",      social: 1 },
            { n: "LinkedIn", i: "fa-brands fa-linkedin-in", social: 1 },
            { n: "WhatsApp", i: "fa-brands fa-whatsapp",    social: 1 },
            { n: "E-mail",   i: "fa-solid fa-envelope",     social: 1 }
        ]);

    // distribui os ícones uniformemente na superfície da esfera
    const total = itens.length;
    const ouro = Math.PI * (3 - Math.sqrt(5));
    const pontos = itens.map((it, k) => {
        const y = 1 - (k / (total - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const a = k * ouro;
        const el = document.createElement("div");
        el.className = "globo-item" + (it.social ? " social" : "");
        el.dataset.name = it.n;
        el.setAttribute("aria-label", it.n);
        if (it.c) el.style.setProperty("--ic", it.c);
        el.innerHTML = `<i class="${it.i}"></i>`;
        anel.appendChild(el);
        return { el, x: Math.cos(a) * r, y, z: Math.sin(a) * r };
    });

    const BASE = 0.0045;                       // velocidade do giro automático
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let R = 150, ax = 0.35, ay = 0, vx = 0, vy = BASE, alvoX = 0, alvoY = BASE;
    let visivel = true, rodando = false;

    function medir() { R = Math.max(80, Math.min(orbit.clientWidth, orbit.clientHeight) / 2 - 26); }

    function desenhar() {
        const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
        for (const p of pontos) {
            const x1 = p.x * cy + p.z * sy;          // gira em Y
            const z1 = -p.x * sy + p.z * cy;
            const y2 = p.y * cx - z1 * sx;           // gira em X
            const z2 = p.y * sx + z1 * cx;
            const prof = (z2 + 1) / 2;               // 0 = atrás, 1 = na frente
            const esc = 0.55 + prof * 0.6;
            p.el.style.transform = `translate3d(${(x1 * R).toFixed(1)}px, ${(y2 * R).toFixed(1)}px, 0) scale(${esc.toFixed(3)})`;
            p.el.style.opacity = (0.22 + prof * 0.78).toFixed(2);
            p.el.style.zIndex = String(Math.round(prof * 100) + 1);
            p.el.style.pointerEvents = prof > 0.4 ? "auto" : "none";
        }
    }

    function passo() {
        if (!visivel) { rodando = false; return; }
        vx += (alvoX - vx) * 0.05;
        vy += (alvoY - vy) * 0.05;
        ax += vx; ay += vy;
        desenhar();
        requestAnimationFrame(passo);
    }
    function iniciar() { if (rodando || reduz) return; rodando = true; requestAnimationFrame(passo); }

    // o mouse controla a direção do giro; em cima de um ícone ele para (para ler o nome)
    orbit.addEventListener("pointermove", (e) => {
        if (e.target.closest(".globo-item")) { alvoX = 0; alvoY = 0; return; }
        const b = orbit.getBoundingClientRect();
        const nx = ((e.clientX - b.left) / b.width - 0.5) * 2;
        const ny = ((e.clientY - b.top) / b.height - 0.5) * 2;
        alvoY = BASE + nx * 0.02;
        alvoX = -ny * 0.012;
    });
    orbit.addEventListener("pointerleave", () => { alvoX = 0; alvoY = BASE; });

    window.addEventListener("resize", () => { medir(); desenhar(); });
    new IntersectionObserver((en) => { visivel = en[0].isIntersecting; if (visivel) iniciar(); }).observe(orbit);

    medir();
    desenhar();
    iniciar();
})();

// ===== Luz que segue o cursor: projetos, experiências e certificados =====
document.querySelectorAll(".projeto-card, .exp-card, .cert-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
});

// ============================================================
// FUNDO INTERATIVO: galáxia (escuro) + código (claro)
// ============================================================
(() => {
    const canvas = document.getElementById("galaxia-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const nebula = document.querySelector(".galaxia-nebula");
    const root = document.documentElement;

    const DENSIDADE_ESTRELAS = 1 / 4600;
    const PARTICULAS_ESPIRAL = 1300;
    const RAIO_MOUSE = 160;
    const FORCA_REPULSAO = 1.05;
    const CORES_ESCURO = ["#ffffff", "#cfe3ff", "#64ffda", "#9db4ff", "#c4a1ff"];
    const CORES_CLARO = ["#1d4ed8", "#0284c7", "#2563eb", "#4f46e5", "#0ea5e9"];
    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, DPR = 1;
    let estrelas = [], espiral = [], cadentes = [], faiscas = [], ondas = [];
    const mouse = { x: -9999, y: -9999, nx: 0, ny: 0, sx: 0, sy: 0, ativo: false };
    let scrollY = window.scrollY, scrollSuave = scrollY;
    let rodando = true, ultimo = 0, proxCadente = 2800;

    const rand = (a, b) => a + Math.random() * (b - a);
    const isLight = () => root.classList.contains("light");
    const coresAtuais = () => (isLight() ? CORES_CLARO : CORES_ESCURO);

    function criarEstrelas() {
        const total = Math.round(W * H * DENSIDADE_ESTRELAS);
        estrelas = Array.from({ length: total }, () => {
            const z = Math.random();
            const camada = z < 0.6 ? 0 : z < 0.9 ? 1 : 2;
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                ox: 0, oy: 0,
                vx: 0, vy: 0,
                dx: rand(-0.22, 0.22),
                dy: rand(-0.18, 0.18),
                camada,
                r: [rand(0.45, 0.95), rand(0.85, 1.45), rand(1.3, 2.1)][camada],
                prof: [0.012, 0.03, 0.06][camada],
                idxCor: (Math.random() * 5) | 0,
                tw: rand(0, Math.PI * 2),
                tv: rand(0.8, 2.5),
                base: rand(0.42, 0.95)
            };
        });
    }

    function criarEspiral() {
        const BRACOS = 3;
        espiral = Array.from({ length: PARTICULAS_ESPIRAL }, () => {
            const t = Math.pow(Math.random(), 0.65);
            const r = t * 1;
            const braco = ((Math.random() * BRACOS) | 0) * (Math.PI * 2 / BRACOS);
            const giro = r * 5.2;
            const dispersao = (Math.random() - 0.5) * (0.18 + r * 0.5);
            return {
                r,
                a: braco + giro + dispersao,
                s: rand(0.5, 1.6),
                corEscuro: r < 0.18 ? "255,236,200" : r < 0.5 ? "190,160,255" : Math.random() < 0.5 ? "120,170,255" : "100,255,218",
                corClaro: r < 0.18 ? "29,78,216" : r < 0.5 ? "79,70,229" : Math.random() < 0.5 ? "37,99,235" : "2,132,199",
                al: rand(0.32, 0.9) * (1 - r * 0.4)
            };
        });
    }

    // ---------- TEMA CLARO: fundo "código" ----------
    const GRADE = 34;
    const TOKENS = ["{ }", "</>", "=>", "( )", "[ ]", ";", "0", "1", "&&", "||", "===", "!=", "++", "//", "/* */",
        "const", "let", "async", "await", "return", "if", "else", "for", "import", "class", "null", "true",
        "map()", "fn()", "<div>", ".css", "#id", "npm", "git", "JSON", "API", "SELECT", "def", "void", "useState"];
    const CORES_TOKEN = ["#1d4ed8", "#0369a1", "#4f46e5", "#0f766e", "#1e40af"];
    const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace";
    let grade = null, fichas = [], chuva = [], codigoClique = [];

    function criarCodigo() {
        grade = document.createElement("canvas");
        grade.width = W * DPR; grade.height = H * DPR;
        const g = grade.getContext("2d");
        g.setTransform(DPR, 0, 0, DPR, 0, 0);
        g.fillStyle = "rgba(30, 64, 175, 0.24)";
        for (let x = GRADE / 2; x < W; x += GRADE) {
            for (let y = GRADE / 2; y < H; y += GRADE) {
                g.beginPath(); g.arc(x, y, 1.15, 0, Math.PI * 2); g.fill();
            }
        }

        const total = Math.min(110, Math.round(W * H / 21000));
        fichas = Array.from({ length: total }, () => {
            const tam = rand(13, 25);
            return {
                s: TOKENS[(Math.random() * TOKENS.length) | 0],
                x: Math.random() * W, y: Math.random() * H,
                ox: 0, oy: 0, vx: 0, vy: 0,
                dx: rand(-0.07, 0.07), dy: -rand(0.08, 0.3),
                fonte: `600 ${tam.toFixed(0)}px ${MONO}`,
                cor: CORES_TOKEN[(Math.random() * CORES_TOKEN.length) | 0],
                base: rand(0.13, 0.3),
                prof: rand(0.012, 0.06)
            };
        });

        const passo = 72;
        chuva = Array.from({ length: Math.floor(W / passo) }, (_, i) => ({
            x: i * passo + rand(10, passo - 10),
            y: rand(-H, H),
            v: rand(0.5, 1.4),
            len: 6 + ((Math.random() * 7) | 0),
            ch: Array.from({ length: 13 }, () => "01{}<>/;="[(Math.random() * 9) | 0])
        }));
    }

    function desenharCodigo(t) {
        ctx.clearRect(0, 0, W, H);
        if (grade) ctx.drawImage(grade, 0, 0, W, H);
        const ativo = mouse.ativo && !reduzMovimento;
        const R = 175;

        // pontos da grade acendem perto do cursor
        if (ativo) {
            const gx0 = Math.max(0, Math.floor((mouse.x - R) / GRADE));
            const gx1 = Math.ceil((mouse.x + R) / GRADE);
            const gy0 = Math.max(0, Math.floor((mouse.y - R) / GRADE));
            const gy1 = Math.ceil((mouse.y + R) / GRADE);
            for (let gx = gx0; gx <= gx1; gx++) {
                for (let gy = gy0; gy <= gy1; gy++) {
                    const px = gx * GRADE + GRADE / 2, py = gy * GRADE + GRADE / 2;
                    const d = Math.hypot(px - mouse.x, py - mouse.y);
                    if (d >= R) continue;
                    const f = 1 - d / R;
                    ctx.fillStyle = `rgba(29,78,216,${0.2 + f * 0.7})`;
                    ctx.beginPath(); ctx.arc(px, py, 1.2 + f * 2.4, 0, Math.PI * 2); ctx.fill();
                }
            }
        }

        // chuva de 0/1 e símbolos
        ctx.font = `500 14px ${MONO}`;
        for (let i = 0; i < chuva.length; i++) {
            const c = chuva[i];
            const perto = ativo && Math.abs(c.x - mouse.x) < 95;
            if (!reduzMovimento) c.y += c.v * (perto ? 2.6 : 1);
            if (c.y - c.len * 17 > H) { c.y = -rand(0, 240); c.v = rand(0.5, 1.4); }
            for (let k = 0; k < c.len; k++) {
                if (!reduzMovimento && Math.random() < 0.012) c.ch[k] = "01{}<>/;="[(Math.random() * 9) | 0];
                const a = (1 - k / c.len) * (perto ? 0.55 : 0.2);
                ctx.globalAlpha = a;
                ctx.fillStyle = k === 0 ? "#0f766e" : "#1d4ed8";
                ctx.fillText(c.ch[k], c.x, c.y - k * 17);
            }
        }
        ctx.globalAlpha = 1;

        // símbolos de código flutuando (reagem ao mouse)
        const proximos = [];
        for (let i = 0; i < fichas.length; i++) {
            const f = fichas[i];
            if (!reduzMovimento) {
                f.x += f.dx; f.y += f.dy;
                if (f.y < -40) { f.y = H + 40; f.x = Math.random() * W; }
                if (f.x < -80) f.x = W + 40;
                if (f.x > W + 80) f.x = -40;
            }
            let x = f.x - mouse.sx * 650 * f.prof + f.ox;
            let y = f.y - mouse.sy * 650 * f.prof - scrollSuave * f.prof * 1.6 + f.oy;
            y = ((y % (H + 80)) + (H + 80)) % (H + 80) - 40;

            let prox = 0;
            if (ativo) {
                const dx = x - mouse.x, dy = y - mouse.y;
                const d = Math.hypot(dx, dy);
                if (d < 190 && d > 0.1) {
                    prox = 1 - d / 190;
                    if (d < 130) { f.vx += (dx / d) * (1 - d / 130) * 0.9; f.vy += (dy / d) * (1 - d / 130) * 0.9; }
                    if (prox > 0.3) proximos.push({ x, y, prox });
                }
            }
            f.vx -= f.ox * 0.03; f.vy -= f.oy * 0.03;
            f.vx *= 0.9; f.vy *= 0.9;
            f.ox += f.vx; f.oy += f.vy;

            ctx.font = f.fonte;
            ctx.globalAlpha = Math.min(0.95, f.base + prox * 0.65);
            ctx.fillStyle = f.cor;
            ctx.fillText(f.s, x, y);
        }
        ctx.globalAlpha = 1;

        // linhas ligando símbolos ao cursor
        if (proximos.length) {
            ctx.lineWidth = 1;
            const lim = Math.min(proximos.length, 14);
            for (let i = 0; i < lim; i++) {
                const p = proximos[i];
                ctx.strokeStyle = `rgba(29,78,216,${p.prox * 0.45})`;
                ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(p.x + 8, p.y - 5); ctx.stroke();
                for (let j = i + 1; j < lim; j++) {
                    const q = proximos[j];
                    const d = Math.hypot(p.x - q.x, p.y - q.y);
                    if (d < 110) {
                        ctx.strokeStyle = `rgba(2,132,199,${(1 - d / 110) * 0.4})`;
                        ctx.beginPath(); ctx.moveTo(p.x + 8, p.y - 5); ctx.lineTo(q.x + 8, q.y - 5); ctx.stroke();
                    }
                }
            }
        }

        // brilho do cursor
        if (ativo) {
            const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 110);
            g.addColorStop(0, "rgba(29,78,216,0.16)");
            g.addColorStop(1, "rgba(29,78,216,0)");
            ctx.fillStyle = g;
            ctx.fillRect(mouse.x - 110, mouse.y - 110, 220, 220);
        }

        // clique: onda + símbolos voando
        for (let i = ondas.length - 1; i >= 0; i--) {
            const o = ondas[i];
            o.r += 4.2; o.vida -= 1;
            ctx.strokeStyle = `rgba(29,78,216,${Math.max(0, o.vida / o.max) * 0.6})`;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.stroke();
            if (o.vida <= 0) ondas.splice(i, 1);
        }
        ctx.font = `700 17px ${MONO}`;
        for (let i = codigoClique.length - 1; i >= 0; i--) {
            const c = codigoClique[i];
            c.x += c.vx; c.y += c.vy; c.vx *= 0.96; c.vy *= 0.96; c.vida -= 1;
            ctx.globalAlpha = Math.max(0, c.vida / c.max);
            ctx.fillStyle = c.cor;
            ctx.fillText(c.s, c.x, c.y);
            if (c.vida <= 0) codigoClique.splice(i, 1);
        }
        ctx.globalAlpha = 1;
    }

    function ajustar() {
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * DPR;
        canvas.height = H * DPR;
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        criarEstrelas();
        criarCodigo();
        if (!espiral.length) criarEspiral();
        if (reduzMovimento) desenhar(0);
    }

    function desenharEspiral(t) {
        const claro = isLight();
        const tamanho = Math.min(W, H) * (W < 700 ? 0.55 : 0.42);
        const cx = W * (W < 700 ? 0.7 : 0.8) + mouse.sx * -24;
        const cy = H * 0.3 - scrollSuave * 0.12 + mouse.sy * -18;
        const inclina = 0.42;
        const rot = -0.5;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, tamanho * 0.35);
        if (claro) {
            g.addColorStop(0, "rgba(29,78,216,0.22)");
            g.addColorStop(0.35, "rgba(2,132,199,0.12)");
            g.addColorStop(1, "rgba(0,0,0,0)");
        } else {
            g.addColorStop(0, "rgba(255,240,210,0.55)");
            g.addColorStop(0.35, "rgba(170,140,255,0.18)");
            g.addColorStop(1, "rgba(0,0,0,0)");
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cx, cy, tamanho * 0.35, tamanho * 0.35 * inclina + 8, rot, 0, Math.PI * 2);
        ctx.fill();

        const cosR = Math.cos(rot), sinR = Math.sin(rot);
        for (let i = 0; i < espiral.length; i++) {
            const p = espiral[i];
            const ang = p.a + t * 0.000055 / (0.25 + p.r);
            const x0 = Math.cos(ang) * p.r * tamanho;
            const y0 = Math.sin(ang) * p.r * tamanho * inclina;
            const x = cx + x0 * cosR - y0 * sinR;
            const y = cy + x0 * sinR + y0 * cosR;
            if (x < -5 || x > W + 5 || y < -5 || y > H + 5) continue;
            const rgb = claro ? p.corClaro : p.corEscuro;
            const alpha = claro ? Math.min(0.88, p.al * 0.95) : p.al;
            ctx.fillStyle = `rgba(${rgb},${alpha})`;
            ctx.fillRect(x, y, p.s, p.s);
        }
    }

    function desenhar(t) {
        if (isLight()) { desenharCodigo(t); return; }
        ctx.clearRect(0, 0, W, H);
        const claro = isLight();
        const cores = coresAtuais();

        desenharEspiral(t);

        const perto = [];
        for (let i = 0; i < estrelas.length; i++) {
            const e = estrelas[i];

            if (!reduzMovimento) {
                e.x = ((e.x + e.dx) % W + W) % W;
                e.y = ((e.y + e.dy) % H + H) % H;
            }

            const px = -mouse.sx * 65 * e.prof * 10;
            const py = -mouse.sy * 65 * e.prof * 10 - scrollSuave * e.prof * 1.6;

            let x = e.x + px + e.ox;
            let y = e.y + py + e.oy;
            y = ((y % H) + H) % H;
            x = ((x % W) + W) % W;

            if (mouse.ativo && !reduzMovimento) {
                const dx = x - mouse.x, dy = y - mouse.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < RAIO_MOUSE * RAIO_MOUSE && d2 > 0.01) {
                    const d = Math.sqrt(d2);
                    const f = (1 - d / RAIO_MOUSE) * FORCA_REPULSAO;
                    e.vx += (dx / d) * f;
                    e.vy += (dy / d) * f;
                    if (e.camada > 0) perto.push({ x, y });
                }
            }
            e.vx += -e.ox * 0.03; e.vy += -e.oy * 0.03;
            e.vx *= 0.9; e.vy *= 0.9;
            e.ox += e.vx; e.oy += e.vy;

            const cor = cores[e.idxCor];
            const br = reduzMovimento ? e.base : e.base * (0.65 + 0.35 * Math.sin(t * 0.0012 * e.tv + e.tw));
            ctx.globalAlpha = Math.max(0.18, Math.min(1, claro ? br * 0.9 : br));
            ctx.fillStyle = cor;
            if (!claro && e.r > 1.3) {
                ctx.shadowColor = cor;
                ctx.shadowBlur = 6;
            }
            ctx.beginPath();
            ctx.arc(x, y, e.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;

        if (perto.length > 1) {
            ctx.lineWidth = 0.85;
            const lim = perto.length > 40 ? 40 : perto.length;
            for (let i = 0; i < lim; i++) {
                const dm = Math.hypot(perto[i].x - mouse.x, perto[i].y - mouse.y);
                ctx.strokeStyle = claro
                    ? `rgba(29,78,216,${(1 - dm / RAIO_MOUSE) * 0.55})`
                    : `rgba(100,255,218,${(1 - dm / RAIO_MOUSE) * 0.5})`;
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(perto[i].x, perto[i].y);
                ctx.stroke();

                for (let j = i + 1; j < lim; j++) {
                    const d = Math.hypot(perto[i].x - perto[j].x, perto[i].y - perto[j].y);
                    if (d < 85) {
                        ctx.strokeStyle = claro
                            ? `rgba(2,132,199,${(1 - d / 85) * 0.5})`
                            : `rgba(157,180,255,${(1 - d / 85) * 0.45})`;
                        ctx.beginPath();
                        ctx.moveTo(perto[i].x, perto[i].y);
                        ctx.lineTo(perto[j].x, perto[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        if (mouse.ativo && !reduzMovimento) {
            const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 95);
            g.addColorStop(0, claro ? "rgba(29,78,216,0.14)" : "rgba(100,255,218,0.10)");
            g.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = g;
            ctx.fillRect(mouse.x - 95, mouse.y - 95, 190, 190);
        }

        for (let i = ondas.length - 1; i >= 0; i--) {
            const o = ondas[i];
            o.r += 4.2;
            o.vida -= 1;
            const alpha = Math.max(0, o.vida / o.max) * (claro ? 0.55 : 0.65);
            ctx.strokeStyle = claro
                ? `rgba(29,78,216,${alpha})`
                : `rgba(100,255,218,${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
            ctx.stroke();
            if (o.vida <= 0) ondas.splice(i, 1);
        }

        for (let i = cadentes.length - 1; i >= 0; i--) {
            const c = cadentes[i];
            c.x += c.vx; c.y += c.vy; c.vida -= 1;
            const a = Math.max(0, c.vida / c.max);
            const g = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 14, c.y - c.vy * 14);
            if (claro) {
                g.addColorStop(0, `rgba(29,78,216,${a * 0.8})`);
                g.addColorStop(1, "rgba(2,132,199,0)");
            } else {
                g.addColorStop(0, `rgba(255,255,255,${a})`);
                g.addColorStop(1, "rgba(100,255,218,0)");
            }
            ctx.strokeStyle = g;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(c.x, c.y);
            ctx.lineTo(c.x - c.vx * 14, c.y - c.vy * 14);
            ctx.stroke();
            if (c.vida <= 0) cadentes.splice(i, 1);
        }

        for (let i = faiscas.length - 1; i >= 0; i--) {
            const f = faiscas[i];
            f.x += f.vx; f.y += f.vy;
            f.vx *= 0.96; f.vy *= 0.96;
            f.vida -= 1;
            ctx.globalAlpha = Math.max(0, f.vida / f.max);
            ctx.fillStyle = cores[f.idxCor];
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
            if (f.vida <= 0) faiscas.splice(i, 1);
        }
        ctx.globalAlpha = 1;
    }

    function novaCadente() {
        const doTopo = Math.random() < 0.5;
        const x = doTopo ? rand(W * 0.2, W) : W + 10;
        const y = doTopo ? -10 : rand(0, H * 0.5);
        const vel = rand(9, 15);
        const ang = rand(Math.PI * 0.68, Math.PI * 0.82);
        cadentes.push({ x, y, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel, vida: 70, max: 70 });
    }

    function explodir(x, y) {
        if (isLight()) {
            ondas.push({ x, y, r: 8, vida: 42, max: 42 });
            for (let i = 0; i < 16; i++) {
                const a = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
                const v = rand(1.6, 4.8);
                codigoClique.push({
                    s: TOKENS[(Math.random() * TOKENS.length) | 0],
                    x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
                    cor: CORES_TOKEN[(Math.random() * CORES_TOKEN.length) | 0],
                    vida: 70, max: 70
                });
            }
            return;
        }
        ondas.push({ x, y, r: 8, vida: 42, max: 42 });
        for (let i = 0; i < 28; i++) {
            const a = (Math.PI * 2 * i) / 28 + Math.random() * 0.3;
            const v = rand(1.4, 4.6);
            faiscas.push({
                x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
                r: rand(1.1, 2.5), vida: 60, max: 60,
                idxCor: (Math.random() * 5) | 0
            });
        }
        for (let i = 0; i < estrelas.length; i++) {
            const e = estrelas[i];
            const dx = e.x - x, dy = e.y - y;
            const dist = Math.hypot(dx, dy);
            if (dist < 220 && dist > 0.1) {
                const impulso = (1 - dist / 220) * 6.5;
                e.vx += (dx / dist) * impulso;
                e.vy += (dy / dist) * impulso;
            }
        }
    }

    function loop(t) {
        if (!rodando) return;
        const dt = t - ultimo; ultimo = t;

        mouse.sx += (mouse.nx - mouse.sx) * 0.06;
        mouse.sy += (mouse.ny - mouse.sy) * 0.06;
        scrollSuave += (scrollY - scrollSuave) * 0.08;

        if (nebula) {
            nebula.style.transform =
                `translate3d(${(-mouse.sx * 24).toFixed(1)}px, ${(-mouse.sy * 18 - scrollSuave * 0.04).toFixed(1)}px, 0)`;
        }

        proxCadente -= dt;
        if (proxCadente <= 0) { novaCadente(); proxCadente = rand(3200, 8500); }

        desenhar(t);
        requestAnimationFrame(loop);
    }

    window.addEventListener("resize", ajustar);
    window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

    window.addEventListener("pointermove", (e) => {
        mouse.x = e.clientX; mouse.y = e.clientY; mouse.ativo = true;
        mouse.nx = (e.clientX / W - 0.5) * 2;
        mouse.ny = (e.clientY / H - 0.5) * 2;
    }, { passive: true });
    document.addEventListener("pointerleave", () => { mouse.ativo = false; mouse.nx = 0; mouse.ny = 0; });
    window.addEventListener("pointerup", (e) => { if (e.pointerType === "touch") mouse.ativo = false; });

    window.addEventListener("pointerdown", (e) => {
        if (reduzMovimento) return;
        if (e.target.closest("a, button, input, textarea, label")) return;
        explodir(e.clientX, e.clientY);
    });

    function atualizarPausa() {
        const deveRodar = !document.hidden && !reduzMovimento;
        if (deveRodar && !rodando) { rodando = true; ultimo = performance.now(); requestAnimationFrame(loop); }
        if (!deveRodar) rodando = false;
    }
    document.addEventListener("visibilitychange", atualizarPausa);

    new MutationObserver(() => { if (reduzMovimento) desenhar(0); }).observe(root, { attributes: true, attributeFilter: ["class"] });

    ajustar();
    rodando = false;
    if (reduzMovimento) desenhar(0);
    atualizarPausa();
})();
// ===== Aparecer conforme rola a tela =====
// Para animar outro elemento, adicione o seletor na lista abaixo.
(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const lista = [
        [".txt-hero", "dir"], [".img-hero", "esq"],
        [".sec-tag-wrap"], [".titulo"], [".subtitulo"], [".marquee"], [".orbit-wrap"],
        [".img-sobre", "esq"], [".txt-sobre", "dir"],
        [".timeline-item"], [".projeto-card"], [".cert-card"],
        [".info-contato h3"], [".box-info"], [".form-contato"], [".footer-col"]
    ];
    const alvos = [];
    lista.forEach(([sel, dir]) => document.querySelectorAll(sel).forEach((el) => {
        if (el.classList.contains("reveal")) return;
        el.classList.add("reveal");
        if (dir) el.classList.add(dir);
        // escalonamento: irmãos do mesmo tipo entram um depois do outro
        const irmaos = [...el.parentElement.children].filter((c) => c.matches(sel));
        el.style.setProperty("--rd", Math.min(irmaos.indexOf(el), 5) * 0.1 + "s");
        alvos.push(el);
    }));
    const obs = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target;
            obs.unobserve(el);
            el.classList.add("visivel");
            // depois que termina, remove as classes para não atrapalhar os efeitos de hover
            setTimeout(() => el.classList.remove("reveal", "visivel", "esq", "dir"), 1600);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    const iniciar = () => alvos.forEach((el) => obs.observe(el));
    if (document.documentElement.classList.contains("intro-ativa")) addEventListener("intro-fim", iniciar, { once: true });
    else iniciar();
})();