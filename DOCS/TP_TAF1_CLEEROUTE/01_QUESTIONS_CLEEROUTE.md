# 🧠 QUESTIONS STRATÉGIQUES — CleeRoute & Moi

## INF222 EC1 — TAF1 : API Backend Blog

> **Mode d'emploi** :
> 
> 1. Lis la question
> 2. Copie-colle la question dans le **chat CleeRoute**
> 3. Lis la réponse de CleeRoute
> 4. Compare avec **ma réponse** (section "🎓 Réponse Complète")
> 5. Écris une synthèse dans ton rapport

---

# ═══════════════════════════════════════════

# BLOC 1 — FONDATIONS : LE WEB ET LES API

# ═══════════════════════════════════════════

---

## ❓ QUESTION 1

> **"Qu'est-ce qu'une API REST ? Explique-moi ses 6 principes fondamentaux avec des exemples concrets, et dis-moi pourquoi elle est utilisée dans le développement web moderne."**

### 🎓 Réponse Complète

**API** = Application Programming Interface = un contrat de communication entre deux logiciels.

**REST** = Representational State Transfer = un style architectural (pas un protocole) défini par Roy Fielding en 2000.

Imagine un **restaurant** :

- Toi = le client (frontend / application mobile)
- Le menu = la documentation de l'API
- Le serveur = l'API REST
- La cuisine = le backend (base de données, logique métier)

