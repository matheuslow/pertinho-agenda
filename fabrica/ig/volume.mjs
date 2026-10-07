// Fábrica de volume do @infancia.pertinho (06/10/2026, pedido do Matheus): por dia 10 reels, 5 carrosséis e 10 stories,
// em funil (topo: dica útil e emoção · meio: dor → mecanismo, inglês, Me Conta · fundo: o app por dentro e o que vem),
// tudo terminando em "link na bio". Sai em ../../instagram-pertinho/04-volume/<data>/ + lote.json pro robô
// (../../pertinho-agenda: node montar-agenda.mjs lote <dir>). Desconta o que o calendário antigo já tem no dia.
//   node volume.mjs 2026-10-07 [2026-10-08 ...] [--so-texto] [--shard k/n]
// Regras (memória do Matheus): sem travessão, sem ponto final nas artes (semPonto no motor), sem preço, sem "comprar",
// sem depoimento inventado, sem "educativo/desenvolvimento/estímulo", inglês = "mais um jeito de brincar junto".
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { renderCards, top, logo, card, front, phone, art, tela, OUT, ARTS, LINK } from "./kit.mjs";
import { F, ST, FD, SY } from "./pecas.mjs";
import { M } from "./missoes.mjs";
import { S, renderReel } from "./reel-engine.mjs";

const AGENDA = process.env.PT_AGENDA ?? join(OUT, "..", "pertinho-agenda", "agenda.json");
const DADOS = process.env.PT_DADOS ?? null; // na nuvem: fabrica/dados (cópia do catálogo e do Me Conta do app)
const CATALOGO = DADOS ? join(DADOS, "missions") : "C:/Users/Mathe/Documents/Codex/pertinho-ingles/content/missions";
const SEED_MECONTA = DADOS ? join(DADOS, "me-conta-seed.sql") : "C:/Users/Mathe/Documents/Codex/pertinho-ingles/supabase/me-conta-seed.sql";
const args = process.argv.slice(2);
const DATAS = args.filter((a) => /^\d{4}-\d\d-\d\d$/.test(a));
const SO_TEXTO = args.includes("--so-texto");
const SHARD = args.includes("--shard") ? args[args.indexOf("--shard") + 1].split("/").map(Number) : null;

// ── matéria-prima ────────────────────────────────────────────────────────────────────────────────────────────────
const OBJ = { rir: "Pra rir", conectar: "Pra conectar", relaxar: "Pra relaxar", "gastar energia": "Gastar energia", "gastar-energia": "Gastar energia", "passar tempo": "Passar tempo", "passar-tempo": "Passar tempo" };
const curto = (s) => { let t = s.replace(/\{nome\}/g, "ele").replace(/\s+/g, " ").trim(); const p = t.indexOf(". "); if (p > 30 && p < 110) t = t.slice(0, p); return t.length > 112 ? t.slice(0, 109).replace(/\s\S*$/, "") + "…" : t.replace(/\.$/, ""); };
const doCatalogo = () => {
  const out = [];
  for (const f of readdirSync(CATALOGO).filter((x) => /2-4|5-7|destaque/.test(x))) {
    for (const m of JSON.parse(readFileSync(join(CATALOGO, f), "utf8"))) {
      if (!m.passos?.length || !(m.faixas_etarias ?? []).some((x) => x === "2-4" || x === "5-7")) continue;
      const mat = !m.material || m.material === "nenhum" ? "Sem material" : m.material[0].toUpperCase() + m.material.slice(1);
      out.push({ t: m.titulo, slug: m.slug, chips: [[`${m.duracao_min ?? 15} min`], [mat, "mo"], [OBJ[m.objetivo] ?? "Pra brincar", "ho"]], passos: m.passos.slice(0, 3).map(curto), obj: m.objetivo, min: m.duracao_min ?? 15, mat });
    }
  }
  return out;
};
const vistos = new Set();
const BRINC = [...Object.values(M).map((m) => ({ ...m, obj: { "Pra rir": "rir", "Pra conectar": "conectar", "Pra relaxar": "relaxar", "Gastar energia": "gastar energia", "Passar tempo": "passar tempo" }[m.chips[2][0]] ?? "rir", min: parseInt(m.chips[0][0]), mat: m.chips[1][0] })), ...doCatalogo()]
  .filter((m) => !vistos.has(m.slug) && vistos.add(m.slug));

