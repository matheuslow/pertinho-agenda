#!/usr/bin/env bash
# Prepara o runner do GitHub Actions pra fábrica: ffmpeg, emoji, artes e quadros das cenas (os vídeos de cena ficam
# guardados como mp4 em fabrica/clips e viram quadros aqui, como o motor espera em _arts/v/<cena>/0001.jpg).
set -e
sudo apt-get update -qq && sudo apt-get install -y -qq ffmpeg fonts-noto-color-emoji > /dev/null
mkdir -p "$PT_ARTS/v" "$PT_OUT"
cp -r fabrica/arts/. "$PT_ARTS/"
for f in fabrica/clips/*.mp4; do c=$(basename "$f" .mp4); mkdir -p "$PT_ARTS/v/$c"; ffmpeg -v error -i "$f" -q:v 3 "$PT_ARTS/v/$c/%04d.jpg"; done
(cd fabrica && npm install --no-audit --no-fund --silent)
