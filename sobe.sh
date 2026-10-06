#!/usr/bin/env bash
# Junta na agenda o que a fábrica já renderizou e sobe pro GitHub (06/10/2026). Uso: bash sobe.sh <lote.json>
set -e
cd "$(dirname "$0")"
L="$1"; D=../instagram-pertinho
cp "$L" "$D/lote.json"
node montar-agenda.mjs lote "$D" | tail -n 1
git add -A
git diff --cached --quiet && { echo "nada novo"; exit 0; }
git -c user.name=matheuslow -c user.email=matheuspcampos0407@gmail.com commit -q -m "agenda: lote da fábrica ($(git diff --cached --numstat | wc -l) arquivos)"
T=$(gh auth token --user matheuslow)
git -c credential.helper= fetch -q "https://x-access-token:$T@github.com/matheuslow/pertinho-agenda.git" main
git -c user.name=matheuslow -c user.email=matheuspcampos0407@gmail.com rebase -q FETCH_HEAD || { git rebase --abort; echo "conflito"; exit 1; }
git -c credential.helper= -c http.postBuffer=524288000 push -q "https://x-access-token:$T@github.com/matheuslow/pertinho-agenda.git" HEAD:main && echo "subiu"