// 100 cards do Inglês Brincando (imagens em _arts/ingles/NNN.png, cortadas do PDF corrigido)
const INGLES = `cachorro dog dóg|gato cat két|leão lion láion|elefante elephant élefant|macaco monkey mânki|girafa giraffe djirréf|tigre tiger táiguer|urso bear bér|coelho rabbit rébit|pássaro bird bârd|peixe fish fích|sapo frog fróg|cavalo horse róurs|vaca cow káu|porco pig píg|galinha chicken tchíken|pato duck dâk|borboleta butterfly bâterflai|abelha bee bí|tartaruga turtle târtol|vermelho red réd|azul blue blú|amarelo yellow iélou|verde green grín|rosa pink pínk|roxo purple pârpol|laranja orange órindj|preto black blék|branco white uáit|marrom brown bráun|maçã apple épol|banana banana banéna|laranja orange órindj|morango strawberry stróberi|uva grape grêip|melancia watermelon uótermélon|abacaxi pineapple páinépol|manga mango mêngou|limão lemon lémon|pera pear pér|mãe mom mãm|pai dad déd|irmão brother brâder|irmã sister síster|bebê baby bêibi|avó grandma grénmá|avô grandpa grénpá|família family fémili|menino boy bói|menina girl gârl|cabeça head réd|olho eye ái|nariz nose nôuz|boca mouth máuth|orelha ear ír|mão hand rénd|braço arm árm|pé foot fút|perna leg lég|dedo finger fínguer|água water uóter|leite milk mílk|pão bread bréd|queijo cheese tchíz|ovo egg ég|arroz rice ráis|bolo cake kêik|sorvete ice-cream áis-krím|suco juice djús|chocolate chocolate tchóklet|casa house ráus|cama bed béd|cadeira chair tchér|mesa table têibol|porta door dór|janela window uíndou|copo cup kâp|colher spoon spún|prato plate plêit|chave key kí|carro car kár|ônibus bus bâs|bicicleta bicycle báissikol|avião airplane érplein|barco boat bôut|bola ball ból|boneca doll dól|livro book búk|lápis pencil pénsil|mochila backpack békpék|sol sun sân|lua moon mún|estrela star stár|nuvem cloud kláud|chuva rain rêin|árvore tree trí|flor flower fláuer|céu sky skái|mar sea sí|praia beach bíitch`
  .split("|").map((x, i) => { const [pt, en, fala] = x.split(" "); return { n: i + 1, pt, en: en.replace("-", " "), fala: fala.replace("-", " "), img: `ingles/${String(i + 1).padStart(3, "0")}.png` }; });
const TEMAS_IN = [["Animais", 0], ["Mais animais", 10], ["Cores", 20], ["Frutas", 30], ["Família", 40], ["Corpo", 50], ["Comida", 60], ["Casa", 70], ["Passeio e brinquedos", 80], ["Natureza", 90]];

// Perguntas reais do Me Conta (supabase/me-conta-seed.sql do app)
const MECONTA = [...readFileSync(SEED_MECONTA, "utf8")
  .matchAll(/::momentos\.age_band, '\w+', '((?:[^']|'')+)'/g)].map((m) => m[1].replace(/''/g, "'"));

const CLIPS = ["P12760321", "P5265144", "P5303987", "P6994973", "P7491804", "P7505997", "P8033562", "P8122857", "P8524148", "P8524162", "P8670995", "V01", "V03", "V04", "V05", "V06", "V11"];
const TELAS = readdirSync(join(ARTS, "telas")).filter((f) => f.endsWith(".png")).map((f) => f.replace(".png", "")).sort();
const FOTOS = readdirSync(ARTS).filter((f) => /^(f-|hero|deitada|noite|rotina)/.test(f) && f.endsWith(".jpg")).map((f) => f.replace(".jpg", ""));

