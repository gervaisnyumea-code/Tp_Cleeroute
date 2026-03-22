require('dotenv').config();

// Les ligness du haut pour le chargement des variables d'environnement et la définition du port d'écoute du serveur sur le port 4000.
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
const PORT = process.env.PORT || 4000;

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

// Interface Swagger accessible sur http://localhost:4000/api-docs
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
    message: ' API Blog INF222 — Serveur opérationnel !',
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
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
  console.log(` Swagger UI   : http://localhost:${PORT}/api-docs`);
  console.log(` API Articles : http://localhost:${PORT}/api/articles`);
  console.log('═══════════════════════════════════════\n');
});

module.exports = app;