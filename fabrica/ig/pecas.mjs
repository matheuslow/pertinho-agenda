// Moldes de feed (1080x1350) e story (1080x1920) do @infancia.pertinho.
import { top, logo, card, front, phone, shot, art, tela, SYM, HANDLE, LINK } from "./kit.mjs";
import { M as M2 } from "./missoes.mjs";

export const FD = { w: 1080, h: 1350 }, SY = { w: 1080, h: 1920 };
const n = (i, t) => (t > 1 ? `${i}/${t}` : "");
const sw = (i, t) => (t > 1 && i < t ? `<div class="swipe">Arrasta ›</div>` : "");
const bgp = (a, pos = "50% 50%", shade = 0.5) => `<img class="photo" src="${art(a)}" style="object-position:${pos}"><div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(20,16,12,${shade}) 0%,rgba(20,16,12,${shade * 0.25}) 45%,rgba(20,16,12,${shade * 0.15}) 65%,rgba(20,16,12,${shade * 0.8}) 100%)"></div>`;

let fimK = 0;
const FIMVIS = [
  () => phone(tela("t0-06"), 560, 640, 400, 5) + phone(tela("t0-05"), 130, 720, 380, -5),
  () => front(110, 650, 360, 520, "Brincadeira de hoje", -7) + card(M2.estatua, 500, 600, 600, 5, "", 0.78),
  () => phone(art("tela-album.png"), 120, 660, 380, -5) + phone(tela("t0-06"), 580, 620, 380, 5),
  () => `<div class="abs" style="left:300px;top:620px;width:620px;height:560px;border-radius:40px;overflow:hidden;transform:rotate(4deg);box-shadow:0 30px 80px rgba(0,0,0,.3)"><img src="${art("hero-risada-no-chao")}" style="width:100%;height:100%;object-fit:cover"></div>` + phone(tela("t0-05"), 90, 700, 330, -6),
  () => front(90, 680, 300, 440, "Pra rir", -8) + front(390, 650, 300, 440, "Pra conectar", 0) + front(690, 680, 300, 440, "Pra relaxar", 8),
];
export const F = {
  // capa de carrossel com visual livre embaixo
  capa: (i, t, kick, h, vis = "", size = 112, cls = "warm") => ({ cls, html: `${top(n(i, t))}
<div class="abs" style="left:72px;right:72px;top:170px">${kick ? `<span class="k">${kick}</span>` : ""}
<div class="h" style="font-size:${size}px;margin-top:30px">${h}</div></div>${vis}${sw(i, t)}` }),
  // slide de brincadeira: número + carta aberta
  brinc: (i, t, num, m, nota = "", cls = "warm") => ({ cls, html: `${top(n(i, t))}
<div class="abs" style="left:72px;right:72px;top:150px;display:flex;align-items:center;gap:24px"><div class="h" style="font-size:150px;color:var(--clay);line-height:.8">${num}</div>${nota ? `<div class="b" style="font-size:36px;font-weight:700;color:var(--ink)">${nota}</div>` : ""}</div>
${card(m, 72, 320, 720, 0, "zoom:1.3")}
<div class="abs" style="left:72px;bottom:58px;font-weight:800;font-size:28px;color:var(--ink3)">Salva pra fazer hoje</div>${sw(i, t)}` }),
  // foto com texto branco (cara de post orgânico)
  foto: (i, t, a, txt, pos = "50% 50%", y = 170, size = 66, shade = 0.55, extra = "") => ({ cls: "ink", html: `${bgp(a, pos, shade)}
<div class="abs cap" style="left:80px;right:80px;top:${y}px;font-size:${size}px;text-align:center">${txt}</div>${extra}
${t > 1 ? `<div class="abs" style="right:60px;top:52px;background:rgba(0,0,0,.35);color:#fff;font-weight:800;font-size:26px;padding:8px 18px;border-radius:999px">${i}/${t}</div>` : ""}` }),
  // nota de celular
  nota: (i, t, titulo, paras, data = "", cls = "blush", size = 40) => ({ cls, html: `<div class="note abs" style="left:80px;right:80px;top:110px;bottom:110px">
<div class="nt" style="font-size:${size * 1.5}px">${titulo}</div><div class="nd">${data}</div>${paras.map((p) => `<p style="font-size:${size}px">${p}</p>`).join("")}</div>${sw(i, t)}` }),
  // post de texto estilo thread, sem métricas
  thread: (i, t, paras, cls = "blush", size = 54) => ({ cls, html: `<div class="tw abs" style="left:80px;right:80px;top:50%;transform:translateY(-50%)">
<div class="who"><div class="av">${SYM}</div><div><div class="nm">pertinho</div><div class="hd">${HANDLE}</div></div></div>
${paras.map((p) => `<p style="font-size:${size}px">${p}</p>`).join("")}</div>${sw(i, t)}` }),
  // tipográfico grande
  frase: (i, t, h, sub = "", cls = "ink warm", size = 116, y = 300, extra = "") => ({ cls, html: `${top(n(i, t))}
<div class="abs" style="left:72px;right:72px;top:${y}px"><div class="h" style="font-size:${size}px">${h}</div>${sub ? `<div class="b" style="margin-top:40px;font-size:44px">${sub}</div>` : ""}</div>${extra}${sw(i, t)}` }),
  // lista
  lista: (i, t, h, itens, cls = "warm", size = 88, ytop = 190) => ({ cls, html: `${top(n(i, t))}
<div class="abs" style="left:72px;right:72px;top:${ytop}px"><div class="h" style="font-size:${size}px">${h}</div>
<div style="margin-top:56px;zoom:${itens.length <= 3 ? 1.25 : 1}">${itens.map(([a, s], k) => `<div class="li"><div class="nn">${k + 1}</div><div><div class="tt">${a}</div>${s ? `<div class="ss">${s}</div>` : ""}</div></div>`).join("")}</div></div>${sw(i, t)}` }),
  // fim de carrossel: CTA de conhecer, sem preço
  fim: (i, t, h, sub, vis = "phone", cls = "clay") => ({ cls, html: `${top(n(i, t))}
<div class="abs" style="left:72px;right:72px;top:180px"><div class="h" style="font-size:96px">${h}</div><div class="b" style="margin-top:30px;font-size:42px">${sub}</div></div>
${vis === "phone" ? FIMVIS[(fimK++) % FIMVIS.length]() : vis}
<div class="abs" style="left:72px;bottom:70px;z-index:3"><span class="pill">Conhecer o Pertinho · link na bio</span></div>` }),
  // antes e depois
  vs: (i, t, h, antes, depois, cls = "warm") => ({ cls, html: `${top(n(i, t))}
<div class="abs" style="left:72px;right:72px;top:170px"><div class="h" style="font-size:92px">${h}</div></div>
<div class="abs" style="left:56px;top:440px;width:470px;height:720px;background:var(--sand2);border-radius:34px;padding:44px 40px">
<div style="font-weight:800;font-size:27px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3)">${antes[0]}</div>
${antes.slice(1).map((a) => `<div style="font-size:42px;line-height:1.25;margin-top:34px;color:var(--ink2)">${a}</div>`).join("")}</div>
<div class="abs" style="left:554px;top:440px;width:470px;height:720px;background:var(--clay);color:var(--sand);border-radius:34px;padding:44px 40px">
<div style="font-weight:800;font-size:27px;letter-spacing:.08em;text-transform:uppercase;opacity:.85">${depois[0]}</div>
${depois.slice(1).map((a) => `<div style="font-size:42px;line-height:1.25;margin-top:34px;font-weight:600">${a}</div>`).join("")}</div>${sw(i, t)}` }),
  // pergunta e resposta
  qa: (i, t, q, r, cls = "warm") => ({ cls, html: `${top(n(i, t))}
<div class="abs h" style="right:40px;bottom:-60px;font-size:640px;line-height:1;color:var(--clay);opacity:.10">?</div>
<div class="abs" style="left:72px;right:72px;top:50%;transform:translateY(-50%)"><div class="h" style="font-size:${q.length > 40 ? 92 : 108}px">${q}</div><div class="b" style="margin-top:44px;font-size:46px">${r}</div></div>${sw(i, t)}` }),
  // vale-brincadeira (cupom)
  vale: (i, t, titulo, sub, cor = "var(--clay)") => ({ cls: "warm", html: `${top(n(i, t))}
<div class="abs" style="left:110px;right:110px;top:300px;height:720px;background:#fff;border-radius:40px;box-shadow:0 30px 80px rgba(38,34,29,.18);border:6px dashed ${cor};padding:70px 60px;text-align:center;transform:rotate(-2deg)">
<div style="font-weight:800;letter-spacing:.16em;text-transform:uppercase;font-size:32px;color:${cor}">Vale</div>
<div class="h" style="font-size:96px;margin-top:30px">${titulo}</div>
<div class="b" style="margin-top:34px;font-size:40px">${sub}</div>
<div style="margin-top:50px;font-size:30px;color:var(--ink3);font-weight:700">válido hoje · assinado: quem te ama</div></div>
<div class="abs" style="left:0;right:0;bottom:120px;text-align:center" class="b"><span class="b" style="font-size:34px">Tira print e mostra pra ele</span></div>${sw(i, t)}` }),
  raw: (html, cls = "warm") => ({ cls, html }),
};