// Ganchos (dor = rotina e repetição, validada; nunca "mãe criativa")
const DORES = [
  "19h, energia em 3% e ele: <span class='hl'>brinca comigo?</span>",
  "os mesmos brinquedos, a mesma brincadeira, <span class='hl'>todo dia</span>",
  "ele largou o brinquedo novo <span class='hl'>em 3 minutos</span>",
  "você chega cansada e ele <span class='hl'>tá com toda a energia</span>",
  "o celular na sua mão e ele <span class='hl'>pedindo pra brincar</span>",
  "domingo à tarde e <span class='hl'>acabou o repertório</span>",
  "dia de chuva, apartamento e <span class='hl'>uma criança de 4 anos</span>",
  "você salvou 200 brincadeiras e <span class='hl'>não lembra de nenhuma</span>",
  "a janta no fogo e ele: <span class='hl'>mãe, olha!</span>",
  "15 minutos antes do banho que <span class='hl'>viram briga</span>",
  "ele pede pra brincar e você <span class='hl'>não sabe do quê</span>",
  "mais um dia de desenho porque <span class='hl'>você não tinha mais ideia</span>",
];
const MEMORIAS = [
  ["um dia ele vai te chamar pra brincar", "pela última vez", "e ninguém vai te avisar"],
  ["ele não vai lembrar do brinquedo caro", "vai lembrar de você", "no chão da sala"],
  ["a infância não espera", "você descansar", "mas cabe em 15 minutos"],
  ["criança não pede tempo de qualidade", "pede você", "do jeito que você tá hoje"],
  ["daqui a 10 anos", "você vai querer de volta", "os 15 minutos de hoje"],
  ["ele não precisa de uma mãe animadora de festa", "precisa de você", "por 15 minutos, sem celular"],
  ["a série tem replay", "a infância dele não", "brinca hoje"],
  ["o que ele vai contar da infância", "não vai estar em foto de viagem", "vai ser uma terça qualquer com você"],
];
const PRA_QUANDO = { rir: "pra rir junto hoje à noite", conectar: "pra se conectar em poucos minutos", relaxar: "pra quando a sua energia acabou", "gastar energia": "pra gastar a energia dele antes do banho", "passar tempo": "pra trocar a tela por 15 minutos" };
const TAGS = ["#brincadeirasinfantis #brincarjunto #maternidadereal #infancia #paisefilhos", "#brincadeiraemcasa #maternidade #infanciafeliz #maedemenino #maedemenina", "#atividadesinfantis #brincar #rotinainfantil #maternidadesemfiltro #filhos"];
const CTA_L = ["O Pertinho entrega uma brincadeira nova, pronta, do tamanho da energia que sobrou. Pra filhos de 2 a 6 anos. Link na bio pra conhecer 🧡",
  "No Pertinho tem mais de 60 assim, pra 2 a 6 anos, e você escolhe pelo tempo e pela energia de hoje. Link na bio pra ver como funciona",
  "Quer uma ideia pronta toda noite? É isso que o Pertinho faz. Link na bio 🧡"];

// ── modelos ──────────────────────────────────────────────────────────────────────────────────────────────────────
let ix = { b: 0, c: 0, d: 0, m: 0, q: 0, i: 0, f: 0, t: 0 };
const pega = (arr, k) => arr[ix[k]++ % arr.length];
const clip = (o = 1) => `v:${pega(CLIPS, "c")}:${o}:1`;
const passosTxt = (m) => m.passos.map((p, i) => `${i + 1}. ${p}`).join("\n");
const legenda = (corpo, k) => `${corpo}\n\n${CTA_L[k % CTA_L.length]}\n\n${TAGS[k % TAGS.length]}`;
const ctaR = (t = "Uma brincadeira nova por dia", s = "pronta, do tamanho da sua energia") => S.cta(t, s);
const brincDe = (filtro) => { for (let k = 0; k < BRINC.length; k++) { const m = pega(BRINC, "b"); if (!filtro || filtro(m)) return m; } return pega(BRINC, "b"); };

