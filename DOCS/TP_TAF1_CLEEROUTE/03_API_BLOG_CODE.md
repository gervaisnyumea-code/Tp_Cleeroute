# 💻 CODE COMPLET DE L'API BLOG — EXPLIQUÉ

## INF222 EC1 — TAF1 : Partie 2

> **Règle d'or** : Lis l'explication de chaque fichier AVANT de le créer.
> Comprends ce que tu tapes. Ne copie pas aveuglément.

---

## Vue d'ensemble — Flux d'une requête

```
1. Client envoie :  POST /api/articles  { titre: "...", auteur: "..." }
                              │
                              ▼
2. server.js         → Reçoit la requête, applique les middlewares globaux
                              │
                              ▼
3. articleRoutes.js  → Identifie la route POST /, appelle validateArticle
                              │
                              ▼
4. validateArticle   → Vérifie que titre, contenu, auteur sont présents
                              │
                              ▼
5. articleController → Appelle articleModel.creerArticle()
                              │
                              ▼
6. articleModel      → Exécute INSERT INTO articles... sur SQLite
                              │
                              ▼
7. Réponse remonte :  { success: true, data: { id: 1, titre: "..." } }
```

---

## FICHIER 1 : `database/db.js`

> **Rôle** : Créer/ouvrir la base de données SQLite et initialiser la table `articles`.

```javascript
// database/db.js

const Database = require('better-sqlite3');
const path = require('path');

// Chemin absolu vers le fichier de base de données
// __dirname = dossier actuel (database/)
// On remonte d'un niveau (..) pour aller à la racine du projet
const dbPath = path.join(__dirname, '..', 'blog.db');

// Ouvre (ou crée) la base de données
// Le fichier blog.db sera créé automatiquement s'il n'existe pas
const db = new Database(dbPath);

// Active le mode WAL pour de meilleures performances
db.pragma('journal_mode = WAL');

// Crée la table articles si elle n'existe pas encore
// "IF NOT EXISTS" → ne plante pas si la table existe déjà
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    titre     TEXT    NOT NULL,
    contenu   TEXT    NOT NULL,
    auteur    TEXT    NOT NULL,
    date      TEXT    DEFAULT (datetime('now', 'localtime')),
    categorie TEXT    DEFAULT '',
    tags      TEXT    DEFAULT ''
  )
`);

console.log('✅ Base de données SQLite initialisée');

// Exporte l'objet db pour l'utiliser dans les autres fichiers
module.exports = db;
```

**Explication des colonnes :**

- `id` : identifiant unique, s'incrémente automatiquement (1, 2, 3...)
- `titre`, `contenu`, `auteur` : obligatoires (`NOT NULL`)
- `date` : remplie automatiquement si non fournie
- `categorie`, `tags` : optionnels, chaîne vide par défaut

---

## FICHIER 2 : `models/articleModel.js`

> **Rôle** : Toutes les requêtes SQL vers la base de données. Le model ne connaît pas HTTP.

```javascript
// models/articleModel.js

const db = require('../database/db');

