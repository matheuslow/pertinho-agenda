// Monta agenda.json + copia mídias do @infancia.pertinho (06/10/2026).
//   node montar-agenda.mjs base      → material do outro chat (../instagram-pertinho): grade inicial em 07/10 cedo e o
//                                       calendário de 07/10 a 16/10 nos horários originais, + story da brincadeira do dia
//   node montar-agenda.mjs lote <dir> → lote da fábrica de volume (<dir>/lote.json, gerado por ../app/ig-pertinho/volume.mjs)
// Reels: o motor sai com áudio mudo e a API não põe música do Instagram, então a trilha entra aqui (ffmpeg).
// Música própria (gerada no ElevenLabs pros anúncios do Pertinho): piano nos de memória, trilha nos de brincadeira.
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const BASE = "../instagram-pertinho";
const SOM = process.env.PT_SOM ?? "C:/Users/Mathe/Documents/Codex/2026-09-10/s/work/pertinho-videos/som";
const agenda = existsSync("agenda.json") ? JSON.parse(readFileSync("agenda.json", "utf8")) : [];
const ids = new Set(agenda.map((p) => p.id));
const add = (p) => { if (!ids.has(p.id)) { agenda.push(p); ids.add(p.id); } };

function csv(linha) {
  const out = []; let cur = "", q = false;
  for (const ch of linha) {
    if (ch === '"') q = !q; else if (ch === "," && !q) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out;
}

const MEMORIA = /últim|lembr|memór|infância|crescendo|presente|ninguém avisa|não espera/i;
function duracao(f) {
  return Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).trim());
}
let giro = 0;
/** Copia o reel trocando o áudio mudo por trilha própria (fade in/out, volume baixo, começa num ponto diferente a cada reel). */
export function reelComMusica(src, dest, legenda) {
  const trilha = process.env.PT_SOM ? (MEMORIA.test(legenda) ? `${SOM}/piano.m4a` : `${SOM}/trilha.m4a`) : (MEMORIA.test(legenda) ? `${SOM}/piano-c5.wav` : `${SOM}/trilha-c1.wav`);
  const d = duracao(src), ini = [0, 9, 18][giro++ % 3];
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", src, "-ss", String(ini), "-i", trilha, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
    "-af", `afade=t=in:st=0:d=0.4,afade=t=out:st=${Math.max(0, d - 1.2).toFixed(2)}:d=1.2,volume=0.55`, "-c:a", "aac", "-b:a", "160k", "-shortest", dest]);
}

/** Miniatura de 240 px (aba Instagram do admin). Fica no repo mesmo depois que a poda tira a mídia publicada. */
export function miniatura(id) {
  const dir = `midia/${id}`, dest = `${dir}/thumb.jpg`;
  if (existsSync(dest)) return dest;
  const src = existsSync(`${dir}/capa.jpg`) ? `${dir}/capa.jpg` : ["1.jpg", ...(existsSync(dir) ? readdirSync(dir) : [])].map((f) => `${dir}/${f}`).find((f) => /\.jpg$/.test(f) && existsSync(f));
  if (!src) return null;
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", src, "-vf", "scale=240:-2", "-q:v", "5", dest]);
  return dest;
}

function copia(srcDir, id, tipo, arquivos, legenda) {
  const dest = `midia/${id}`; mkdirSync(dest, { recursive: true });
  const out = [];
  for (const f of arquivos) {
    if (tipo === "reel" && f === "reel.mp4") reelComMusica(join(srcDir, f), join(dest, f), legenda);
    else copyFileSync(join(srcDir, f), join(dest, f));
    out.push(`${dest}/${f}`);
  }
  return out;
}

