# API Blog — INF222 TAF1

Bonjour,

Ce dossier contient **l'API REST** que j'ai developpee pour le TAF1 : gestion d'articles de blog (creation, lecture, modification, suppression) et **recherche** par mot-cle. J'ai utilise **Node.js**, le framework **Express**, et une base **SQLite** via le module **better-sqlite3**. La documentation interactive est exposee avec **Swagger UI** sur le chemin `/api-docs`.

---

## Technologies utilisees

- **Node.js** (version >= 18, comme indique dans `package.json`)
- **Express.js** pour le routage et les reponses HTTP
- **SQLite** (`better-sqlite3`) pour la persistance locale
- **Swagger** (OpenAPI) pour la documentation et les tests depuis le navigateur

---

## Installation et demarrage

```bash
npm install
npm start
```

Equivalent direct :

```bash
node server.js
```

**Port** : par defaut **4000** en local. Je peux fixer un autre port en creant un fichier **`.env`** a la racine de ce dossier (voir **`.env.example`** : copier vers `.env` et decommenter `PORT=...`). Sur **Render**, c'est la plateforme qui definit **PORT** ; je ne dois pas coder un numero de port fixe dans le code (c'est deja gere dans `server.js`).

---

## Guide d'utilisation (pour la correction ou une demo)

### 1. Navigateur

