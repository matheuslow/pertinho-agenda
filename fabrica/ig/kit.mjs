// Kit visual do @infancia.pertinho: CSS da marca (tokens do design system Pertinho), blocos e renderizador.
import puppeteer from "puppeteer-core";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// PT_OUT/PT_ARTS/CHROME_PATH: na nuvem (GitHub Actions do repo pertinho-agenda) a fábrica roda com outros caminhos
export const OUT = process.env.PT_OUT ?? join(here, "..", "..", "instagram-pertinho");
export const ARTS = process.env.PT_ARTS ?? join(OUT, "_arts");
const FONTS = pathToFileURL(join(here, "fonts")).href;
export const art = (n) => pathToFileURL(join(ARTS, n.includes(".") ? n : n + ".jpg")).href;
export const tela = (n) => art("telas/" + n + ".png");
export const HANDLE = "@infancia.pertinho";
export const LINK = "pertinho.club";
export const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

export const CSS = `
@font-face{font-family:Bricolage;font-weight:200 800;src:url(${FONTS}/bricolage-latin.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Bricolage;font-weight:200 800;src:url(${FONTS}/bricolage-latin-ext.woff2) format("woff2");unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
@font-face{font-family:Figtree;font-weight:300 900;src:url(${FONTS}/figtree-latin.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
@font-face{font-family:Figtree;font-weight:300 900;src:url(${FONTS}/figtree-latin-ext.woff2) format("woff2");unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF}
:root{--clay:#C05F36;--clay6:#A24A28;--clay7:#80391E;--clay3:#E5A685;--clay2:#F2C8B0;--clay1:#FAE5D8;--sand:#FBF8F4;--cream:#F7F1E8;--sand2:#F4EEE7;--line:#E7DFD5;--ink:#26221D;--ink2:#5A5148;--ink3:#7D7266;--moss:#4E6B51;--moss1:#DEE6DC;--honey:#F2B23E;--honey1:#FEF7E6}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--cream)}
.c{position:relative;overflow:hidden;background:var(--cream);color:var(--ink);font-family:Figtree,sans-serif;font-weight:500}
.c.sand{background:var(--sand)}
.c.clay{background:var(--clay);color:var(--sand)}
.c.ink{background:var(--ink);color:var(--sand)}
.c.moss{background:var(--moss);color:var(--sand)}
.c.blush{background:var(--clay1)}
.c.warm::before{content:"";position:absolute;inset:0;background:radial-gradient(900px 700px at 100% 0%,rgba(242,200,176,.55),transparent 60%),radial-gradient(800px 700px at 0% 100%,rgba(222,230,220,.55),transparent 60%);pointer-events:none}
.c.ink.warm::before{background:radial-gradient(900px 700px at 100% 0%,rgba(192,95,54,.30),transparent 60%),radial-gradient(800px 600px at 0% 100%,rgba(78,107,81,.25),transparent 60%)}
.abs{position:absolute}
.h{font-family:Bricolage;font-weight:700;line-height:1.02;letter-spacing:-.025em}
.h em{font-style:normal;color:var(--clay)}
.clay .h em{color:var(--ink)}
.ink .h em,.moss .h em{color:var(--clay3)}
.hl{font-style:normal;background:linear-gradient(transparent 58%,rgba(192,95,54,.9) 58%,rgba(192,95,54,.9) 94%,transparent 94%);padding:0 .06em}
.b{font-size:40px;line-height:1.32;color:var(--ink2)}
.b b{color:var(--ink);font-weight:800}
.clay .b,.ink .b,.moss .b{color:rgba(251,248,244,.86)}
.clay .b b,.ink .b b,.moss .b b{color:var(--sand)}
.k{display:inline-flex;align-items:center;gap:12px;background:var(--clay1);color:var(--clay7);font-weight:800;text-transform:uppercase;letter-spacing:.09em;font-size:26px;padding:12px 22px;border-radius:999px}
.k.mo{background:var(--moss1);color:var(--moss)}
.k.dk{background:rgba(251,248,244,.14);color:var(--sand)}
.k.cl{background:var(--clay);color:var(--sand)}
.top{position:absolute;left:72px;right:72px;top:58px;display:flex;align-items:center;gap:14px;font-weight:700;font-size:27px;color:var(--ink3);z-index:5}
.clay .top,.ink .top,.moss .top{color:rgba(251,248,244,.7)}
.top .n{margin-left:auto;font-weight:800;letter-spacing:.06em}
.logo{display:inline-flex;align-items:center;gap:.28em;font-family:Bricolage;font-weight:700;letter-spacing:-.035em;line-height:1}
.logo svg{height:1.05em;width:auto;color:var(--clay6)}
.clay .logo svg,.ink .logo svg,.moss .logo svg{color:var(--clay3)}
.foot{position:absolute;left:72px;right:72px;bottom:56px;display:flex;align-items:center;justify-content:space-between;font-weight:800;font-size:28px;z-index:5;color:var(--ink3)}
.clay .foot,.ink .foot,.moss .foot{color:rgba(251,248,244,.75)}
.pill{display:inline-flex;align-items:center;gap:14px;background:var(--clay);color:var(--sand);font-weight:800;font-size:34px;padding:22px 36px;border-radius:999px}
.clay .pill{background:var(--sand);color:var(--clay7)}
.swipe{position:absolute;right:72px;bottom:56px;font-weight:800;font-size:28px;color:var(--clay);z-index:5}
.clay .swipe,.ink .swipe,.moss .swipe{color:var(--sand)}
.shot{border-radius:26px;box-shadow:0 30px 70px rgba(38,34,29,.28);display:block}
.photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.phone{position:absolute;border-radius:62px;background:#1b1714;padding:14px;box-shadow:0 40px 90px rgba(38,34,29,.35),0 0 0 3px #3a322d}
.phone img{display:block;width:100%;height:100%;object-fit:cover;object-position:top;border-radius:50px}
/* carta da brincadeira (verso aberto) */
.card{background:#fff;border-radius:40px;box-shadow:0 30px 80px rgba(38,34,29,.22);padding:52px 50px;color:var(--ink)}
.card .chips{display:flex;gap:12px;flex-wrap:wrap}
.card .chip{background:var(--clay1);color:var(--clay7);font-weight:800;font-size:25px;padding:9px 18px;border-radius:999px}
.card .chip.mo{background:var(--moss1);color:var(--moss)}
.card .chip.ho{background:var(--honey1);color:#A96E13}
.card .t{font-family:Bricolage;font-weight:700;font-size:72px;letter-spacing:-.03em;line-height:1;margin:28px 0 30px}
.card .st{display:flex;gap:22px;align-items:flex-start;margin-top:22px;font-size:31px;line-height:1.34;color:var(--ink2)}
.card .st i{flex:none;font-style:normal;width:50px;height:50px;border-radius:50%;background:var(--clay);color:#fff;font-weight:800;font-size:27px;display:flex;align-items:center;justify-content:center;margin-top:-2px}
/* carta fechada (frente) */
.front{background:linear-gradient(160deg,#C05F36,#80391E);border-radius:40px;box-shadow:0 30px 80px rgba(38,34,29,.3);color:var(--sand);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.front .fx{font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-size:26px;opacity:.8}
.front .ft{font-family:Bricolage;font-weight:700;font-size:84px;letter-spacing:-.03em;line-height:1;margin:24px 40px}
.front .fb{margin-top:16px;background:var(--honey);color:var(--ink);font-weight:800;font-size:28px;padding:14px 28px;border-radius:999px}
/* nota (estilo app de notas) */
.note{background:#FFFDF7;border-radius:34px;box-shadow:0 26px 70px rgba(38,34,29,.18);padding:56px 60px;font-family:"Segoe UI",Figtree,sans-serif;color:#1f1c19}
.note .nt{font-weight:700;font-size:58px;margin-bottom:10px}
.note .nd{color:#9a8f84;font-size:26px;margin-bottom:34px}
.note p{font-size:38px;line-height:1.42;margin-bottom:22px}
/* post de texto (estilo thread, sem métricas) */
.tw{background:#fff;border-radius:34px;box-shadow:0 26px 70px rgba(38,34,29,.16);padding:54px 56px;color:#1f1c19}
.tw .who{display:flex;gap:20px;align-items:center;margin-bottom:34px}
.tw .av{width:92px;height:92px;border-radius:50%;background:var(--clay);display:flex;align-items:center;justify-content:center}
.tw .av svg{height:54px;color:var(--sand)}
.tw .nm{font-weight:800;font-size:33px}.tw .hd{color:#8a8178;font-size:28px}
.tw p{font-size:44px;line-height:1.36;margin-bottom:26px;font-weight:500}
/* legenda sobre foto (estilo foto de TikTok/IG) */
.cap{font-family:Figtree;font-weight:800;color:#fff;text-shadow:0 2px 18px rgba(0,0,0,.55),0 1px 3px rgba(0,0,0,.5);line-height:1.22}
.boxc{display:inline;background:#fff;color:#1f1c19;font-family:Figtree;font-weight:800;line-height:1.55;padding:.12em .38em;border-radius:14px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.li{display:flex;gap:28px;align-items:flex-start;margin-bottom:34px}
.li .nn{flex:none;font-family:Bricolage;font-weight:700;font-size:44px;width:76px;height:76px;border-radius:50%;background:var(--clay);color:var(--sand);display:flex;align-items:center;justify-content:center}
.li .tt{font-family:Bricolage;font-weight:700;font-size:46px;line-height:1.08;letter-spacing:-.02em}
.li .ss{font-size:32px;color:var(--ink2);margin-top:8px;line-height:1.3}
.clay .li .nn{background:var(--sand);color:var(--clay7)}
.ink .li .ss,.clay .li .ss{color:rgba(251,248,244,.75)}
.dash{border:4px dashed rgba(38,34,29,.22);border-radius:30px;display:flex;align-items:center;justify-content:center;color:rgba(38,34,29,.35);font-weight:800;font-size:28px;letter-spacing:.06em}
.clay .dash,.ink .dash,.moss .dash{border-color:rgba(251,248,244,.4);color:rgba(251,248,244,.55)}
`;

