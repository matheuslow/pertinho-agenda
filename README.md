# Agenda do @infancia.pertinho

Robô que publica no Instagram os posts de `agenda.json` no horário certo (GitHub Actions a cada 15 min, nos minutos 8, 23, 38 e 53).
Cópia do robô do @vendemaispostando. Mídias em `midia/`. Segredos: META_PAGE_TOKEN (token da página do Pertinho com
instagram_content_publish), IG_USER_ID (17841424109453601).

- `node montar-agenda.mjs base`: material do primeiro calendário (../instagram-pertinho), com trilha nos reels
- `node montar-agenda.mjs lote <dir>`: lote aprovado da fábrica de volume (../app/ig-pertinho/volume.mjs)
