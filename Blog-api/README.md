# API Blog - INF222 TAF1

API REST de gestion d'articles de blog (CRUD + recherche), construite avec Node.js, Express et SQLite.

## Technologies

- Runtime: Node.js
- Framework: Express.js
- Base de donnees: SQLite (`better-sqlite3`)
- Documentation API: Swagger UI

## Installation

```bash
cd Blog-api
npm install
```

## Demarrage

```bash
# mode simple
npm start

# ou
node server.js
```

Serveur local:

- API: `http://localhost:4000`
- Swagger UI: `http://localhost:4000/api-docs`

## Structure

```text
Blog-api/
 controllers/
 database/
 middleware/
 models/
 routes/
 swagger/
 server.js
```

## Endpoints

- `GET /api/articles` : lister tous les articles (filtres optionnels: `categorie`, `auteur`, `date`)
- `GET /api/articles/:id` : recuperer un article par ID
- `POST /api/articles` : creer un article
- `PUT /api/articles/:id` : modifier un article
- `DELETE /api/articles/:id` : supprimer un article
- `GET /api/articles/search?query=...` : rechercher par mot-cle dans `titre` ou `contenu`

## Exemple de payload (POST / PUT)

```json
{
  "titre": "Introduction a Node.js",
  "contenu": "Node.js est un environnement d'execution JavaScript...",
  "auteur": "Alice",
  "categorie": "Tech",
  "tags": "node,javascript,backend",
  "date": "2026-03-22"
}
```

## Validation

Le middleware valide ces contraintes minimales:

- `titre`: obligatoire, string, min 3 caracteres, max 255
- `contenu`: obligatoire, string, min 10 caracteres
- `auteur`: obligatoire, string, min 2 caracteres

## Test rapide avec curl

```bash
# 1) Creer
curl -X POST http://localhost:4000/api/articles \
 -H "Content-Type: application/json" \
 -d '{"titre":"Test","contenu":"Contenu de test suffisamment long","auteur":"DSI"}'

# 2) Lister
curl http://localhost:4000/api/articles

# 3) Rechercher
curl "http://localhost:4000/api/articles/search?query=test"
```

## Notes

- Le fichier SQLite local est `blog.db`.
- Si le port 4000 est deja utilise, arreter le processus occupant ce port puis relancer l'API.

## Deploiement sur Render

1. **Depot Git** : pousse le code sur GitHub/GitLab/Bitbucket.

2. **Blueprint** : a la racine du depot, le fichier `render.yaml` declare un service web Node avec `rootDir: Blog-api`. Sur Render : **New** > **Blueprint** > connecter le depot ; Render lit `render.yaml` et cree le service.

3. **Deploiement manuel (sans Blueprint)** : **New** > **Web Service** > meme depot, reglages :
   - **Root Directory** : `Blog-api`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : Free (cold start possible apres inactivite)

4. **Variables** : Render fournit automatiquement `PORT` et `RENDER_EXTERNAL_URL`. Le code utilise `PORT` pour ecouter et `RENDER_EXTERNAL_URL` pour afficher la bonne URL dans Swagger. Optionnel : definir `PUBLIC_URL` si tu veux forcer une URL.

5. **SQLite en production** : le disque Render est **ephemere** — les donnees peuvent etre perdues au redemarrage ou au redeploiement. Pour un TP / demo c'est acceptable ; pour une vraie prod il faudrait une base gere (ex. PostgreSQL sur Render).

6. **Fichier d'exemple** : voir `.env.example` pour le developpement local (copier vers `.env` si besoin).
