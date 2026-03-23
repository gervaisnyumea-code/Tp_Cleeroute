# TP CleeRoute — INF222

Bonjour,

Ce depot regroupe le travail que j'ai realise dans le cadre du **TAF1 INF222** : utilisation de la plateforme **CleeRoute** et developpement d'une **API REST** pour un blog (backend Node.js).

## Contenu du depot

J'ai organise les elements comme suit :

- **Blog-api/** : mon backend Express (CRUD sur les articles, recherche, documentation Swagger, base SQLite).
- **DOCS/TP_TAF1_CLEEROUTE/** : les guides du TP, les questions sur CleeRoute, le modele d'analyse critique et le template de rapport fournis dans l'enonce.
- **COMPTE_RENDU/** : mes captures et preuves de tests pour illustrer le fonctionnement de l'API.
- **render.yaml** : fichier de configuration pour un deploiement **Render** en runtime Node (Blueprint).
- **Dockerfile** a la racine et **Blog-api/Dockerfile** : fichiers Docker que j'ai ajoutes pour pouvoir construire une image de l'API (voir la section Docker ci-dessous).

**Pour le detail des endpoints, des tests et du depannage**, j'ai regroupe les instructions dans **Blog-api/README.md** (fichier a lire en priorite pour reproduire ou corriger l'API).

---

## Lancer le projet en local (sans Docker)

```bash
cd Blog-api
npm install
npm start
```

Par defaut le serveur ecoute sur le port **4000** (sauf si je definis **PORT** dans un fichier `.env` — voir **Blog-api/.env.example**).

### Ce que vous voyez dans le navigateur

| URL | Comportement |
|-----|----------------|
| `http://localhost:4000/` | **Redirection** vers la documentation Swagger (`/api-docs`), pour eviter d'afficher du JSON brut sur la racine (comportement identique sur **Render** si j'ouvre l'URL HTTPS sans chemin). |
| `http://localhost:4000/ui` | **Redirection** vers l'interface frontend (`/Frontend/index.html`) pour une demonstration orientee utilisateur. |
| `http://localhost:4000/Frontend/index.html` | Interface Frontend complete (cartes, filtres, modales CRUD) servie par le backend Express. |
| `http://localhost:4000/api-docs` | Interface **Swagger UI** : liste des routes, schemas, bouton *Try it out* pour tester l'API. |
| `http://localhost:4000/api/articles` | Reponse **JSON** (liste des articles). |

**Remarque** : j'utilise **localhost** ou **127.0.0.1** dans la barre d'adresse. L'URL `http://0.0.0.0:4000` est souvent refusee par le navigateur (`ERR_ADDRESS_INVALID`), meme si le serveur ecoute sur `0.0.0.0` pour accepter les connexions (notamment sur Render ou Docker).

### En ligne de commande (`curl`)

- Un `curl` sur la **racine** `/` recoit une reponse **302** (redirection vers `/api-docs`), pas du JSON. Pour suivre la redirection automatiquement : `curl -L http://localhost:4000/`.
- Pour tester directement les donnees JSON sans passer par la redirection, j'utilise par exemple : `curl http://localhost:4000/api/articles`.

Les exemples complets (POST, recherche, remplacement du port avec Docker) sont dans **Blog-api/README.md**.

---

## Frontend de demonstration (`Frontend/index.html`)

J'ai ajoute une interface complete dans **`Frontend/index.html`** qui consomme l'API REST.  
Elle est compatible avec le travail **en local** et avec un backend **deploye sur Render**.

### Utilisation en local

1. Demarrer le backend :
   ```bash
   cd Blog-api
   npm install
   npm start
   ```
2. Ouvrir `Frontend/index.html` dans le navigateur (double-clic) **ou** servir le dossier via un serveur statique.
3. Le frontend detecte automatiquement le mode local et tente `http://localhost:4000`.

### Utilisation avec Render

- Si la page est servie depuis un domaine Render, le frontend cible automatiquement `https://api-blog-ruhu.onrender.com`.
- Si la base detectee ne repond pas, une **bascule automatique** teste l'autre base (local <-> Render) et une notification l'indique.
- Sur Render, j'accede directement au frontend via :
  - `https://api-blog-ruhu.onrender.com/Frontend/index.html`
  - ou plus simple `https://api-blog-ruhu.onrender.com/ui` (redirection 302 vers la route ci-dessus).

### Forcer la base API (utile pour les tests)

- `?api=local`  -> force `http://localhost:4000`
- `?api=render` -> force `https://api-blog-ruhu.onrender.com`
- `?apiBase=https://mon-api.exemple.com` -> force une URL personnalisee

Exemples :

- `file:///.../Frontend/index.html?api=render`
- `http://localhost:3000/index.html?apiBase=https://api-blog-ruhu.onrender.com`

---

## Docker (optionnel)

J'ai documente Docker pour montrer comment l'API peut tourner dans un **conteneur** (meme environnement partout, dependances figees, compilation de `better-sqlite3` prise en charge dans l'image).

### Build depuis la racine du depot

Le `Dockerfile` a la racine copie le dossier **Blog-api/** dans l'image.

```bash
docker build -t blog-api-local .

docker run --rm -p 4000:4000 -e PORT=4000 blog-api-local
```

Puis : `http://localhost:4000/` (redirection vers Swagger) ou `http://localhost:4000/api-docs`.

### Si le port 4000 est deja occupe

J'ai rencontre l'erreur Docker `address already in use` lorsque le port **4000** etait deja utilise sur ma machine (par exemple parce que j'avais encore lance `npm start` dans un autre terminal). Deux possibilites :

1. Arreter l'autre processus (Ctrl+C).
2. Ou mapper un autre port **sans modifier le code** : par exemple le conteneur continue d'ecouter sur 4000 en interne, et j'expose le service sur 4001 sur ma machine :

```bash
docker run --rm -p 4001:4000 -e PORT=4000 blog-api-local
```

Dans ce cas, j'ouvre **`http://localhost:4001/`** ou **`http://localhost:4001/api-docs`**.

### Build lorsque seul le dossier Blog-api est le contexte Docker

Si l'outil ou la plateforme ne prend en compte que **Blog-api/** (comme Render avec **Root Directory = Blog-api** en mode Docker), j'utilise le `Dockerfile` place **dans** ce dossier :

```bash
cd Blog-api
docker build -t blog-api-local .
docker run --rm -p 4000:4000 -e PORT=4000 blog-api-local
```

### Deploiement Render : Node ou Docker ?

Pour ce TP, la voie la plus simple est le **runtime Node** : mon **render.yaml** pointe vers **Blog-api** avec `npm install` et `npm start`, sans Docker obligatoire.

Si vous consultez un service Render configure en **mode Docker**, il faut que l'emplacement du **Dockerfile** et le **Root Directory** correspondent a la structure du depot (racine du repo ou dossier **Blog-api/**), comme indique dans les commentaires des Dockerfiles.

Sur **Render**, l'URL publique (ex. `https://mon-service.onrender.com`) ouvre la **meme redirection** vers Swagger sur la racine. Le plan **gratuit** peut mettre quelques secondes a repondre apres une periode d'inactivite (*cold start*).

### Redirections resumees (utile pour la correction)

- `GET /` -> `302 /api-docs`
- `GET /ui` -> `302 /Frontend/index.html`
- `GET /Frontend/index.html` -> page frontend

---

## Documents utiles pour la correction

- **Instructions detaillees sur l'API** : **Blog-api/README.md**
- Pistes de verification : **COMPTE_RENDU/API_BLOG_VERIFICATION.md**
- Guide general TP : **DOCS/TP_TAF1_CLEEROUTE/00_GUIDE_GENERAL.md**
- Questions CleeRoute : **DOCS/TP_TAF1_CLEEROUTE/01_QUESTIONS_CLEEROUTE.md**
- Installation : **DOCS/TP_TAF1_CLEEROUTE/02_SETUP_ENVIRONNEMENT.md**
- Explications sur le code : **DOCS/TP_TAF1_CLEEROUTE/03_API_BLOG_CODE.md**
- Analyse critique : **DOCS/TP_TAF1_CLEEROUTE/04_ANALYSE_CRITIQUE.md**
- Template de rapport : **DOCS/TP_TAF1_CLEEROUTE/05_RAPPORT_TEMPLATE.md**

## Synthese

L'API fonctionne en local et en ligne, les endpoints CRUD et la recherche sont decrits dans Swagger, la racine `/` redirige vers la documentation pour faciliter la demonstration dans le navigateur. Le deploiement sur Render et l'usage de Docker sont decrits ci-dessus et dans **Blog-api/README.md**.

Merci pour votre lecture.