const REELS = {
  brinc: (k) => { const m = brincDe(); return { etapa: "topo", scenes: [
    S.hook(`${m.min} minutos, ${m.mat.toLowerCase()}, <span class='hl'>${PRA_QUANDO[m.obj] ?? "pra brincar junto hoje"}</span>`, clip(), 2.6, 88),
    S.card(m.t, m, 5.2),
    S.caps(m.passos.slice(0, 2), clip(30), 3.6, 980, 54),
    ctaR(),
  ], legenda: legenda(`${m.t}: ${m.min} minutos, ${m.mat.toLowerCase()}, ${PRA_QUANDO[m.obj] ?? "pra brincar junto hoje"}.\n\n${passosTxt(m)}\n\nSalva pra fazer hoje e manda pra quem também precisa de uma ideia nova.`, k) }; },
  dor: (k) => { const m = brincDe(); const d = pega(DORES, "d"); return { etapa: "meio", scenes: [
    S.hook(d, clip(), 2.8, 88),
    S.caps(["não é falta de amor", "é decidir cansada, toda noite, do zero"], clip(20), 3.2),
    S.app("Você diz o tempo e a energia", [TELAS[0], TELAS[Math.min(2, TELAS.length - 1)], TELAS[Math.min(5, TELAS.length - 1)]], 4, [[0.9, 285, 700]], "o Pertinho mostra por onde começar"),
    S.card("Saiu essa", m, 5),
    ctaR(),
  ], legenda: legenda(`${d.replace(/<[^>]+>/g, "")}${/[?!]$/.test(d.replace(/<[^>]+>/g, "")) ? "" : "."} Não é falta de amor. É decidir cansada, toda noite, do zero.\n\nNo Pertinho você diz quanto tempo e quanta energia tem, e ele mostra uma brincadeira pronta. Hoje saiu essa:\n\n${m.t}\n${passosTxt(m)}`, k) }; },
  ingles: (k) => { const c = pega(INGLES, "i"); return { etapa: "meio", scenes: [
    S.hookText(`Palavra em inglês pra brincar hoje`, 2.4, "clay", 104, "sem precisar saber inglês"),
    S.raw(`<div class="abs" style="left:80px;right:80px;top:300px;text-align:center"><div class="h" data-in="0" style="font-size:80px">${c.pt}</div></div>
<div class="abs" data-pop style="left:90px;right:90px;top:520px"><img src="${art(c.img)}" style="width:100%;border-radius:36px;box-shadow:0 30px 70px rgba(60,30,10,.25)"></div>
<div class="abs" style="left:80px;right:80px;top:1080px;text-align:center"><div class="h" data-in="0.6" style="font-size:150px;color:var(--clay)">${c.en}</div><div class="b" data-in="1" style="font-size:54px;margin-top:20px">fala-se “${c.fala}”</div></div>`, 4.4, "cream warm"),
    S.list("Como brincar com o card", [["Esconde o card pela casa", ""], ["Quem achar fala a palavra", "em português e em inglês"], ["Depois ele esconde pra você", ""]], 4.6, "cream"),
    S.cta("100 cards de inglês pra imprimir", "vêm de bônus no Pertinho, junto com as brincadeiras", 3.6),
  ], legenda: legenda(`Palavra em inglês pra brincar hoje: ${c.pt} = ${c.en} (fala-se “${c.fala}”).\n\nComo brincar: esconde o card pela casa. Quem achar fala a palavra em português e em inglês. Depois ele esconde pra você.\n\nVocê não precisa falar inglês: o card já mostra como se fala. São 100 cards pra imprimir, e eles vêm de bônus no Pertinho, junto com as brincadeiras.`, k) }; },
  meconta: (k) => { const qs = [pega(MECONTA, "q"), pega(MECONTA, "q"), pega(MECONTA, "q")]; return { etapa: "topo", scenes: [
    S.hookText(`Troca o “como foi a escola?” por:`, 2.6, "clay", 104),
    S.text([qs[0]], 3, "cream", 92, 600), S.text([qs[1]], 3, "blush", 92, 600), S.text([qs[2]], 3, "cream", 92, 600),
    ctaR("Me Conta: perguntas que puxam conversa", "você responde primeiro, ele vem atrás"),
  ], legenda: legenda(`Troca o “como foi a escola?” por:\n\n• ${qs.join("\n• ")}\n\nDica: você responde primeiro. Ele vem atrás.\n\nEssas perguntas são do Me Conta, dentro do Pertinho.`, k) }; },
  memoria: (k) => { const [a, b, c] = pega(MEMORIAS, "m"); return { etapa: "topo", scenes: [
    S.hook(a, clip(), 2.8, 92), S.say(`<span class='hl'>${b}</span>`, clip(40), 2.6, 100, 700), S.say(c, clip(10), 2.6, 84, 700),
    ctaR("15 minutos de hoje valem", "uma brincadeira nova por dia, do tamanho da sua energia"),
  ], legenda: legenda(`${a[0].toUpperCase() + a.slice(1)}… ${b}. ${c[0].toUpperCase() + c.slice(1)}.\n\nManda pra alguém que precisa ler isso hoje 🧡`, k) }; },
  lista: (k) => { const obj = ["relaxar", "rir", "gastar energia", "conectar", "passar tempo"][ix.t++ % 5]; const ms = [brincDe((m) => m.obj === obj), brincDe((m) => m.obj === obj), brincDe((m) => m.obj === obj)]; const t = { relaxar: "3 pra fazer deitada", rir: "3 pra rir antes do banho", "gastar energia": "3 pra gastar a energia dele", conectar: "3 pra se conectar em 5 minutos", "passar tempo": "3 pra trocar a tela hoje" }[obj]; return { etapa: "topo", scenes: [
    S.hook(`salva: <span class='hl'>${t}</span>`, clip(), 2.4, 96), S.list(t, ms.map((m) => [m.t, `${m.min} min · ${m.mat.toLowerCase()}`]), 4.6), S.card("A favorita daqui", ms[0], 5), ctaR(),
  ], legenda: legenda(`Salva: ${t}.\n\n${ms.map((m, i) => `${i + 1}. ${m.t} (${m.min} min, ${m.mat.toLowerCase()})`).join("\n")}\n\nA favorita daqui: ${ms[0].t}\n${passosTxt(ms[0])}`, k) }; },
  produto: (k) => ({ etapa: "fundo", scenes: [
    S.hookText("O que tem dentro do Pertinho", 2.4, "clay", 110),
    S.app("Uma brincadeira em 3 toques", TELAS.slice(0, 4), 4.4, [[1.1, 285, 760], [2.2, 285, 900]]),
    S.list("O que vem", [["Mais de 60 brincadeiras", "de 2 a 6 anos"], ["Me Conta e Álbum", "conversa e lembrança"], ["100 cards de inglês", "bônus pra imprimir"], ["Tela boa", "8 jogos pra hora da tela"]], 4.8),
    S.cta("Pagamento único, acesso vitalício", "conhece pelo link na bio", 3.6),
  ], legenda: legenda(`O que tem dentro do Pertinho:\n\n• mais de 60 brincadeiras prontas, de 2 a 6 anos\n• você escolhe pelo tempo e pela energia que tem\n• Me Conta (perguntas que puxam conversa) e Álbum (guarda a foto e a frase do dia)\n• bônus: 100 cards de inglês pra imprimir, Rotina da Noite e Tela boa\n\nPagamento único, sem mensalidade.`, k) }),
};
const MIX_REELS = ["brinc", "dor", "memoria", "brinc", "ingles", "lista", "meconta", "brinc", "produto", "dor"];

