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

## Lancer le projet en local (sans Docker)

```bash
cd Blog-api
npm install
npm start
```

Une fois le serveur demarre, vous pouvez acceder a :

- l'API : `http://localhost:4000`
- la documentation Swagger : `http://localhost:4000/api-docs`

**Remarque** : pour ouvrir la doc dans le navigateur, j'utilise **localhost** ou **127.0.0.1**. L'adresse `http://0.0.0.0:4000` ne fonctionne pas correctement dans Chrome (erreur du type `ERR_ADDRESS_INVALID`), meme si le serveur ecoute bien sur `0.0.0.0` pour accepter les connexions.

## Docker (optionnel)

J'ai documente Docker pour montrer comment l'API peut tourner dans un **conteneur** (meme environnement partout, dependances figees, compilation de `better-sqlite3` prise en charge dans l'image).

### Build depuis la racine du depot

Le `Dockerfile` a la racine copie le dossier **Blog-api/** dans l'image.

```bash
docker build -t blog-api-local .

docker run --rm -p 4000:4000 -e PORT=4000 blog-api-local
```

Puis : `http://localhost:4000/api-docs`.

### Si le port 4000 est deja occupe

J'ai rencontre l'erreur Docker `address already in use` lorsque le port **4000** etait deja utilise sur ma machine (par exemple parce que j'avais encore lance `npm start` dans un autre terminal). Deux possibilites :

1. Arreter l'autre processus (Ctrl+C).
2. Ou mapper un autre port **sans modifier le code** : par exemple le conteneur continue d'ecouter sur 4000 en interne, et j'expose le service sur 4001 sur ma machine :

```bash
docker run --rm -p 4001:4000 -e PORT=4000 blog-api-local
```

Dans ce cas, j'ouvre **`http://localhost:4001/api-docs`**.

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

## Documents utiles pour la correction

- Description detaillee de l'API : **Blog-api/README.md**
- Pistes de verification : **COMPTE_RENDU/API_BLOG_VERIFICATION.md**
- Guide general du TP : **DOCS/TP_TAF1_CLEEROUTE/00_GUIDE_GENERAL.md**
- Questions CleeRoute : **DOCS/TP_TAF1_CLEEROUTE/01_QUESTIONS_CLEEROUTE.md**
- Installation : **DOCS/TP_TAF1_CLEEROUTE/02_SETUP_ENVIRONNEMENT.md**
- Explications sur le code : **DOCS/TP_TAF1_CLEEROUTE/03_API_BLOG_CODE.md**
- Analyse critique : **DOCS/TP_TAF1_CLEEROUTE/04_ANALYSE_CRITIQUE.md**
- Template de rapport : **DOCS/TP_TAF1_CLEEROUTE/05_RAPPORT_TEMPLATE.md**

## Synthese

L'API fonctionne en local, les endpoints CRUD et la recherche ont ete testes, la documentation Swagger est accessible. Le deploiement sur Render et l'usage de Docker sont decrits ci-dessus pour faciliter la reproduction de mon environnement.

Merci pour votre lecture.
