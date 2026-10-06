#!/usr/bin/env bash
# Junta o que os 4 renders produziram: legendas e lote (determinísticos, saem de novo aqui), trilha nos reels, agenda,
# poda de mídia velha, commit e push. Repete se o robô de publicação empurrar a agenda no meio.
set -e
DIAS="$*"
mkdir -p "$PT_ARTS" && cp -r fabrica/arts/. "$PT_ARTS/"   # a fábrica lê as telas e fotos ao carregar
node fabrica/ig/volume.mjs $DIAS --so-texto
cp "$(ls -t "$PT_OUT"/04-volume/lote-*.json | head -n 1)" "$PT_OUT/lote.json"
for t in 1 2 3 4 5 6; do
  git fetch -q origin main && git reset -q --hard origin/main
  node montar-agenda.mjs lote "$PT_OUT"
  node fabrica/poda.mjs
  git add -A agenda.json midia
  git -c user.name=fabrica-pertinho -c user.email=fabrica@users.noreply.github.com commit -q -m "fabrica: $DIAS" || { echo "nada novo"; exit 0; }
  git push -q origin HEAD:main && { echo "subiu: $DIAS"; exit 0; }
  sleep $((5 + t * 5))
done
exit 1