const articleModel = {

  // ─────────────────────────────────────────────
  // CRÉER un article
  // ─────────────────────────────────────────────
  creer(articleData) {
    const { titre, contenu, auteur, date, categorie, tags } = articleData;

    const stmt = db.prepare(`
      INSERT INTO articles (titre, contenu, auteur, date, categorie, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Les '?' sont des paramètres sécurisés (évite les injections SQL)
    const resultat = stmt.run(
      titre.trim(),
      contenu.trim(),
      auteur.trim(),
      date || new Date().toISOString().split('T')[0], // date du jour si non fournie
      categorie ? categorie.trim() : '',
      tags ? tags.trim() : ''
    );

    // Retourne l'article créé avec son nouvel ID
    return this.trouverParId(resultat.lastInsertRowid);
  },

  // ─────────────────────────────────────────────
  // LIRE tous les articles (avec filtres optionnels)
  // ─────────────────────────────────────────────
  trouverTous(filtres = {}) {
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    // Filtre par catégorie
    if (filtres.categorie) {
      query += ' AND categorie = ?';
      params.push(filtres.categorie);
    }

    // Filtre par auteur
    if (filtres.auteur) {
      query += ' AND auteur = ?';
      params.push(filtres.auteur);
    }

    // Filtre par date
    if (filtres.date) {
      query += ' AND date = ?';
      params.push(filtres.date);
    }

    query += ' ORDER BY id DESC'; // Les plus récents en premier

    return db.prepare(query).all(...params);
  },

  // ─────────────────────────────────────────────
  // LIRE un article par son ID
  // ─────────────────────────────────────────────
  trouverParId(id) {
    return db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  },

  // ─────────────────────────────────────────────
  // MODIFIER un article
  // ─────────────────────────────────────────────
  modifier(id, modifications) {
    const { titre, contenu, auteur, categorie, tags } = modifications;

    const stmt = db.prepare(`
      UPDATE articles
      SET titre = ?, contenu = ?, auteur = ?, categorie = ?, tags = ?
      WHERE id = ?
    `);

    const resultat = stmt.run(
      titre.trim(),
      contenu.trim(),
      auteur.trim(),
      categorie ? categorie.trim() : '',
      tags ? tags.trim() : '',
      id
    );

    // changes = nombre de lignes modifiées (0 si article non trouvé)
    if (resultat.changes === 0) return null;

    return this.trouverParId(id);
  },

  // ─────────────────────────────────────────────
  // SUPPRIMER un article
  // ─────────────────────────────────────────────
  supprimer(id) {
    // Vérifie d'abord que l'article existe
    const article = this.trouverParId(id);
    if (!article) return null;

    db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    return article; // Retourne l'article supprimé (pour confirmation)
  },

  // ─────────────────────────────────────────────
  // RECHERCHER dans titre et contenu
  // ─────────────────────────────────────────────
  rechercher(query) {
    // LIKE '%texte%' = contient "texte" n'importe où
    const stmt = db.prepare(`
      SELECT * FROM articles
      WHERE titre LIKE ? OR contenu LIKE ?
      ORDER BY id DESC
    `);

    // Le '%' autour du query = "contient"
    const terme = `%${query}%`;
    return stmt.all(terme, terme);
  }

};

module.exports = articleModel;
```

---

## FICHIER 3 : `controllers/articleController.js`

> **Rôle** : Reçoit les requêtes HTTP, appelle le model, construit la réponse JSON.

```javascript
// controllers/articleController.js

const articleModel = require('../models/articleModel');

const articleController = {

  // ─────────────────────────────────────────────
  // POST /api/articles — Créer un article
  // ─────────────────────────────────────────────
  creerArticle(req, res) {
    try {
      const nouvelArticle = articleModel.creer(req.body);

      return res.status(201).json({
        success: true,
        message: 'Article créé avec succès',
        data: nouvelArticle
      });

    } catch (erreur) {
      console.error('Erreur lors de la création :', erreur);
      return res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  },

  // ─────────────────────────────────────────────
  // GET /api/articles — Lire tous les articles
  // ─────────────────────────────────────────────
  obtenirArticles(req, res) {
    try {
      // req.query contient les paramètres de l'URL (?categorie=Tech&auteur=Alice)
      const { categorie, auteur, date } = req.query;
      const filtres = {};

      if (categorie) filtres.categorie = categorie;
      if (auteur)    filtres.auteur    = auteur;
      if (date)      filtres.date      = date;

      const articles = articleModel.trouverTous(filtres);

      return res.status(200).json({
        success: true,
        count: articles.length,
        data: articles
      });

    } catch (erreur) {
      console.error('Erreur lors de la récupération :', erreur);
      return res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  },

  // ─────────────────────────────────────────────
  // GET /api/articles/:id — Lire un article
  // ─────────────────────────────────────────────
  obtenirArticleParId(req, res) {
    try {
      // req.params.id = la valeur dans l'URL (/api/articles/5 → id = "5")
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'L\'ID doit être un nombre entier'
        });
      }

      const article = articleModel.trouverParId(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: `Article avec l'ID ${id} non trouvé`
        });
      }

      return res.status(200).json({
        success: true,
        data: article
      });

    } catch (erreur) {
      console.error('Erreur lors de la récupération par ID :', erreur);
      return res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  },

  // ─────────────────────────────────────────────
  // PUT /api/articles/:id — Modifier un article
  // ─────────────────────────────────────────────
  modifierArticle(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'L\'ID doit être un nombre entier'
        });
      }

      const articleModifie = articleModel.modifier(id, req.body);

      if (!articleModifie) {
        return res.status(404).json({
          success: false,
          message: `Article avec l'ID ${id} non trouvé`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Article modifié avec succès',
        data: articleModifie
      });

    } catch (erreur) {
      console.error('Erreur lors de la modification :', erreur);
      return res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  },

  // ─────────────────────────────────────────────
  // DELETE /api/articles/:id — Supprimer un article
  // ─────────────────────────────────────────────
  supprimerArticle(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'L\'ID doit être un nombre entier'
        });
      }

      const articleSupprime = articleModel.supprimer(id);

      if (!articleSupprime) {
        return res.status(404).json({
          success: false,
          message: `Article avec l'ID ${id} non trouvé`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Article supprimé avec succès',
        data: articleSupprime
      });

    } catch (erreur) {
      console.error('Erreur lors de la suppression :', erreur);
      return res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  },

  // ─────────────────────────────────────────────
  // GET /api/articles/search?query=texte — Rechercher
  // ─────────────────────────────────────────────
  rechercherArticles(req, res) {
    try {
      const { query } = req.query;

      if (!query || query.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Le paramètre "query" est requis'
        });
      }

      const articles = articleModel.rechercher(query.trim());

      return res.status(200).json({
        success: true,
        count: articles.length,
        query: query,
        data: articles
      });

    } catch (erreur) {
      console.error('Erreur lors de la recherche :', erreur);
      return res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

};

