// Tira do repositório a mídia do que já foi publicado há mais de 2 dias (a agenda guarda o registro e as métricas).
import { readFileSync, existsSync, rmSync, readdirSync } from "node:fs";
const agenda = JSON.parse(readFileSync("agenda.json", "utf8"));
const limite = Date.now() - 2 * 86400e3;
let n = 0;
for (const p of agenda) {
  if (!p.ig || p.ig === "pular" || new Date(p.quando).getTime() > limite) continue;
  for (const f of [...(p.arquivos ?? []), p.capa].filter(Boolean)) if (f !== p.thumb && existsSync(f)) { rmSync(f); n++; }
  const dir = `midia/${p.id}`;
  if (existsSync(dir) && !readdirSync(dir).length) rmSync(dir, { recursive: true });
}
console.log(`poda: ${n} arquivos de mídia já publicada removidos`);
