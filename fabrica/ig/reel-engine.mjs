// Motor de reels do @infancia.pertinho: cenas HTML animadas por tempo, capturadas quadro a quadro, ffmpeg (1080x1920, 30fps, áudio mudo).
// Atributos de animação (tempo local da cena, em s):
//  data-in="0.4"  aparece (fade + sobe)    data-pop  entra com zoom leve (visível já no 1º quadro)
//  data-zoom      zoom lento (ken burns)    data-vid="clip,inicio,velocidade" quadros de vídeo (_arts/v/clip/0001.jpg)
//  data-cycle="0.8" alterna os filhos      data-flip="0.6" vira a carta (filhos: frente, verso)
//  data-tap="1.2" toque de dedo (círculo)  data-type="0.3,22" texto digitado (início, caracteres/s)
import puppeteer from "puppeteer-core";
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { OUT, ARTS, CSS, art, tela, top, logo, card, front, phone, LINK, HANDLE, CHROME, semPonto } from "./kit.mjs";

export const W = 1080, H = 1920, FPS = 30;
const VBASE = pathToFileURL(join(ARTS, "v")).href + "/";
// sem a pasta de cenas (passo "junta" da nuvem, que só gera textos) não há quadros a contar
const NFR = existsSync(join(ARTS, "v")) ? Object.fromEntries(readdirSync(join(ARTS, "v")).map((c) => [c, readdirSync(join(ARTS, "v", c)).length])) : {};

// fundo: clip de vídeo ("v:V01:30:1") ou foto ("hero-risada-no-chao")
const bg = (b, shade = 0.55, pos = "50% 50%") => {
  if (!b) return "";
  let m;
  if (b.startsWith("v:")) {
    const [, c, from = 1, sp = 1] = b.split(":");
    m = `<img class="photo" data-vid="${c},${from},${sp}" src="${VBASE}${c}/${String(from).padStart(4, "0")}.jpg">`;
  } else m = `<img class="photo" data-zoom src="${art(b)}" style="object-position:${pos}">`;
  return m + (shade ? `<div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(20,16,12,${shade}) 0%,rgba(20,16,12,${shade * 0.3}) 42%,rgba(20,16,12,${shade * 0.2}) 62%,rgba(20,16,12,${shade * 0.85}) 100%)"></div>` : "");
};
// área segura: texto entre x 80 e 930, y 220 a 1560
const L = 80, R = 150;