Tu ne vas pas en cuisine, tu commandes via le serveur (l'API). C'est exactement ça, REST.

**Les 6 principes de REST :**

| #   | Principe                          | Explication simple                                                               |
| --- | --------------------------------- | -------------------------------------------------------------------------------- |
| 1   | **Client-Serveur**                | Le frontend et le backend sont séparés. Chacun évolue indépendamment.            |
| 2   | **Sans état (Stateless)**         | Chaque requête est indépendante. Le serveur ne mémorise rien entre les requêtes. |
| 3   | **Mise en cache (Cacheable)**     | Les réponses peuvent être mises en cache pour améliorer les performances.        |
| 4   | **Interface uniforme**            | Toutes les ressources sont accessibles de la même façon (via URLs).              |
| 5   | **Système en couches**            | Le client ne sait pas s'il parle au serveur principal ou à un proxy.             |
| 6   | **Code à la demande (optionnel)** | Le serveur peut envoyer du code exécutable au client (rare).                     |

**Exemple concret :**

```
Client demande : GET https://monblog.com/api/articles/5
Serveur répond : { "id": 5, "titre": "Mon article", "auteur": "Alice" }
```

Le client a obtenu la ressource (article n°5) sans que le serveur sache qui il est.

**Pourquoi REST dans le web moderne ?**

- Simple à comprendre et à implémenter
- Compatible avec tous les langages
- Fonctionne sur HTTP (standard universel)
- Permet de créer des applications séparées (web + mobile + desktop) avec le même backend

---

## ❓ QUESTION 2

> **"Explique-moi en détail les méthodes HTTP GET, POST, PUT, PATCH et DELETE. Pour chaque méthode : à quoi elle sert, un exemple concret dans le contexte d'une API de blog, et le code HTTP de réponse attendu."**

### 🎓 Réponse Complète

Les méthodes HTTP sont les **verbes** du web. Ils indiquent ce que tu veux faire avec une ressource.

```
RESSOURCE = un objet (article, utilisateur, produit...)
URL = l'adresse de la ressource
MÉTHODE = l'action que tu veux faire sur cette ressource
```

### GET — Lire / Récupérer

```http
GET /api/articles          → Récupère TOUS les articles
GET /api/articles/3        → Récupère l'article avec l'ID 3
GET /api/articles?auteur=Alice → Filtre les articles par auteur
```

- **Idempotent** : plusieurs appels identiques = même résultat
- **Code succès** : `200 OK`
- **Ne modifie rien** sur le serveur

### POST — Créer

```http
POST /api/articles
Body: { "titre": "Mon premier article", "auteur": "Bob" }
```

- **Non-idempotent** : chaque appel crée un nouvel article
- **Code succès** : `201 Created`
- Les données sont dans le **corps (body)** de la requête

### PUT — Remplacer complètement

```http
PUT /api/articles/3
Body: { "titre": "Nouveau titre", "contenu": "...", "auteur": "Bob", ... }
```

- Remplace **TOUT** l'article (tous les champs obligatoires)
- **Code succès** : `200 OK`
- Si l'article n'existe pas → `404 Not Found`

### PATCH — Modifier partiellement

```http
PATCH /api/articles/3
Body: { "titre": "Juste le titre change" }
```

- Modifie **seulement les champs envoyés**
- **Code succès** : `200 OK`

### DELETE — Supprimer

```http
DELETE /api/articles/3
```

- Supprime l'article n°3
- **Code succès** : `200 OK` ou `204 No Content`

### Résumé visuel

```
CRUD   ←→   HTTP METHOD   ←→   SQL
──────────────────────────────────────
Create  →   POST          →   INSERT
Read    →   GET           →   SELECT
Update  →   PUT / PATCH   →   UPDATE
Delete  →   DELETE        →   DELETE
```

---

## ❓ QUESTION 3

> **"Qu'est-ce que Node.js ? Quelle est la différence entre Node.js et un navigateur web ? Qu'est-ce qu'Express.js et pourquoi l'utilise-t-on ? Montre-moi le code minimal d'un serveur Express."**

### 🎓 Réponse Complète

**Node.js** = JavaScript côté serveur.

Avant Node.js (créé en 2009), JavaScript ne pouvait s'exécuter que dans un navigateur. Ryan Dahl a eu l'idée d'extraire le moteur V8 de Chrome et de le faire tourner en dehors du navigateur → Node.js est né.

| Caractéristique    | Navigateur        | Node.js               |
| ------------------ | ----------------- | --------------------- |
| Environnement      | Client (ton ordi) | Serveur               |
| Accès aux fichiers | ❌ Non (sécurité)  | ✅ Oui                 |
| Accès au réseau    | Limité            | Complet               |
| DOM (HTML)         | ✅ Oui             | ❌ Non                 |
| Modules            | ES Modules        | CommonJS + ES Modules |

**Express.js** = un framework minimaliste pour Node.js qui simplifie la création de serveurs web et d'API.

Sans Express, créer un serveur HTTP en Node pur est verbeux :

```javascript
// SANS Express (Node pur) — compliqué
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/articles') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ articles: [] }));
  }
  // ...des dizaines de conditions if/else...
});
server.listen(3000);
```

```javascript
// AVEC Express — propre et simple
const express = require('express');
const app = express();

app.get('/api/articles', (req, res) => {
  res.json({ articles: [] });
});

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
```

**Pourquoi Express ?**

- Routage simple et lisible
- Middleware (fonctions intermédiaires)
- Écosystème npm énorme
- Légèreté → tu construis seulement ce dont tu as besoin

---

# ═══════════════════════════════════════════

# BLOC 2 — BASE DE DONNÉES

# ═══════════════════════════════════════════

---

## ❓ QUESTION 4

> **"Qu'est-ce que SQLite ? Quelles sont ses différences avec MySQL et MongoDB ? Pourquoi est-il idéal pour un projet de développement ? Comment l'utiliser avec Node.js via le package 'better-sqlite3' ?"**

### 🎓 Réponse Complète

**SQLite** = une base de données relationnelle **stockée dans un seul fichier** (`.db`).

Pas besoin d'installer un serveur de base de données séparé → idéal pour apprendre et pour les projets simples.

### Comparaison des 3 bases de données

| Critère      | SQLite                | MySQL            | MongoDB               |
| ------------ | --------------------- | ---------------- | --------------------- |
| Type         | Relationnel           | Relationnel      | NoSQL (documents)     |
| Installation | Aucune                | Serveur requis   | Serveur requis        |
| Stockage     | 1 fichier `.db`       | Serveur dédié    | Serveur dédié         |
| Langage      | SQL                   | SQL              | JSON-like (MQL)       |
| Scalabilité  | Petits projets        | Moyen à grand    | Très large            |
| Idéal pour   | Apprendre, prototypes | Applications web | Big data, flexibilité |

### Concepts SQL essentiels

```sql
-- Créer une table
CREATE TABLE articles (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  titre   TEXT    NOT NULL,
  contenu TEXT    NOT NULL,
  auteur  TEXT    NOT NULL,
  date    TEXT    DEFAULT CURRENT_TIMESTAMP,
  categorie TEXT,
  tags    TEXT
);

-- Insérer un article
INSERT INTO articles (titre, contenu, auteur, categorie, tags)
VALUES ('Mon titre', 'Mon contenu', 'Alice', 'Tech', 'node,api');

-- Lire tous les articles
SELECT * FROM articles;

-- Lire un article par ID
SELECT * FROM articles WHERE id = 1;

-- Mettre à jour
UPDATE articles SET titre = 'Nouveau titre' WHERE id = 1;

-- Supprimer
DELETE FROM articles WHERE id = 1;

-- Rechercher
SELECT * FROM articles WHERE titre LIKE '%node%' OR contenu LIKE '%node%';
```

### Utilisation avec better-sqlite3

```javascript
// Installation : npm install better-sqlite3
const Database = require('better-sqlite3');
const db = new Database('./database/blog.db');

// Requête qui retourne plusieurs résultats
const articles = db.prepare('SELECT * FROM articles').all();

// Requête qui retourne un seul résultat
const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(1);

// Requête d'insertion/modification/suppression
const result = db.prepare('INSERT INTO articles (titre, auteur) VALUES (?, ?)').run('Titre', 'Alice');
console.log(result.lastInsertRowid); // ID du nouvel article
```

---

## ❓ QUESTION 5

> **"Qu'est-ce que la validation des données dans une API ? Pourquoi est-elle cruciale ? Donne-moi des exemples de règles de validation pour un article de blog (titre, auteur, contenu, catégorie, tags) avec le code correspondant en Express."**

### 🎓 Réponse Complète

**La validation** = vérifier que les données reçues sont correctes avant de les traiter.

**Pourquoi c'est crucial ?**

1. 🔒 **Sécurité** : empêcher les injections SQL, XSS, données malveillantes
2. 📊 **Intégrité** : garantir que la BD ne contient que des données cohérentes
3. 👤 **Expérience** : retourner des messages d'erreur clairs à l'utilisateur
4. 🐛 **Débogage** : éviter les bugs causés par des données inattendues

### Règles de validation pour un article

| Champ       | Règles                                          |
| ----------- | ----------------------------------------------- |
| `titre`     | Obligatoire, string, min 3 chars, max 255 chars |
| `contenu`   | Obligatoire, string, min 10 chars               |
| `auteur`    | Obligatoire, string, min 2 chars                |
| `categorie` | Optionnel, string, max 100 chars                |
| `tags`      | Optionnel, string (séparés par virgule)         |

### Code de validation en Express

```javascript
// middleware/validateArticle.js

function validateArticle(req, res, next) {
  const { titre, contenu, auteur, categorie, tags } = req.body;
  const errors = [];

  // Vérification du titre
  if (!titre || typeof titre !== 'string') {
    errors.push('Le titre est obligatoire');
  } else if (titre.trim().length < 3) {
    errors.push('Le titre doit contenir au moins 3 caractères');
  } else if (titre.trim().length > 255) {
    errors.push('Le titre ne peut pas dépasser 255 caractères');
  }

  // Vérification du contenu
  if (!contenu || typeof contenu !== 'string') {
    errors.push('Le contenu est obligatoire');
  } else if (contenu.trim().length < 10) {
    errors.push('Le contenu doit contenir au moins 10 caractères');
  }

  // Vérification de l'auteur
  if (!auteur || typeof auteur !== 'string') {
    errors.push('L\'auteur est obligatoire');
  } else if (auteur.trim().length < 2) {
    errors.push('Le nom de l\'auteur doit contenir au moins 2 caractères');
  }

  // Si des erreurs existent → répondre avec 400 Bad Request
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors
    });
  }

  // Sinon → passer à la suite (contrôleur)
  next();
}

module.exports = validateArticle;
```

---

# ═══════════════════════════════════════════

# BLOC 3 — ARCHITECTURE ET BONNES PRATIQUES

# ═══════════════════════════════════════════

---

## ❓ QUESTION 6

> **"Explique-moi l'architecture MVC (Model-View-Controller) appliquée à une API Node.js. Quelle est la différence entre un Model, un Controller et une Route ? Montre-moi comment organiser les dossiers d'un projet Express."**

### 🎓 Réponse Complète

**MVC** = un patron de conception (design pattern) qui sépare les responsabilités d'une application en 3 couches.

```
REQUÊTE HTTP
    │
    ▼
┌─────────────────────────────────────────────┐
│  ROUTE                                       │
│  "Je reçois la requête et je la             │
│   dirige vers le bon contrôleur"            │
│  Ex: app.post('/api/articles', controller)  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  CONTROLLER                                  │
│  "Je gère la logique métier :               │
│   je valide, j'appelle le model,            │
│   je construis la réponse"                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  MODEL                                       │
│  "Je parle à la base de données :           │
│   INSERT, SELECT, UPDATE, DELETE"           │
└─────────────────────────────────────────────┘
                   │
                   ▼
             BASE DE DONNÉES
```

### Structure de dossiers recommandée

```
blog-api/
│
├── server.js              ← Point d'entrée, configuration Express
├── package.json           ← Dépendances du projet
├── .env                   ← Variables d'environnement (PORT, etc.)
├── README.md              ← Documentation
│
├── database/
│   └── db.js              ← Connexion et initialisation SQLite
│
├── models/
│   └── articleModel.js    ← Requêtes SQL (CRUD)
│
├── controllers/
│   └── articleController.js ← Logique métier
│
├── routes/
│   └── articleRoutes.js   ← Définition des endpoints
│
└── swagger/
    └── swagger.js         ← Configuration Swagger
```

### Analogie simple

- **Route** = le réceptionniste d'un hôtel → il reçoit les clients et les dirige
- **Controller** = le chef de département → il prend les décisions
- **Model** = le personnel d'exécution → il fait le vrai travail (base de données)

---

## ❓ QUESTION 7

> **"Qu'est-ce que les codes de statut HTTP ? Explique-moi 200, 201, 400, 404 et 500 avec des exemples concrets dans le contexte d'une API de blog. Quand utiliser chacun ?"**

### 🎓 Réponse Complète

Les codes HTTP sont des **signaux standardisés** que le serveur envoie au client pour lui dire ce qui s'est passé.

Ils sont regroupés en familles :

| Famille | Code           | Signification                 |
| ------- | -------------- | ----------------------------- |
| **2xx** | Succès         | La requête a bien été traitée |
| **3xx** | Redirection    | Le client doit aller ailleurs |
| **4xx** | Erreur client  | Le client a fait une erreur   |
| **5xx** | Erreur serveur | Le serveur a planté           |

### Les codes essentiels du TP

**200 OK** — Succès général

```javascript
// Utilisation : GET réussi, PUT réussi, DELETE réussi
res.status(200).json({ success: true, data: articles });
// Ou simplement (200 est la valeur par défaut dans Express) :
res.json({ success: true, data: articles });
```

**201 Created** — Ressource créée avec succès

```javascript
// Utilisation : après un POST réussi
res.status(201).json({
  success: true,
  message: 'Article créé avec succès',
  data: { id: nouvelId, titre: 'Mon titre' }
});
```

**400 Bad Request** — Requête mal formée

```javascript
// Utilisation : données manquantes ou invalides
res.status(400).json({
  success: false,
  message: 'Le titre est obligatoire'
});
```

**404 Not Found** — Ressource introuvable

```javascript
// Utilisation : article demandé n'existe pas
res.status(404).json({
  success: false,
  message: 'Article non trouvé'
});
```

**500 Internal Server Error** — Erreur serveur

```javascript
// Utilisation : bug inattendu dans le code
try {
  // ... code ...
} catch (error) {
  console.error(error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
}
```

### Règle mnémotechnique

```
2xx = ✅ Ça marche
4xx = 😤 C'est de ta faute (client)
5xx = 💥 C'est de ma faute (serveur)
```

---

## ❓ QUESTION 8

> **"Qu'est-ce que Swagger (OpenAPI) ? Comment documenter une API REST avec swagger-jsdoc et swagger-ui-express dans un projet Node.js/Express ? Montre-moi un exemple de documentation pour l'endpoint POST /api/articles."**

### 🎓 Réponse Complète

**Swagger** (maintenant appelé **OpenAPI Specification**) = un standard pour décrire, documenter et tester les APIs REST.

Il génère automatiquement une **interface web interactive** où tu peux :

- Voir tous les endpoints de l'API
- Voir les paramètres et les formats de réponse
- Tester l'API directement depuis le navigateur

**Deux packages nécessaires :**

```bash
npm install swagger-jsdoc swagger-ui-express
```

- `swagger-jsdoc` → lit les commentaires JSDoc dans ton code et génère la spec OpenAPI
- `swagger-ui-express` → affiche l'interface graphique Swagger

### Configuration de base

```javascript
// swagger/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Blog INF222',
      version: '1.0.0',
      description: 'API REST pour gérer un blog simple',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Serveur local' }
    ],
  },
  apis: ['./routes/*.js'], // Lit les commentaires dans les fichiers de routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
```

### Exemple de documentation d'un endpoint

```javascript
// Dans routes/articleRoutes.js

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     description: Ajoute un article dans la base de données
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - contenu
 *               - auteur
 *             properties:
 *               titre:
 *                 type: string
 *                 example: "Introduction à Node.js"
 *               contenu:
 *                 type: string
 *                 example: "Node.js est un environnement JavaScript..."
 *               auteur:
 *                 type: string
 *                 example: "Alice"
 *               categorie:
 *                 type: string
 *                 example: "Technologie"
 *               tags:
 *                 type: string
 *                 example: "node,javascript,backend"
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', validateArticle, articleController.creerArticle);
```

**Accès à Swagger UI** : `http://localhost:3000/api-docs`

---

## ❓ QUESTION 9

> **"Qu'est-ce qu'un middleware dans Express.js ? Explique le cycle de vie d'une requête HTTP dans Express avec un schéma. Donne-moi 3 exemples de middlewares utiles pour une API REST."**

### 🎓 Réponse Complète

**Middleware** = une fonction qui s'exécute **entre** la réception d'une requête et l'envoi de la réponse.

C'est la chaîne de montage de ta requête HTTP :

```
REQUÊTE ENTRANTE
       │
       ▼
┌─────────────────────┐
│  Middleware 1       │  → express.json()    : parse le body JSON
│  (global)          │
└──────────┬──────────┘
           │  next()
           ▼
┌─────────────────────┐
│  Middleware 2       │  → cors()            : autorise les requêtes cross-origin
│  (global)          │
└──────────┬──────────┘
           │  next()
           ▼
┌─────────────────────┐
│  Middleware 3       │  → validateArticle() : valide les données
│  (spécifique route) │
└──────────┬──────────┘
           │  next()
           ▼
┌─────────────────────┐
│  CONTRÔLEUR         │  → creerArticle()   : logique métier
│  (handler final)    │
└──────────┬──────────┘
           │
           ▼
     RÉPONSE ENVOYÉE
```

**Signature d'un middleware :**

```javascript
function monMiddleware(req, res, next) {
  // ... faire quelque chose ...
  next(); // Passer au middleware suivant (IMPORTANT !)
}
```

**3 middlewares utiles :**

**1. express.json()** — Parser le body JSON

```javascript
app.use(express.json());
// Sans ça, req.body sera undefined dans tes contrôleurs !
```

**2. CORS** — Autoriser les requêtes depuis d'autres origines

```javascript
const cors = require('cors');
app.use(cors());
// Permet au frontend (ex: localhost:8080) d'appeler ton API (localhost:3000)
```

**3. Logger personnalisé** — Journaliser les requêtes

```javascript
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});
// Affiche dans la console : [2026-03-21T10:30:00Z] POST /api/articles
```

---

## ❓ QUESTION 10

> **"Comment tester une API REST ? Explique-moi comment utiliser Postman pour tester tous les endpoints d'une API de blog (POST, GET, PUT, DELETE). Quels tests faire pour chaque endpoint ?"**

### 🎓 Réponse Complète

**Tester une API** = vérifier que chaque endpoint se comporte correctement avec différentes entrées.

**Postman** = un outil graphique qui permet d'envoyer des requêtes HTTP et d'analyser les réponses. Gratuit et très utilisé en entreprise.

**Alternative légère** : l'extension VS Code **REST Client** (fichier `.http`)

### Tests pour chaque endpoint

**1. POST /api/articles — Créer un article**

```
Test ✅ Succès :
  Method : POST
  URL    : http://localhost:3000/api/articles
  Body   : { "titre": "Test", "contenu": "Contenu de test minimum", "auteur": "Alice" }
  Attendu: 201 + { success: true, data: { id: 1, ... } }

Test ❌ Erreur validation :
  Body   : { "titre": "", "auteur": "Alice" }
  Attendu: 400 + { errors: ["Le titre est obligatoire", ...] }
```

**2. GET /api/articles — Lire tous les articles**

```
Test ✅ Liste normale :
  Method : GET
  URL    : http://localhost:3000/api/articles
  Attendu: 200 + tableau JSON d'articles

Test ✅ Filtrage :
  URL    : http://localhost:3000/api/articles?categorie=Tech
  Attendu: 200 + articles filtrés
```

**3. GET /api/articles/:id — Lire un article**

```
Test ✅ ID existant :
  URL    : http://localhost:3000/api/articles/1
  Attendu: 200 + objet article complet

Test ❌ ID inexistant :
  URL    : http://localhost:3000/api/articles/9999
  Attendu: 404 + { message: "Article non trouvé" }
```

**4. PUT /api/articles/:id — Modifier**

```
Test ✅ Modification :
  Method : PUT
  URL    : http://localhost:3000/api/articles/1
  Body   : { "titre": "Titre modifié", "contenu": "...", "auteur": "Alice" }
  Attendu: 200 + article mis à jour
```

**5. DELETE /api/articles/:id — Supprimer**

```
Test ✅ Suppression :
  Method : DELETE
  URL    : http://localhost:3000/api/articles/1
  Attendu: 200 + { message: "Article supprimé" }

Test ❌ ID inexistant :
  URL    : http://localhost:3000/api/articles/9999
  Attendu: 404
```

---

## 📊 TABLEAU DE SYNTHÈSE — Pour ton rapport

| Question | Concept clé       | À retenir                                            |
| -------- | ----------------- | ---------------------------------------------------- |
| Q1       | API REST          | Interface de communication + 6 principes             |
| Q2       | Méthodes HTTP     | GET=Lire, POST=Créer, PUT=Modifier, DELETE=Supprimer |
| Q3       | Node.js + Express | JS côté serveur + framework HTTP                     |
| Q4       | SQLite            | BD fichier, pas de serveur, SQL                      |
| Q5       | Validation        | Sécurité + intégrité des données                     |
| Q6       | Architecture MVC  | Routes → Controllers → Models                        |
| Q7       | Codes HTTP        | 2xx=succès, 4xx=erreur client, 5xx=erreur serveur    |
| Q8       | Swagger           | Documentation interactive de l'API                   |
| Q9       | Middleware        | Fonctions intermédiaires dans la chaîne de requête   |
| Q10      | Tests Postman     | Tester chaque endpoint avec cas succès + cas erreur  |

---

> 🔄 **Rappel** : Pour chaque question, copie-la dans le chat CleeRoute, récupère sa réponse, et compare avec ce que tu viens de lire. La différence entre les deux réponses est de l'or pour ta Partie 3 (Analyse critique) !