// ── stories
export const ST = {
  brinc: (m, quando) => ({ cls: "blush", html: `${top()}
<div class="abs" style="left:72px;right:150px;top:210px"><span class="k">${quando}</span><div class="h" style="font-size:84px;margin-top:26px">Brincadeira de hoje</div></div>
${card(m, 66, 470, 800, 0, "zoom:1.2")}
<div class="abs" style="left:72px;right:150px;top:1590px"><div class="b" style="font-size:34px">Tira print e faz hoje à noite</div></div>` }),
  pergunta: (tipo, q, cls = "clay") => ({ cls, html: `${top()}
<div class="abs" style="left:72px;right:72px;top:330px;text-align:center"><span class="k ${cls === "clay" ? "dk" : ""}">${tipo === "Caixinha" ? "Conta pra gente" : tipo === "Quiz" ? "Quiz" : "Vota aí"}</span>
<div class="h" style="font-size:104px;margin-top:40px">${q}</div></div>
<div class="abs dash" style="left:140px;right:140px;top:1040px;height:380px">FIGURINHA DE ${tipo.toUpperCase()} AQUI</div>` }),
  link: (h, sub, vis, cls = "cream warm") => ({ cls, html: `${top()}${vis}
<div class="abs" style="left:72px;right:72px;top:1040px;text-align:center"><div class="h" style="font-size:92px">${h}</div><div class="b" style="margin-top:24px;font-size:42px">${sub}</div></div>
<div class="abs dash" style="left:240px;right:240px;top:1430px;height:140px">FIGURINHA DE LINK AQUI</div>` }),
};