export const S = {
  // gancho sobre vídeo/foto: texto branco grande, visível no quadro 0
  hook: (t, b, dur = 2.4, size = 96, sub = null, y = 300) => ({ dur, html: `${bg(b, 0.6)}
<div class="abs" style="left:${L}px;right:${R}px;top:${y}px;text-align:center"><div class="cap" data-pop style="font-size:${size}px;line-height:1.14">${t}</div>
${sub ? `<div class="cap" data-in="0.6" style="margin-top:34px;font-size:46px;font-weight:700">${sub}</div>` : ""}</div>` }),
  // frases em caixa branca (legenda nativa), uma por vez sobre o vídeo
  caps: (lines, b, dur = 3, y = 1020, size = 60) => ({ dur, html: `${bg(b, 0.35)}
<div class="abs" style="left:${L}px;right:${R}px;top:${y}px;text-align:center">${lines.map((l, i) => `<div data-in="${(i * dur * 0.75) / lines.length}" style="margin-bottom:26px"><span class="boxc" style="font-size:${size}px">${l}</span></div>`).join("")}</div>` }),
  // frase grande sobre vídeo, centralizada no meio
  say: (t, b, dur = 2.6, size = 84, y = 700) => ({ dur, html: `${bg(b, 0.62)}
<div class="abs" style="left:${L}px;right:${R}px;top:${y}px;text-align:center"><div class="cap" data-in="0.05" style="font-size:${size}px;line-height:1.16">${t}</div></div>` }),
  // tipográfico em fundo da marca
  text: (lines, dur = 3, cls = "cream", size = 104, y = 560) => ({ dur, cls, html: `<div class="abs" style="left:${L}px;right:${R}px;top:${y}px;text-align:center">${lines.map((l, i) => `<div class="h" data-in="${i === 0 ? 0 : (i * dur * 0.7) / lines.length}" style="font-size:${size}px;margin-bottom:44px">${l}</div>`).join("")}</div>
<div class="abs" style="left:0;right:0;top:1640px;text-align:center;opacity:.55">${logo(36)}</div>` }),
  // gancho tipográfico (fundo da marca), visível no quadro 0
  hookText: (t, dur = 2.4, cls = "clay", size = 120, sub = null) => ({ dur, cls, html: `<div class="abs" style="left:${L}px;right:${R}px;top:520px;text-align:center"><div class="h" data-pop style="font-size:${size}px">${t}</div>
${sub ? `<div class="b" data-in="0.6" style="margin-top:40px;font-size:48px">${sub}</div>` : ""}</div>` }),
  // carta da brincadeira: frente vira e mostra o verso
  card: (title, m, dur = 5, kicker = "Brincadeira de hoje") => ({ dur, cls: "blush", html: `<div class="abs" style="left:${L}px;right:${R}px;top:230px;text-align:center"><div class="h" data-in="0" style="font-size:88px">${title}</div></div>
<div class="abs" data-flip="0.7" style="left:95px;top:480px;width:835px;height:1000px">
${front(0, 30, 835, 900, kicker)}
${card(m, 0, 0, 580, 0, "zoom:1.44;min-height:600px")}</div>` }),
  // celular com telas do app trocando (frames: ["t0-00", ...]); taps: [[t, x, y]] relativos ao celular
  app: (title, frames, dur = 4, taps = [], sub = null) => ({ dur, cls: "cream warm", html: `<div class="abs" style="left:${L}px;right:${R}px;top:210px;text-align:center"><div class="h" data-in="0" style="font-size:86px">${title}</div>${sub ? `<div class="b" data-in="0.3" style="margin-top:18px;font-size:40px">${sub}</div>` : ""}</div>
<div class="phone" style="left:255px;top:${sub ? 520 : 470}px;width:570px;height:1214px"><div data-cycle="${dur / frames.length}" style="position:absolute;inset:14px">${frames.map((f) => `<img src="${/^t\d/.test(f) ? tela(f) : art(f)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;border-radius:50px">`).join("")}</div>
${taps.map(([t, x, y]) => `<div data-tap="${t}" style="position:absolute;left:${x - 50}px;top:${y - 50}px;width:100px;height:100px;border-radius:50%;background:rgba(192,95,54,.35);border:5px solid rgba(192,95,54,.9);opacity:0"></div>`).join("")}</div>` }),
  // lista numerada
  list: (t, items, dur = 4.5, cls = "cream") => ({ dur, cls, html: `<div class="abs" style="left:${L}px;right:${R}px;top:250px"><div class="h" data-in="0" style="font-size:92px">${t}</div></div>
<div class="abs" style="left:${L}px;right:${R}px;top:${t.length > 24 ? 700 : 560}px">${items.map(([a, s], i) => `<div class="li" data-in="${0.4 + i * ((dur - 1.4) / items.length)}" style="zoom:1.38"><div class="nn">${i + 1}</div><div><div class="tt">${a}</div>${s ? `<div class="ss">${s}</div>` : ""}</div></div>`).join("")}</div>` }),
  // nota de celular sendo digitada
  note: (titulo, paras, dur = 6, b = null) => ({ dur, cls: "blush", html: `${b ? bg(b, 0.5) : ""}<div class="note abs" style="left:76px;width:700px;top:${b ? 300 : 260}px;zoom:1.2">
<div class="nt">${titulo}</div><div class="nd">Notas</div>${paras.map((p, i) => `<p data-in="${0.2 + (i * (dur - 1.5)) / paras.length}">${p}</p>`).join("")}</div>` }),
  // fotos em sequência (memória), com legenda
  photos: (t, list, dur = 3) => ({ dur, html: `<div data-cycle="${dur / list.length}" class="abs" style="inset:0">${list.map((b) => `<div class="abs" style="inset:0">${bg(b, 0.45)}</div>`).join("")}</div>
<div class="abs" style="left:${L}px;right:${R}px;top:330px;text-align:center"><div class="cap" data-in="0" style="font-size:78px">${t}</div></div>` }),
  // fecho: sem preço, CTA de conhecer
  cta: (t, sub, dur = 3.4, cls = "clay") => ({ dur, cls, html: `<div class="abs" style="left:${L}px;right:${R}px;top:430px;text-align:center">
<div data-in="0" style="margin-bottom:60px">${logo(78)}</div>
<div class="h" data-in="0.2" style="font-size:100px">${t}</div>
<div class="b" data-in="0.5" style="margin-top:36px;font-size:46px">${sub}</div>
<div data-in="0.9" style="margin-top:70px"><span class="pill" style="font-size:44px;padding:28px 48px">Conhecer o Pertinho</span></div>
<div data-in="1.1" style="margin-top:30px;font-weight:800;font-size:38px;opacity:.85">link na bio · ${LINK}</div></div>` }),
  raw: (html, dur, cls = "cream") => ({ dur, cls, html }),
};

