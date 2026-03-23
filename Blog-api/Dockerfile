# -----------------------------------------------------------------------------
# Dockerfile dans Blog-api/ — meme API, autre contexte de build
# -----------------------------------------------------------------------------
# J'ai mis ce fichier ici pour le cas ou Docker ne voit QUE ce dossier (ex. sur
# Render quand Root Directory = Blog-api). Les instructions sont plus simples :
# tout est deja dans le repertoire courant, pas besoin de prefixe Blog-api/.
#
# Si tu build depuis ici : `docker build -t blog-api .` depuis Blog-api/
# Si tu build depuis la racine du monorepo : utilise plutot l'autre Dockerfile.
# -----------------------------------------------------------------------------
FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "server.js"]
