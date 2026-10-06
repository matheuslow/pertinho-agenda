// Datas da próxima rodada da fábrica: as informadas (AAAA-MM-DD separadas por espaço) ou os 7 dias seguintes ao último
// dia que a fábrica já produziu na agenda (nunca antes de amanhã).
import { readFileSync } from "node:fs";
const arg = (process.argv[2] ?? "").trim();
if (arg) { console.log(arg); process.exit(0); }
const agenda = JSON.parse(readFileSync("agenda.json", "utf8"));
const ult = agenda.filter((p) => p.fonte === "volume").map((p) => p.quando.slice(0, 10)).sort().at(-1);
const amanha = new Date(Date.now() - 3 * 3600e3 + 86400e3).toISOString().slice(0, 10);
const ini = ult && ult >= amanha ? new Date(Date.parse(ult) + 86400e3) : new Date(Date.parse(amanha));
console.log(Array.from({ length: 7 }, (_, i) => new Date(ini.getTime() + i * 86400e3).toISOString().slice(0, 10)).join(" "));