const RUNTIME = `<script>
const SC=[...document.querySelectorAll('.scene')];const ST=SC.map(s=>+s.dataset.start),DU=SC.map(s=>+s.dataset.dur);
const cl=(x)=>Math.max(0,Math.min(1,x));const ease=(x)=>1-Math.pow(1-x,3);
window.seek=async(t)=>{let k=SC.length-1;for(let i=0;i<SC.length;i++)if(t<ST[i]+DU[i]){k=i;break}
SC.forEach((s,i)=>s.style.display=i===k?'block':'none');const s=SC[k],u=t-ST[k],d=DU[k];const waits=[];
s.querySelectorAll('[data-in]').forEach(e=>{const o=ease(cl((u-+e.dataset.in)/.3));e.style.opacity=o;e.style.transform='translateY('+(1-o)*36+'px)'});
s.querySelectorAll('[data-pop]').forEach(e=>{const o=ease(cl(u/.35));e.style.transform='scale('+(1.07-.07*o)+')';e.style.opacity=1});
s.querySelectorAll('[data-zoom]').forEach(e=>{e.style.transform='scale('+(1.02+.07*u/d)+')'});
s.querySelectorAll('[data-cycle]').forEach(e=>{const n=e.children.length,i=Math.min(n-1,Math.floor(u/+e.dataset.cycle));[...e.children].forEach((c,j)=>{c.style.display=j===i?'block':'none'})});
s.querySelectorAll('[data-flip]').forEach(e=>{const p=cl((u-+e.dataset.flip)/.5);const [f,b]=e.children;if(p<.5){f.style.display='flex';b.style.display='none';f.style.transform='scaleX('+(1-2*p)+')'}else{f.style.display='none';b.style.display='block';b.style.transform='scaleX('+ease(2*p-1)+')'}});
s.querySelectorAll('[data-tap]').forEach(e=>{const p=(u-+e.dataset.tap)/.5;e.style.opacity=p<0||p>1?0:1-p;e.style.transform='scale('+(.6+.6*cl(p))+')'});
s.querySelectorAll('[data-vid]').forEach(e=>{const [c,f,sp]=e.dataset.vid.split(',');const n=NF[c]||1;let k=+f+Math.floor(u*30*+sp);if(k>n)k=n-((k-n)%n);const src=VB+c+'/'+String(Math.max(1,k)).padStart(4,'0')+'.jpg';if(e.getAttribute('src')!==src){e.setAttribute('src',src);waits.push(e.decode().catch(()=>{}))}});
await Promise.all(waits);};
</script>`;

export async function renderReel(dir, scenes, { cover = 0.6 } = {}) {
  let t = 0;
  const body = scenes.map((s) => { const h = `<div class="scene c ${s.cls || ""}" data-start="${t}" data-dur="${s.dur}" style="position:absolute;inset:0;display:none;background:${s.cls ? "" : "#14110e"}">${semPonto(s.html)}</div>`; t += s.dur; return h; }).join("");
  const total = t;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}body{width:${W}px;height:${H}px;position:relative;overflow:hidden}</style></head><body>${body}
<script>const VB=${JSON.stringify(VBASE)};const NF=${JSON.stringify(NFR)};</script>${RUNTIME}</body></html>`;
  const tmp = join(ARTS, "_reel-" + dir.replace(/[\\/]/g, "_") + ".html");
  writeFileSync(tmp, html);
  const out = join(OUT, dir); mkdirSync(out, { recursive: true });
  const br = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] });
  const p = await br.newPage();
  await p.setViewport({ width: W, height: H });
  await p.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate((c) => window.seek(c), cover);
  await p.screenshot({ path: join(out, "capa.jpg"), type: "jpeg", quality: 92 });
  await p.evaluate(() => window.seek(0));
  await p.screenshot({ path: join(ARTS, "_t0-" + dir.replace(/[\\/]/g, "_") + ".jpg"), type: "jpeg", quality: 70 });
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
    "-c:v", "libx264", "-preset", "medium", "-crf", process.env.PT_CRF ?? "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", "-movflags", "+faststart", join(out, "reel.mp4")], { stdio: ["pipe", "inherit", "inherit"] });
  const N = Math.round(total * FPS);
  for (let i = 0; i < N; i++) {
    await p.evaluate((t) => window.seek(t), i / FPS);
    const buf = await p.screenshot({ type: "jpeg", quality: 88 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await br.close();
  console.log(dir, total.toFixed(1) + "s");
}
