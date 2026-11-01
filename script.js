const CONFIG = {
  curso: "Conclusão do Ensino Médio",
  data: "2026-12-11T20:00:00-03:00",
  whatsapp: "5538998709424",
  textos: [
    "Existem pessoas que fazem parte da nossa história de um jeito tão especial que uma conquista só fica completa quando elas estão por perto. Você é uma dessas pessoas.",
    "Depois de tanto esforço, aprendizados e noites em claro, chegou o momento de celebrar a minha formatura. E eu não imagino esse dia sem você ao meu lado.",
    "Por isso, tenho a alegria de convidá-la para essa data tão marcante!",
    "Sua presença vai tornar esse momento ainda mais inesquecível!"
  ],
  assinatura: "Com carinho, Guilherme"
};

const $ = id => document.getElementById(id);
const d = new Date(CONFIG.data);
const TZ = "America/Sao_Paulo"; // a data aparece igual para todos, em qualquer fuso
const Y = d.toLocaleDateString("pt-BR", {year: "numeric", timeZone: TZ});
const para = new URLSearchParams(location.search).get("para"); // use ?para=Maria no link
$("for").textContent = para ? "Para " + para : "";
$("turma").textContent = "TURMA " + Y;
$("curso").textContent = CONFIG.curso;
CONFIG.textos.forEach((t, i) => $("p" + (i + 1)).textContent = t);
const [ca, cb] = CONFIG.assinatura.split(", ");
$("carinho").textContent = ca + ",";
$("signT").textContent = cb;
$("sem").textContent = d.toLocaleDateString("pt-BR", {weekday:"long", timeZone:TZ});
$("dia").textContent = d.toLocaleDateString("pt-BR", {day:"numeric", timeZone:TZ});
$("num").textContent = d.toLocaleDateString("pt-BR", {timeZone:TZ});
$("mes").textContent = d.toLocaleDateString("pt-BR", {month:"long", year:"numeric", timeZone:TZ}).replace(" de ", " de ");
$("year").textContent = Y;
$("end").textContent = "FORMATURA " + Y;
const [hh, mm] = d.toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit", timeZone:TZ}).split(":");
$("hora").textContent = "ÀS " + hh + "H" + (mm === "00" ? "" : mm);
$("rsvp").href = `https://wa.me/${CONFIG.whatsapp}?text=` + encodeURIComponent(`Olá, Guilherme! Confirmo minha presença na sua formatura${para ? " (" + para + ")" : ""}. 🎓`);
const f = x => x.toISOString().replace(/[-:]|\.\d{3}/g, "");
$("agenda").href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Formatura do Guilherme")}&dates=${f(d)}/${f(new Date(d.getTime() + 5 * 36e5))}`;
$("ringText").textContent = ("FORMATURA " + Y + " • ").repeat(3);

function tick() {
  const ms = d - Date.now();
  if (ms <= 0) { $("count").textContent = "É hoje! 🎓"; return; }
  let r = ms;
  $("count").innerHTML = [[864e5, "DIAS"], [36e5, "HORAS"], [6e4, "MIN"], [1e3, "SEG"]].map(([u, l]) => {
    const n = Math.floor(r / u); r %= u;
    return `<div><strong>${String(n).padStart(2, "0")}</strong><small>${l}</small></div>`;
  }).join("");
}
tick(); setInterval(tick, 1000);

const seal = $("seal");

// inclinação 3D do selo
$("cover").addEventListener("pointermove", e => {
  const r = seal.getBoundingClientRect();
  seal.style.setProperty("--ry", ((e.clientX - r.left - r.width / 2) / innerWidth) * 30 + "deg");
  seal.style.setProperty("--rx", -((e.clientY - r.top - r.height / 2) / innerHeight) * 30 + "deg");
});
// poeira dourada + confete
const burst = (() => {
  const c = $("dust"), x = c.getContext("2d");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cols = ["#fbeec3", "#d9b25f", "#f3dc9c", "#9a7632", "#fff1c4"];
  let w, h, dust = [], conf = [];
  const size = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
  addEventListener("resize", size); size();
  if (!calm) for (let i = 0; i < 46; i++) dust.push({x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + .4, v: Math.random() * .3 + .08, a: Math.random() * .6 + .2, s: Math.random() * 6});
  (function draw(t) {
    x.clearRect(0, 0, w, h);
    dust.forEach(o => {
      o.y -= o.v; if (o.y < -4) { o.y = h + 4; o.x = Math.random() * w; }
      x.beginPath(); x.arc(o.x + Math.sin(t / 2500 + o.s) * 10, o.y, o.r, 0, 7);
      x.fillStyle = `rgba(240,208,130,${o.a * (.55 + .45 * Math.sin(t / 700 + o.s))})`;
      x.shadowBlur = 8; x.shadowColor = "#d9b25f"; x.fill();
    });
    x.shadowBlur = 0;
    conf = conf.filter(q => q.l > 0);
    conf.forEach(q => {
      q.vx *= .985; q.vy = q.vy * .99 + .2; q.x += q.vx; q.y += q.vy; q.rot += q.vr; q.l -= .007;
      x.save(); x.translate(q.x, q.y); x.rotate(q.rot); x.globalAlpha = Math.max(q.l, 0);
      x.fillStyle = q.c; x.scale(1, Math.cos(q.rot * 2.4));
      q.k ? (x.beginPath(), x.arc(0, 0, q.s / 2, 0, 7), x.fill()) : x.fillRect(-q.s, -q.s / 2, q.s * 2, q.s);
      x.restore();
    });
    requestAnimationFrame(draw);
  })(0);
  return (cx, cy) => {
    if (calm) return;
    for (let i = 0; i < 140; i++) {
      const a = Math.random() * 6.283, v = Math.random() * 11 + 3;
      conf.push({x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, s: Math.random() * 4 + 3, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, l: 1 + Math.random() * .4, c: cols[i % 5], k: i % 3 === 0});
    }
  };
})();

// abrir convite
seal.addEventListener("click", () => {
  const r = seal.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2);
  $("cover").classList.add("open");
  document.body.classList.add("opened");
  setTimeout(() => $("cover").classList.add("gone"), 2600);
  // blocos que aparecem conforme a rolagem
  setTimeout(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold: .15});
    document.querySelectorAll("blockquote,.txt p,.orn,.when,.rsvp>*").forEach((el, i) => {
      el.classList.add("rv");
      if (el.matches(".txt p")) el.style.setProperty("--rd", (i % 3) * .15 + "s");
      else if (el.parentElement.classList.contains("rsvp")) el.style.setProperty("--rd", [...el.parentElement.children].indexOf(el) * .14 + "s");
      io.observe(el);
    });
  }, 3600);
});

// barra de progresso e parallax do ano
const bar = $("bar"), year = $("year");
addEventListener("scroll", () => {
  const m = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (m > 0 ? scrollY / m * 100 : 0) + "%";
  year.style.transform = `translate(-50%, calc(-50% + ${Math.min(scrollY, innerHeight) * .28}px))`;
}, {passive: true});
// confete ao confirmar presença
$("rsvp").addEventListener("click", e => {
  const r = e.currentTarget.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2);
});

$("top").addEventListener("click", () => scrollTo({top: 0, behavior: "smooth"}));