module.exports = articleController;
```

---

## FICHIER 4 : `middleware/validateArticle.js`

> **Rôle** : Valider les données avant de créer ou modifier un article.

D'abord, crée le dossier :

```bash
mkdir middleware
```

```javascript
// middleware/validateArticle.js

function validateArticle(req, res, next) {
  const { titre, contenu, auteur } = req.body;
  const errors = [];

  // Vérification titre
  if (!titre || typeof titre !== 'string' || titre.trim().length === 0) {
    errors.push('Le titre est obligatoire et ne peut pas être vide');
  } else if (titre.trim().length < 3) {
    errors.push('Le titre doit contenir au moins 3 caractères');
  } else if (titre.trim().length > 255) {
    errors.push('Le titre ne peut pas dépasser 255 caractères');
  }

  // Vérification contenu
  if (!contenu || typeof contenu !== 'string' || contenu.trim().length === 0) {
    errors.push('Le contenu est obligatoire et ne peut pas être vide');
  } else if (contenu.trim().length < 10) {
    errors.push('Le contenu doit contenir au moins 10 caractères');
  }

  // Vérification auteur
  if (!auteur || typeof auteur !== 'string' || auteur.trim().length === 0) {
    errors.push('L\'auteur est obligatoire et ne peut pas être vide');
  } else if (auteur.trim().length < 2) {
    errors.push('Le nom de l\'auteur doit contenir au moins 2 caractères');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Données de l\'article invalides',
      errors: errors
    });
  }

  next();
}

module.exports = validateArticle;
```

---

## FICHIER 5 : `routes/articleRoutes.js`

> **Rôle** : Définir les endpoints et les associer aux contrôleurs.

```javascript
// routes/articleRoutes.js

const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const validateArticle   = require('../middleware/validateArticle');

// ─── IMPORTANT : La route /search DOIT être avant /:id ───
// Sinon Express interprète "search" comme un ID !

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Gestion des articles du blog
 */

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texte à rechercher dans le titre ou le contenu
 *     responses:
 *       200:
 *         description: Liste des articles correspondants
 *       400:
 *         description: Paramètre query manquant
 */