const n2 = (i, t) => [i, t];
const CARROS = {
  situacao: (k) => { const sit = [["pra fazer deitada", "relaxar"], ["pra rir antes do banho", "rir"], ["pra gastar energia em casa", "gastar energia"], ["pra se conectar em 5 minutos", "conectar"], ["sem tela, com o que tem em casa", "passar tempo"]][ix.f++ % 5]; const ms = Array.from({ length: 5 }, () => brincDe((m) => m.obj === sit[1])); const t = 7; return { etapa: "topo", slides: [
    F.capa(1, t, "Salva pra hoje", `5 brincadeiras <em>${sit[0]}</em>`, card(ms[0], 400, 700, 610, 4) + front(60, 820, 310, 430, `${ms[0].min} min`, -6), 108),
    ...ms.map((m, i) => F.brinc(i + 2, t, String(i + 1), m, m.mat)), F.fim(t, t, "Uma nova toda noite", "pronta, do tamanho da sua energia"),
  ], legenda: legenda(`Salva pra hoje: 5 brincadeiras ${sit[0]}.\n\n${ms.map((m, i) => `${i + 1}. ${m.t} (${m.min} min)`).join("\n")}\n\nO passo a passo está nos cards. Manda pra quem também vive esse horário.`, k) }; },
  ingles: (k) => { const [tema, ini] = TEMAS_IN[ix.i++ % TEMAS_IN.length]; const cs = INGLES.slice(ini, ini + 6); const t = 8; return { etapa: "meio", slides: [
    F.capa(1, t, "Inglês brincando", `6 palavras de <em>${tema.toLowerCase()}</em> pra brincar hoje`, `<img src="${art(cs[0].img)}" class="abs" style="left:120px;top:760px;width:840px;border-radius:30px;transform:rotate(-3deg);box-shadow:0 24px 60px rgba(60,30,10,.25)">`, 104),
    ...cs.map((c, i) => F.raw(`${top(`${i + 2}/${t}`)}<div class="abs" style="left:80px;right:80px;top:200px;text-align:center"><div class="h" style="font-size:72px">${c.pt}</div></div><img src="${art(c.img)}" class="abs" style="left:90px;top:400px;width:900px;border-radius:32px;box-shadow:0 24px 60px rgba(60,30,10,.2)"><div class="abs" style="left:80px;right:80px;top:1010px;text-align:center"><div class="h" style="font-size:120px;color:var(--clay)">${c.en}</div><div class="b" style="font-size:48px;margin-top:10px">fala-se “${c.fala}”</div></div>`)),
    F.fim(t, t, "100 cards de inglês de bônus", "vêm junto com as brincadeiras do Pertinho"),
  ], legenda: legenda(`6 palavras de ${tema.toLowerCase()} em inglês pra brincar hoje:\n\n${cs.map((c) => `${c.pt} = ${c.en} (fala-se “${c.fala}”)`).join("\n")}\n\nJeito fácil: mostra o card, fala junto e transforma em brincadeira (esconde, imita, procura). Sem prova, sem cobrança.\n\nSão 100 cards pra imprimir, de bônus no Pertinho.`, k) }; },
  meconta: (k) => { const qs = Array.from({ length: 5 }, () => pega(MECONTA, "q")); const t = 7; return { etapa: "topo", slides: [
    F.frase(1, t, `5 perguntas melhores que <em>“como foi a escola?”</em>`, "Salva pra hora do jantar", "clay", 104),
    ...qs.map((q, i) => F.frase(i + 2, t, q, "", ["warm", "blush"][i % 2], 92)), F.fim(t, t, "Me Conta: uma pergunta por noite", "você responde primeiro, ele vem atrás"),
  ], legenda: legenda(`5 perguntas melhores que “como foi a escola?”:\n\n${qs.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\nDica: responde primeiro. Criança conta mais quando ouve você contar.`, k) }; },
  nota: (k) => { const [a, b, c] = pega(MEMORIAS, "m"); return { etapa: "topo", slides: [F.nota(1, 1, "pra ler com calma", [a, b, c, "15 minutos, celular de lado, uma brincadeira que ele ainda não conhece"], "", "blush", 50)],
    legenda: legenda(`${a[0].toUpperCase() + a.slice(1)}. ${b[0].toUpperCase() + b.slice(1)}. ${c[0].toUpperCase() + c.slice(1)}.\n\nManda pra alguém que precisa ler isso hoje 🧡`, k) }; },
  duvidas: (k) => { const t = 6; return { etapa: "fundo", slides: [
    F.capa(1, t, "Antes de conhecer", "4 dúvidas de quem <em>quase</em> entrou no Pertinho", phone(tela(TELAS[0]), 330, 640, 420, 4), 104),
    F.qa(2, t, "Preciso baixar aplicativo?", "Não. Abre no navegador do celular, e dá pra deixar um atalho na tela inicial"),
    F.qa(3, t, "Tem mensalidade?", "Não. É pagamento único, com acesso vitalício"),
    F.qa(4, t, "E se eu chegar cansada?", "Você diz quanto tempo e quanta energia tem. Muitas brincadeiras são de 5 minutos e dá pra fazer deitada"),
    F.qa(5, t, "E se não for pra nós?", "Você tem 7 dias de garantia e recebe todo o valor de volta"),
    F.fim(t, t, "Conhece pelo link na bio", "mais de 60 brincadeiras de 2 a 6 anos + bônus"),
  ], legenda: legenda(`4 dúvidas de quem quase entrou no Pertinho:\n\n1. Preciso baixar aplicativo? Não, abre no navegador.\n2. Tem mensalidade? Não, é pagamento único.\n3. E se eu chegar cansada? Você escolhe pela energia, tem brincadeira de 5 minutos.\n4. E se não for pra nós? 7 dias de garantia.`, k) }; },
};
const MIX_CARROS = ["situacao", "ingles", "meconta", "nota", "duvidas"];

