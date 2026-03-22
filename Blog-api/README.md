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