export const SYM = `<svg viewBox="13 6 38 51" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><circle cx="22" cy="14" r="6.5"/><rect x="15.5" y="24" width="13" height="31" rx="6.5"/><circle cx="43" cy="28.5" r="5"/><rect x="37.5" y="36" width="11" height="19" rx="5.5"/></svg>`;
export const logo = (size = 40, extra = "") => `<span class="logo" style="font-size:${size}px;${extra}">${SYM}pertinho</span>`;
export const top = (n, light = false) => `<div class="top">${logo(34)}<span style="opacity:.75;margin-left:8px">${HANDLE}</span>${n ? `<span class="n">${n}</span>` : ""}</div>`;
export const foot = (t = "Link na bio") => `<div class="foot"><span>${t}</span><span>${LINK}</span></div>`;
export const phone = (src, x, y, w, rot = 0, extra = "") => `<div class="phone" style="left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w * 2.13)}px;transform:rotate(${rot}deg);${extra}"><img src="${src}"></div>`;
export const shot = (src, x, y, w, rot = 0, extra = "") => `<img class="shot abs" src="${src}" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg);${extra}">`;
export const photo = (a, pos = "50% 50%", shade = 0) => `<img class="photo" src="${art(a)}" style="object-position:${pos}">${shade ? `<div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(20,16,12,${shade}) 0%,rgba(20,16,12,${shade * 0.25}) 45%,rgba(20,16,12,${shade * 0.9}) 100%)"></div>` : ""}`;