router.get('/search', articleController.rechercherArticles);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema: { type: string }
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: auteur
 *         schema: { type: string }
 *         description: Filtrer par auteur
 *       - in: query
 *         name: date
 *         schema: { type: string }
 *         description: Filtrer par date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Liste de tous les articles
 */
router.get('/', articleController.obtenirArticles);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titre, contenu, auteur]
 *             properties:
 *               titre:
 *                 type: string
 *                 example: "Introduction à Node.js"
 *               contenu:
 *                 type: string
 *                 example: "Node.js est un runtime JavaScript côté serveur..."
 *               auteur:
 *                 type: string
 *                 example: "Alice Dupont"
 *               categorie:
 *                 type: string
 *                 example: "Technologie"
 *               tags:
 *                 type: string
 *                 example: "node,javascript,backend"
 *               date:
 *                 type: string
 *                 example: "2026-03-21"
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', validateArticle, articleController.creerArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: Article trouvé
 *       404:
 *         description: Article non trouvé
 */
router.get('/:id', articleController.obtenirArticleParId);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titre, contenu, auteur]
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               auteur:
 *                 type: string
 *               categorie:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article modifié
 *       404:
 *         description: Article non trouvé
 */
router.put('/:id', validateArticle, articleController.modifierArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Article supprimé
 *       404:
 *         description: Article non trouvé
 */
router.delete('/:id', articleController.supprimerArticle);

module.exports = router;
```

---

## FICHIER 6 : `swagger/swagger.js`

```javascript
// swagger/swagger.js

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi    = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Blog — INF222 TAF1',
      version: '1.0.0',
      description: `
        API REST pour gérer un blog simple.
        Développée dans le cadre du cours INF222 EC1 (Développement Backend).

        ## Fonctionnalités
        - CRUD complet sur les articles
        - Filtrage par catégorie, auteur, date
        - Recherche full-text
      `,
      contact: {
        name: 'INF222 EC1',
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement local'
      }
    ],
  },
  apis: ['./routes/*.js'], // Cherche les commentaires Swagger dans les routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
```

---

## FICHIER 7 : `server.js` (Point d'entrée)

> **Rôle** : Configuration globale d'Express, montage des middlewares, démarrage du serveur.

```javascript
// server.js

const express = require('express');
const cors    = require('cors');

// Import des routes
const articleRoutes = require('./routes/articleRoutes');

// Import de la configuration Swagger
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

// Initialise la base de données (création de la table si besoin)
require('./database/db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════
// MIDDLEWARES GLOBAUX
// ═══════════════════════════════════════════

// Parse le corps des requêtes en JSON
// Sans ça : req.body = undefined
app.use(express.json());

// Autorise les requêtes depuis d'autres origines (ex: frontend sur port 8080)
app.use(cors());

// Logger simple pour voir les requêtes entrantes dans le terminal
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString('fr-FR');
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ═══════════════════════════════════════════
// DOCUMENTATION SWAGGER
// ═══════════════════════════════════════════

// Interface Swagger accessible sur http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'API Blog INF222',
  customCss: '.swagger-ui .topbar { display: none }'
}));

// ═══════════════════════════════════════════
// ROUTES DE L'API
// ═══════════════════════════════════════════

// Toutes les routes articles commencent par /api/articles
app.use('/api/articles', articleRoutes);

// Route racine — Message de bienvenue
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Blog INF222 — Serveur opérationnel !',
    version: '1.0.0',
    endpoints: {
      documentation: 'GET /api-docs',
      articles: 'GET /api/articles',
      creer:    'POST /api/articles',
      lire:     'GET /api/articles/:id',
      modifier: 'PUT /api/articles/:id',
      supprimer:'DELETE /api/articles/:id',
      recherche:'GET /api/articles/search?query=texte'
    }
  });
});

// ═══════════════════════════════════════════
// GESTION DES ROUTES INEXISTANTES (404)
// ═══════════════════════════════════════════

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `La route ${req.method} ${req.url} n'existe pas`
  });
});

// ═══════════════════════════════════════════
// DÉMARRAGE DU SERVEUR
// ═══════════════════════════════════════════