function base() {
  const linhas = readFileSync(`${BASE}/AGENDA.csv`, "utf8").replace(/^\uFEFF/, "").trim().split(/\r?\n/).slice(1).map(csv);
  // grade inicial: P9 primeiro, P1 por último, em 07/10 a cada 20 min a partir das 06h (termina 08h40, antes do 09h)
  const grade = linhas.filter((l) => l[2].startsWith("01-grade-inicial/"));
  grade.forEach((l, i) => {
    const [, , pasta, tipo, arqs] = l;
    const min = 6 * 60 + i * 20, hora = `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
    const nome = pasta.split("/").pop(), id = `G-${nome.slice(0, 2)}`;
    const legenda = readFileSync(join(BASE, pasta, "legenda.txt"), "utf8");
    const t = tipo === "reel" ? "reel" : "carrossel";
    const lista = arqs.split("|").map((s) => s.trim()).filter((f) => f && f !== "capa.jpg");
    const arquivos = copia(join(BASE, pasta), id, t, lista, legenda);
    const capa = tipo === "reel" ? (copyFileSync(join(BASE, pasta, "capa.jpg"), `midia/${id}/capa.jpg`), `midia/${id}/capa.jpg`) : undefined;
    add({ id, quando: `2026-10-07T${hora}:00-03:00`, etapa: "grade", tipo: t, arquivos, ...(capa ? { capa } : {}), legenda });
  });
  // calendário: de 07/10 em diante, nos horários originais
  for (const l of linhas.filter((x) => x[2].startsWith("03-calendario/") && x[0] >= "2026-10-07")) {
    const [data, hora, pasta, tipo, arqs] = l;
    const id = `${data.slice(5)}-${hora.replace(":", "h")}`;
    const legenda = readFileSync(join(BASE, pasta, "legenda.txt"), "utf8");
    const t = tipo === "reel" ? "reel" : "carrossel";
    const lista = arqs.split("|").map((s) => s.trim()).filter((f) => f && f !== "capa.jpg");
    const arquivos = copia(join(BASE, pasta), id, t, lista, legenda);
    const capa = tipo === "reel" ? (copyFileSync(join(BASE, pasta, "capa.jpg"), `midia/${id}/capa.jpg`), `midia/${id}/capa.jpg`) : undefined;
    add({ id, quando: `${data}T${hora}:00-03:00`, etapa: "calendario", tipo: t, arquivos, ...(capa ? { capa } : {}), legenda });
    // story da brincadeira do dia (10h): o único dos 3 stories antigos que não depende de figurinha
    const dir = pasta.split("/").slice(0, 2).join("/");
    const sid = `${data.slice(5)}-10h00-story`;
    if (!ids.has(sid) && existsSync(join(BASE, dir, "stories", "1-brincadeira.jpg"))) {
      add({ id: sid, quando: `${data}T10:00:00-03:00`, etapa: "story", tipo: "story", arquivos: copia(join(BASE, dir, "stories"), sid, "story", ["1-brincadeira.jpg"], ""), legenda: "(story, sem legenda)" });
    }
  }
}

function lote(dir) {
  const itens = JSON.parse(readFileSync(join(dir, "lote.json"), "utf8"));
  for (const p of itens) {
    const src = join(dir, p.pasta);
    // só entra o que já foi renderizado (a fábrica roda em segundo plano); o resto entra na próxima rodada
    if (ids.has(p.id) || !p.arquivos.every((f) => existsSync(join(src, f))) || (p.capa && !existsSync(join(src, p.capa)))) continue;
    if (p.tipo === "reel") { try { if (!(duracao(join(src, "reel.mp4")) > 3)) continue; } catch { continue; } } // ainda gravando
    const arquivos = copia(src, p.id, p.tipo, p.arquivos, p.legenda ?? "");
    const capa = p.capa ? (copyFileSync(join(src, p.capa), `midia/${p.id}/${p.capa}`), `midia/${p.id}/${p.capa}`) : undefined;
    add({ id: p.id, quando: p.quando, etapa: p.etapa, fonte: "volume", formato: p.formato, tipo: p.tipo, arquivos, ...(capa ? { capa } : {}), legenda: p.legenda ?? "(story, sem legenda)" });
  }
}

const [modo, arg] = process.argv.slice(2);
if (modo === "base") base();
else if (modo === "lote") lote(arg);
else { console.log("uso: node montar-agenda.mjs base | lote <dir>"); process.exit(1); }
for (const p of agenda) if (!p.thumb) { const t = miniatura(p.id); if (t) p.thumb = t; }
agenda.sort((a, b) => a.quando.localeCompare(b.quando));
writeFileSync("agenda.json", JSON.stringify(agenda, null, 1));
console.log(agenda.length, "na agenda");