// carta aberta: { t, chips: [[texto, classe]], passos: [] }
export const card = (m, x, y, w, rot = 0, extra = "", scale = 1) => `<div class="card abs" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg) scale(${scale});transform-origin:top left;${extra}">
<div class="chips">${m.chips.map(([c, k]) => `<span class="chip ${k || ""}">${c}</span>`).join("")}</div>
<div class="t">${m.t}</div>${m.passos.map((p, i) => `<div class="st"><i>${i + 1}</i><div>${p}</div></div>`).join("")}</div>`;
export const front = (x, y, w, h, t = "Brincadeira de hoje", rot = 0, extra = "") => `<div class="front abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);${extra}">
<div style="width:${Math.round(w * 0.2)}px;color:var(--sand);opacity:.9">${SYM}</div><div class="ft" style="font-size:${Math.round(w * 0.15)}px;margin:${Math.round(w * 0.06)}px ${Math.round(w * 0.08)}px">${t}</div><div class="fx" style="font-size:${Math.max(18, Math.round(w * 0.05))}px">pra fazer junto</div></div>`;

// arte sem ponto final: frase com ponto no meio vira quebra de linha
export const semPonto = (h) => h.replace(/(\p{L})\. (?=\p{Lu})/gu, "$1<br>").replace(/(\p{L})\.(?=\s*<\/)/gu, "$1");
export const page = (w, h, cls, inner) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="c ${cls}" style="width:${w}px;height:${h}px">${semPonto(inner)}</div></body></html>`;

// cards: [{ out, w, h, cls, html }]
export async function renderCards(cards) {
  const br = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] });
  const p = await br.newPage();
  const tmp = join(ARTS, "_card.html");
  for (const c of cards) {
    await p.setViewport({ width: c.w, height: c.h });
    writeFileSync(tmp, page(c.w, c.h, c.cls ?? "", c.html));
    await p.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    const f = join(OUT, c.out);
    mkdirSync(dirname(f), { recursive: true });
    await p.screenshot({ path: f, type: "jpeg", quality: 93 });
  }
  await br.close();
  console.log(cards.length, "cards");
}
