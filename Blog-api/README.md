# API Blog — INF222 TAF1

Bonjour,

Ce dossier contient **l'API REST** que j'ai developpee pour le TAF1 : gestion d'articles de blog (creation, lecture, modification, suppression) et **recherche** par mot-cle. J'ai utilise **Node.js**, le framework **Express**, et une base **SQLite** via le module **better-sqlite3**. La documentation interactive est exposee avec **Swagger UI** sur le chemin `/api-docs`.

## Technologies utilisees

- **Node.js** (version >= 18, comme indique dans `package.json`)
- **Express.js** pour le routage et les reponses HTTP
- **SQLite** (`better-sqlite3`) pour la persistance locale
- **Swagger** pour la documentation de l'API

## Installation

Depuis ce dossier :

```bash
npm install
```

## Demarrage (sans Docker)

```bash
npm start
```

On peut aussi lancer directement :

```bash
node server.js
```

Acces en local une fois le serveur pret :

- API : `http://localhost:4000`
- Swagger : `http://localhost:4000/api-docs`

Comme dans le README racine : j'ouvre la doc avec **localhost** ou **127.0.0.1**, pas avec `0.0.0.0` dans la barre d'adresse du navigateur.

---

## Docker

J'ai prepare des **Dockerfile** pour pouvoir executer la meme API dans un conteneur (utile pour le rendu du devoir et pour un deploiement type Render en mode Docker).

### Pourquoi j'ai ajoute Docker

- Reproduire le meme environnement sur une autre machine ou sur un serveur.
- Montrer la demarche **build** / **run** et le **mapping de ports**.
- Le module **better-sqlite3** necessite une compilation native : le Dockerfile installe les outils necessaires (`python3`, `make`, `g++`) pour que `npm ci` aboutisse.

### Si je build depuis ce dossier (contexte = `Blog-api/`)

```bash
docker build -t blog-api-local .
docker run --rm -p 4000:4000 -e PORT=4000 blog-api-local
```

(Depuis un terminal ouvert **dans** `Blog-api/`, ou en prefixant les chemins si vous etes ailleurs.)

### Si je build depuis la racine du depot Git

Les commandes sont dans le **README.md** a la racine du projet (monorepo avec copie de **Blog-api/** dans l'image).

### Port deja utilise

Si Docker affiche `address already in use` sur le port **4000**, c'est en general parce que j'ai encore l'API qui tourne avec **`npm start`** (ou un autre programme sur ce port). Soit j'arrete ce processus, soit je mappe un autre port, par exemple :

```bash
docker run --rm -p 4001:4000 -e PORT=4000 blog-api-local
```

J'accede alors a **`http://localhost:4001/api-docs`**. Le premier nombre (`4001`) est le port sur **ma machine** ; le second (`4000`) est celui ecoute **dans** le conteneur.

### Fichiers Docker dans ce dossier

- **Dockerfile** : utilise lorsque le contexte de build est le dossier **Blog-api/**.
- **.dockerignore** : pour ne pas copier `node_modules` ni mon fichier `.env` dans l'image.

---

## Organisation du code

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

## Endpoints implementes

- `GET /api/articles` — liste des articles (avec filtres selon les parametres prevus dans le code)
- `GET /api/articles/:id` — detail d'un article
- `POST /api/articles` — creation
- `PUT /api/articles/:id` — modification
- `DELETE /api/articles/:id` — suppression
- `GET /api/articles/search?query=...` — recherche dans le titre et le contenu

## Exemple de corps JSON (POST et PUT)

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

## Regles de validation

J'ai mis en place une validation cote serveur (middleware) :

- **titre** : obligatoire, chaine, entre 3 et 255 caracteres
- **contenu** : obligatoire, chaine, au moins 10 caracteres
- **auteur** : obligatoire, chaine, au moins 2 caracteres

## Tests rapides avec curl

```bash
curl -X POST http://localhost:4000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"titre":"Test","contenu":"Contenu de test suffisamment long","auteur":"DSI"}'

curl http://localhost:4000/api/articles

curl "http://localhost:4000/api/articles/search?query=test"
```

Si j'ai lance Docker avec `-p 4001:4000`, je remplace **4000** par **4001** dans les URLs ci-dessus.

## Fichier SQLite

Les donnees sont stockees dans **blog.db** a la racine de ce dossier (le fichier est cree au besoin au premier lancement).

Sur un hebergeur comme Render, le disque de l'instance peut etre **ephemere** : pour un TP ou une demonstration, SQLite reste acceptable ; pour une application serieuse avec des donnees a conserver, il faudrait une base managee (par exemple PostgreSQL).

## Deploiement sur Render

### Approche que j'ai privilegiee : Node sans Docker

1. Pousser le depot sur GitHub (ou autre forge).
2. Utiliser le **Blueprint** avec **render.yaml** a la racine (`rootDir: Blog-api`).
3. Ou configurer a la main un **Web Service** avec **Root Directory** = `Blog-api`, **Build** = `npm install`, **Start** = `npm start`.

### Si le service est en mode Docker

Il faut que le chemin du **Dockerfile** corresponde a ce que Render attend (racine du depot ou dossier **Blog-api/**, selon le **Root Directory** choisi). La variable **PORT** est fournie par Render ; mon **server.js** lit `process.env.PORT`, je n'ai pas fixe un port en dur pour la production.

### Variables d'environnement utiles

- **PORT** : fournie par Render en ligne.
- **RENDER_EXTERNAL_URL** : peut servir pour des URLs absolues dans la documentation, selon la configuration.
- **PUBLIC_URL** : optionnelle dans mon projet.

Merci pour votre attention.
