# -----------------------------------------------------------------------------
# Dockerfile (racine du depot) — TP INF222, API Blog
# -----------------------------------------------------------------------------
# En Licence 2 on apprend que Docker = "recette" pour fabriquer une image qui
# contient tout ce qu'il faut pour lancer l'app pareil partout (Node, deps, code).
#
# Ici le projet Node est dans Blog-api/ donc on COPY ce dossier. Sur Render, si
# le service est en mode Docker, il faut que ce fichier soit la ou Render le
# cherche (souvent racine du repo si Root Directory = vide).
#
# better-sqlite3 : ce n'est pas que du JS, il compile du code natif → j'installe
# python3 + make + g++ comme en TD quand node-gyp rale.
# -----------------------------------------------------------------------------
FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY Blog-api/package.json Blog-api/package-lock.json ./
RUN npm ci --omit=dev

COPY Blog-api/ ./

ENV NODE_ENV=production
# EXPOSE : surtout informatif ; Render injecte PORT au runtime de toute facon
EXPOSE 4000

CMD ["node", "server.js"]