// Stories (06/10, Matheus): 6 por dia e todos pra VENDER: provocação, app por dentro, espremer a dor, mecanismo,
// oferta e brincadeira pronta, sempre com CTA pro link da bio. A API não põe figurinha, então o CTA vai escrito na arte.
const PILL = (t = "Toque no link da bio") => `<div class="abs" style="left:0;right:0;top:1500px;text-align:center"><span class="pill" style="font-size:46px;padding:30px 52px">${t}</span><div class="b" style="margin-top:26px;font-size:36px;opacity:.8">${LINK} · @infancia.pertinho</div></div>`;
const PROVOCA = [
  ["Quantas vezes essa semana você disse <em>“depois a gente brinca”</em>?", "não é falta de amor, é a rotina engolindo o dia"],
  ["Ele sabe mais músicas do YouTube ou <em>brincadeiras com você</em>?", "dá pra virar isso com 15 minutos por dia"],
  ["Se ele contasse hoje como foi o dia <em>com você</em>, o que ele diria?", "15 minutos mudam a resposta"],
  ["Quando foi a última vez que vocês brincaram de <em>algo novo</em>?", "os mesmos brinquedos cansam ele e você"],
  ["Você trocaria 15 minutos de celular por <em>uma risada dele</em> hoje?", "a ideia pode vir pronta"],
  ["Ele pede pra brincar e você <em>não sabe do quê</em>?", "não precisa inventar, só escolher"],
];
const DORES_ST = [
  ["Ele não precisa de mais um brinquedo", "precisa de você, 15 minutos, com uma ideia pronta"],
  ["A infância dele não pausa", "enquanto você responde “só mais um e-mail”"],
  ["Cansada não é culpada", "o difícil é decidir do zero toda noite"],
  ["Ele vai lembrar de quem estava ali", "não do brinquedo que estava na caixa"],
];
const STV = {
  provoca: ([h, s]) => ({ cls: "clay", html: `${top()}<div class="abs" style="left:72px;right:72px;top:380px;text-align:center"><div class="h" style="font-size:100px">${h}</div><div class="b" style="margin-top:56px;font-size:46px">${s}</div></div>${PILL("Tem um jeito mais fácil · link na bio")}` }),
  dentro: () => ({ cls: "cream warm", html: `${top()}<div class="abs" style="left:72px;right:72px;top:190px;text-align:center"><span class="k">O Pertinho por dentro</span><div class="h" style="font-size:76px;margin-top:22px">Uma brincadeira pronta em 3 toques</div></div>${phone(tela(TELAS[0]), 120, 520, 400, -4)}${phone(tela(TELAS[Math.min(5, TELAS.length - 1)]), 560, 560, 400, 4)}${PILL()}` }),
  dor: ([h, s]) => ({ cls: "ink warm", html: `${top()}<img class="photo" src="${art(pega(FOTOS, "f"))}" style="opacity:.42"><div class="abs" style="left:72px;right:72px;top:520px;text-align:center"><div class="h" style="font-size:104px">${h}</div><div class="b" style="margin-top:50px;font-size:50px">${s}</div></div>${PILL()}` }),
  mecanismo: (m) => ({ cls: "blush", html: `${top()}<div class="abs" style="left:72px;right:72px;top:200px;text-align:center"><div class="h" style="font-size:72px">Você diz o tempo e a energia</div><div class="b" style="margin-top:18px;font-size:42px">o Pertinho entrega isso:</div></div>${card(m, 90, 470, 860, -2, "zoom:1.05")}${PILL("Mais de 60 assim · link na bio")}` }),
  oferta: () => ({ cls: "cream warm", html: `${top()}<div class="abs" style="left:72px;right:72px;top:220px"><div class="h" style="font-size:84px">O que vem no Pertinho</div>
<div class="b" style="font-size:46px;line-height:1.6;margin-top:40px">✓ Mais de 60 brincadeiras de 2 a 6 anos<br>✓ Escolhe pelo tempo e pela energia<br>✓ Me Conta e Álbum<br>✓ Bônus: 100 cards de inglês<br>✓ Bônus: Rotina da Noite e Tela boa</div>
<div class="h" style="font-size:60px;margin-top:60px;color:var(--clay)">Pagamento único<br>7 dias de garantia</div></div>${PILL()}` }),
  brinc: (m) => ({ cls: "blush", html: `${top()}<div class="abs" style="left:72px;right:150px;top:200px"><span class="k">pra hoje à noite</span><div class="h" style="font-size:80px;margin-top:22px">Brincadeira de hoje</div></div>${card(m, 66, 450, 800, 0, "zoom:1.15")}${PILL("Uma nova por dia · link na bio")}` }),
};
const STORY_SEQ = ["provoca", "dentro", "dor", "mecanismo", "oferta", "brinc"];
const STORY_HORAS = ["08:00", "10:30", "13:00", "15:30", "18:00", "21:00"];
// Feed (06/10, Matheus): 12 por dia, 7 reels + 5 carrosséis, pra alcance e seguidor (dica + dor + CTA)
const FEED_HORAS = ["07:00", "08:15", "09:30", "10:45", "12:00", "13:15", "14:30", "15:45", "17:00", "18:15", "19:30", "20:45", "21:45"];