app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 Swagger UI   : http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API Articles : http://localhost:${PORT}/api/articles`);
  console.log('═══════════════════════════════════════\n');
});

module.exports = app;
```

---

## FICHIER 8 : `README.md`

```markdown
# API Blog — INF222 TAF1

API REST pour gérer un blog simple, développée avec Node.js et Express.

## Technologies

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : SQLite (via better-sqlite3)
- **Documentation** : Swagger UI

## Installation

```bash
# Cloner le projet
git clone <URL_DU_REPO>
cd blog-api

# Installer les dépendances
npm install

# Lancer le serveur
node server.js
```

## Endpoints

| Méthode | URL                              | Description                 |
| ------- | -------------------------------- | --------------------------- |
| GET     | /api/articles                    | Récupérer tous les articles |
| POST    | /api/articles                    | Créer un article            |
| GET     | /api/articles/:id                | Récupérer un article par ID |
| PUT     | /api/articles/:id                | Modifier un article         |
| DELETE  | /api/articles/:id                | Supprimer un article        |
| GET     | /api/articles/search?query=texte | Rechercher                  |

## Documentation

Swagger UI disponible sur : http://localhost:3000/api-docs

## Exemple d'utilisation

### Créer un article

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Introduction à Node.js",
    "contenu": "Node.js est un environnement d'\''exécution JavaScript côté serveur...",
    "auteur": "Alice Dupont",
    "categorie": "Technologie",
    "tags": "node,javascript,backend"
  }'
```

### Réponse

```json
{
  "success": true,
  "message": "Article créé avec succès",
  "data": {
    "id": 1,
    "titre": "Introduction à Node.js",
    "auteur": "Alice Dupont",
    "date": "2026-03-21",
    "categorie": "Technologie",
    "tags": "node,javascript,backend"
  }
}
```

```
---

## ▶️ Lancer et tester l'API

```bash
# Dans le dossier blog-api
node server.js
```

Ensuite teste dans le navigateur :

- **http://localhost:3000** → Message de bienvenue
- **http://localhost:3000/api-docs** → Interface Swagger

### Fichier de test REST Client (optionnel)

Crée un fichier `test.http` à la racine :

```http
### Créer un article
POST http://localhost:3000/api/articles
Content-Type: application/json

{
  "titre": "Mon premier article avec Node.js",
  "contenu": "Dans ce tutoriel, nous allons apprendre Node.js et Express step by step.",
  "auteur": "Alice Dupont",
  "categorie": "Technologie",
  "tags": "node,express,api"
}

###

### Récupérer tous les articles
GET http://localhost:3000/api/articles

###

### Récupérer les articles de la catégorie Technologie
GET http://localhost:3000/api/articles?categorie=Technologie

###

### Récupérer un article par ID
GET http://localhost:3000/api/articles/1

###

### Modifier un article
PUT http://localhost:3000/api/articles/1
Content-Type: application/json

{
  "titre": "Titre modifié",
  "contenu": "Contenu mis à jour, au moins dix caractères",
  "auteur": "Alice Dupont",
  "categorie": "Développement"
}

###

### Rechercher des articles
GET http://localhost:3000/api/articles/search?query=Node

###

### Supprimer un article
DELETE http://localhost:3000/api/articles/1
```

---

## 📸 Captures d'écran à faire pour le rapport (Partie 2)

- [ ] Terminal : serveur démarré avec les logs
- [ ] Navigateur : http://localhost:3000 (message de bienvenue)
- [ ] Navigateur : http://localhost:3000/api-docs (Swagger UI)
- [ ] Test POST → création d'un article (201)
- [ ] Test GET /api/articles → liste des articles (200)
- [ ] Test GET /api/articles/1 → un article spécifique
- [ ] Test PUT → modification (200)
- [ ] Test DELETE → suppression (200)
- [ ] Test GET search → recherche
- [ ] Test avec ID inexistant → 404
- [ ] Test avec données invalides → 400

---

## ➡️ Étape suivante

Une fois l'API fonctionnelle, passe au fichier **`04_ANALYSE_CRITIQUE.md`** pour rédiger ton analyse de CleeRoute.