| URL (exemple local)                                  | Resultat                                                                                                                                                                                     |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `http://localhost:4000/` ou `http://127.0.0.1:4000/` | **Redirection HTTP 302** vers `/api-docs` : j'affiche directement **Swagger**, au lieu d'une page JSON sur la racine (utile sur **Render** quand on ouvre l'URL HTTPS publique sans chemin). |
| `http://localhost:4000/api-docs`                     | Interface **Swagger UI** : liste des operations, schemas, bouton **Try it out** pour envoyer des requetes reelles a l'API.                                                                   |
| `http://localhost:4000/api/articles`                 | Reponse **JSON** (liste des articles).                                                                                                                                                       |

Sur **Render**, je remplace `localhost:4000` par mon URL publique, par exemple `https://mon-service.onrender.com/`. Le plan gratuit peut **mettre en veille** le service : le premier acces apres inactivite peut prendre une dizaine de secondes (_cold start_).

**Important** : dans la barre d'adresse je n'utilise pas `0.0.0.0` comme hote (souvent erreur dans le navigateur). J'utilise **localhost**, **127.0.0.1** (local) ou le **domaine Render** (production).

### 2. Ligne de commande (`curl`)

- **`GET /` (racine)** : le serveur repond par une **redirection 302** vers `/api-docs`, pas par un corps JSON.
  - Pour **suivre** la redirection et recuperer le HTML de Swagger :  
    `curl -L http://localhost:4000/`
  - Pour **voir** les en-tetes sans suivre :  
    `curl -i http://localhost:4000/`  
    (on voit `302` et `Location: /api-docs`).
- Pour tester **directement** les donnees de l'API sans passer par la racine, j'appelle une route REST, par exemple :  
  `curl http://localhost:4000/api/articles`

Les requetes **POST** et **PUT** doivent envoyer du **JSON** avec l'en-tete `Content-Type: application/json` (Swagger le fait automatiquement ; en `curl` je le mets comme dans les exemples ci-dessous).

### 3. Swagger (methode recommandee pour tout tester)

1. Ouvrir `/api-docs`.
2. Choisir une route, cliquer sur **Try it out**, remplir les champs, **Execute**.
3. Lire le **code HTTP** et le corps de la reponse en bas (200, 201, 400, 404, etc.).

Cela evite les fautes de frappe sur les URLs et montre les schemas attendus (champs obligatoires, types).

---

## Variables d'environnement (local)

Le fichier **`.env.example`** decrit les variables possibles. En local uniquement :

1. Copier : `cp .env.example .env` (ou creer `.env` a la main).
2. Adapter **PORT** si le port 4000 est deja pris sur ma machine.
3. **Ne pas commiter** le fichier `.env` (il peut contenir des infos sensibles ou specifiques a ma machine ; il est liste dans `.gitignore`).

Sur **Render**, les variables utiles (**PORT**, parfois **RENDER_EXTERNAL_URL**) sont injectees par la plateforme.

---

## Endpoints implementes

- `GET /` — **redirection** vers `/api-docs` (pas de JSON sur la racine ; voir section _curl_ ci-dessus).
- `GET /api/articles` — liste des articles (filtres possibles selon les parametres prevus dans le code).
- `GET /api/articles/:id` — detail d'un article.
- `POST /api/articles` — creation (corps JSON valide selon la validation).
- `PUT /api/articles/:id` — modification.
- `DELETE /api/articles/:id` — suppression.
- `GET /api/articles/search?query=...` — recherche dans le titre et le contenu.

Les routes inexistantes renvoient une reponse **404** au format JSON defini dans `server.js`.

---

## Exemple de corps JSON (POST et PUT)

```json
{
  "titre": "Introduction a Node.js",
  "contenu": "Node.js est un environnement d'execution JavaScript...",
  "auteur": "DARYL NYUMEA PEHA",
  "categorie": "Technologie full-stack / DevSecOps",
  "tags": "node,javascript,backend",
  "date": "2026-03-22"
}
```

## Regles de validation

- **titre** : obligatoire, chaine, entre 3 et 255 caracteres
- **contenu** : obligatoire, chaine, au moins 10 caracteres
- **auteur** : obligatoire, chaine, au moins 2 caracteres

---

## Tests rapides avec `curl` (local)

Remplacer `4000` par le port expose si j'utilise Docker avec `-p 4001:4000`, et l'hote par mon URL **Render** en production.

```bash
# Liste des articles (JSON direct, sans passer par la racine /)
curl http://localhost:4000/api/articles

# Racine : afficher les en-tetes (redirection 302 vers /api-docs)
curl -i http://localhost:4000/

# Racine : suivre la redirection (contenu HTML de Swagger)
curl -L http://localhost:4000/

# Creer un article
curl -X POST http://localhost:4000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"titre":"Test","contenu":"Contenu de test suffisamment long","auteur":"DSI"}'

# Rechercher
curl "http://localhost:4000/api/articles/search?query=test"
```

---

## Docker

J'ai prepare des **Dockerfile** pour executer la meme API dans un conteneur (voir aussi le **README.md** a la racine du depot pour le build monorepo).

### Depuis ce dossier (contexte = `Blog-api/`)

```bash
docker build -t blog-api-local .
docker run --rm -p 4000:4000 -e PORT=4000 blog-api-local
```

### Port deja utilise (`address already in use`)

Souvent parce que **`npm start`** tourne encore ou qu'un autre programme occupe le port **4000**. Soit j'arrete ce processus, soit :

```bash
docker run --rm -p 4001:4000 -e PORT=4000 blog-api-local
```

J'utilise alors **`http://localhost:4001/`** ou **`http://localhost:4001/api-docs`**.

### Fichiers dans ce dossier

- **Dockerfile** : build lorsque le contexte Docker est **Blog-api/**.
- **.dockerignore** : exclusion de `node_modules`, `.env`, fichiers auxiliaires SQLite.

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

---

## Fichier SQLite

Les donnees sont stockees dans **blog.db** a la racine de ce dossier (cree au besoin au premier lancement).

Sur un hebergeur comme **Render**, le disque de l'instance peut etre **ephemere** : les donnees peuvent etre perdues au redeploiement ou au redemarrage. Pour un TP ou une demonstration, SQLite convient ; pour une application avec donnees critiques, il faudrait une base managee (par exemple PostgreSQL).

---

## Deploiement sur Render

### Approche que j'ai privilegiee : Node sans Docker

1. Pousser le depot sur GitHub (ou autre forge).
2. **Blueprint** : utiliser **render.yaml** a la racine (`rootDir: Blog-api`).
3. Ou **Web Service** manuel : **Root Directory** = `Blog-api`, **Build** = `npm install`, **Start** = `npm start`.

### Si le service est en mode Docker

Le chemin du **Dockerfile** doit correspondre au **Root Directory** (racine du depot ou ce dossier **Blog-api/**). **PORT** est fourni par Render ; `server.js` utilise `process.env.PORT`.

### Variables utiles (Render)

- **PORT** : definie automatiquement en production.
- **RENDER_EXTERNAL_URL** : peut servir pour des URLs dans la doc Swagger selon la configuration du projet.
- **PUBLIC_URL** : optionnelle si je la configure pour la documentation.

---

Merci pour votre attention.