// ── montagem do dia ──────────────────────────────────────────────────────────────────────────────────────────────
const agenda = existsSync(AGENDA) ? JSON.parse(readFileSync(AGENDA, "utf8")) : [];
const lote = [], cards = [], reels = [];
for (const [di, data] of DATAS.entries()) {
  const dn = Math.round((Date.parse(data) - Date.parse("2026-10-07")) / 86400e3);
  ix = { b: dn * 13 + 3, c: dn * 5, d: dn * 3, m: dn * 2, q: dn * 7, i: dn * 3, f: dn, t: dn * 2 };
  const ja = agenda.filter((p) => p.quando.startsWith(data) && p.fonte !== "volume");
  const tem = (t) => ja.filter((p) => p.tipo === t).length;
  const livre = (horas) => horas.filter((h) => !ja.some((p) => Math.abs(new Date(p.quando) - new Date(`${data}T${h}:00-03:00`)) < 25 * 60e3));
  const base = `04-volume/${data}`;
  const nR = Math.max(0, 7 - tem("reel")), nC = Math.max(0, 5 - tem("carrossel")), nS = Math.max(0, 6 - tem("story"));
  const mixR = ["brinc", "dor", "lista", "memoria", "brinc", "ingles", dn % 2 ? "produto" : "meconta"];
  const fila = [];
  for (let r = 0, c = 0; r < nR || c < nC;) { if (r < nR) fila.push(["reel", r++]); if (c < nC) fila.push(["carrossel", c++]); }
  livre(FEED_HORAS).slice(0, fila.length).forEach((h, k) => {
    const [tipoPub, i] = fila[k], id = `${data.slice(5)}-${h.replace(":", "h")}`;
    if (tipoPub === "reel") {
      const tipo = mixR[i % mixR.length], r = REELS[tipo](dn * 10 + i), pasta = `${base}/${h.replace(":", "h")}-reel-${tipo}`;
      reels.push({ pasta, scenes: r.scenes });
      lote.push({ id, quando: `${data}T${h}:00-03:00`, etapa: r.etapa, formato: tipo, tipo: "reel", pasta, arquivos: ["reel.mp4"], capa: "capa.jpg", legenda: r.legenda });
    } else {
      const tipo = MIX_CARROS[i % MIX_CARROS.length], c = CARROS[tipo](dn * 5 + i), pasta = `${base}/${h.replace(":", "h")}-carrossel-${tipo}`;
      c.slides.forEach((s, j) => cards.push({ out: `${pasta}/${j + 1}.jpg`, ...FD, cls: s.cls, html: s.html }));
      lote.push({ id, quando: `${data}T${h}:00-03:00`, etapa: c.etapa, formato: tipo, tipo: "carrossel", pasta, arquivos: c.slides.map((_, j) => `${j + 1}.jpg`), legenda: c.legenda });
    }
  });
  livre(STORY_HORAS).slice(0, nS).forEach((h, i) => {
    const t = STORY_SEQ[i];
    const s = t === "provoca" ? STV.provoca(PROVOCA[(dn + i) % PROVOCA.length]) : t === "dor" ? STV.dor(DORES_ST[(dn + i) % DORES_ST.length])
      : t === "mecanismo" || t === "brinc" ? STV[t](brincDe()) : STV[t]();
    const pasta = `${base}/stories`, nome = `${h.replace(":", "h")}-${t}.jpg`;
    cards.push({ out: `${pasta}/${nome}`, ...SY, cls: s.cls, html: s.html });
    lote.push({ id: `${data.slice(5)}-${h.replace(":", "h")}-story`, quando: `${data}T${h}:00-03:00`, etapa: "story", formato: t, tipo: "story", pasta, arquivos: [nome] });
  });
}
const loteDir = join(OUT, "04-volume");
mkdirSync(loteDir, { recursive: true });
const nomeLote = `lote-${DATAS[0]}${DATAS.length > 1 ? "_a_" + DATAS.at(-1) : ""}`;
if (!SHARD) {
  writeFileSync(join(loteDir, `${nomeLote}.json`), JSON.stringify(lote, null, 1));
  for (const p of lote.filter((x) => x.legenda)) { mkdirSync(join(OUT, p.pasta), { recursive: true }); writeFileSync(join(OUT, p.pasta, "legenda.txt"), p.legenda); }
  console.log(`${lote.length} peças (${reels.length} reels, ${cards.length} imagens) → ${nomeLote}.json`);
}
if (!SO_TEXTO) {
  const [k, n] = SHARD ?? [0, 1];
  if ((!SHARD || k === 0) && !args.includes("--so-reels")) await renderCards(cards);
  if (!args.includes("--so-imagens")) for (const [i, r] of reels.entries()) if (i % n === k) await renderReel(r.pasta, r.scenes);
}
