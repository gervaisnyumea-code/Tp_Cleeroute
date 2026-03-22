/**
 * =============================================================================
 * server.js — Point d'entrée de l'API Blog (Express)
 * =============================================================================
 * Rôle :
 *   - Charger la configuration (.env) pour le port et les URLs en production.
 *   - Créer l'application Express, brancher middlewares, routes et Swagger.
 *   - Démarrer le serveur HTTP en écoutant sur le bon port et la bonne interface.
 *
 * Déploiement Render :
 *   - Render définit process.env.PORT (obligatoire : ne pas coder un port fixe).
 *   - L'écoute sur '0.0.0.0' permet d'accepter les connexions depuis l'extérieur
 *     du conteneur (requis sur la plupart des PaaS / Docker).
 * =============================================================================
 */

// Charge les variables depuis un fichier .env à la racine de Blog-api (développement local).
// Sur Render, les variables sont injectées par le tableau de bord ; dotenv ne trouve pas
// de fichier : ce n'est pas grave, process.env contient déjà PORT, etc.
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Routes REST des articles : préfixe /api/articles (voir routes/articleRoutes.js).
const articleRoutes = require('./routes/articleRoutes');

// UI interactive de documentation OpenAPI (Swagger UI) + spec générée depuis les JSDoc des routes.
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

// Effet de bord au chargement : connexion SQLite + CREATE TABLE IF NOT EXISTS.
require('./database/db');

const app = express();

// Port : Render injecte PORT ; en local on utilise 4000 si .env ne définit rien.
const PORT = process.env.PORT || 4000;

// Hôte d'écoute : 0.0.0.0 = toutes les interfaces réseau (nécessaire sur Render/Docker).
// 'localhost' ou 127.0.0.1 seul refuserait les connexions externes au conteneur.
const HOST = process.env.HOST || '0.0.0.0';

// ---------------------------------------------------------------------------
// Middlewares globaux (s'appliquent à toutes les routes définies après)
// ---------------------------------------------------------------------------

// Parse le corps des requêtes Content-Type: application/json → req.body objet JavaScript.
app.use(express.json());

// CORS : autorise le navigateur à appeler cette API depuis un autre domaine (ex. frontend Vercel).
app.use(cors());

// Journalisation minimaliste : méthode HTTP + chemin + heure (utile en dev et sur Render Logs).
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString('fr-FR');
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // Passe au middleware ou à la route suivante.
});

// ---------------------------------------------------------------------------
// Documentation Swagger — interface web sous /api-docs
// ---------------------------------------------------------------------------

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'API Blog INF222',
  // Masque la barre verte Swagger par défaut pour un rendu plus sobre.
  customCss: '.swagger-ui .topbar { display: none }'
}));

// ---------------------------------------------------------------------------
// Routes métier : toutes les URLs /api/articles/* sont déléguées au router Express.
// ---------------------------------------------------------------------------

app.use('/api/articles', articleRoutes);

// Route racine GET / — santé du service + rappel des endpoints (pratique pour un devoir / démo).
app.get('/', (req, res) => {
  res.json({
    message: ' API Blog INF222 — Serveur opérationnel !',
    version: '1.0.0',
    endpoints: {
      documentation: 'GET /api-docs',
      articles: 'GET /api/articles',
      creer: 'POST /api/articles',
      lire: 'GET /api/articles/:id',
      modifier: 'PUT /api/articles/:id',
      supprimer: 'DELETE /api/articles/:id',
      recherche: 'GET /api/articles/search?query=texte'
    }
  });
});

// ---------------------------------------------------------------------------
// Filet de sécurité : aucune route ne correspond → 404 JSON (pas de page HTML par défaut).
// ---------------------------------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `La route ${req.method} ${req.url} n'existe pas`
  });
});

// ---------------------------------------------------------------------------
// Démarrage du serveur HTTP
// ---------------------------------------------------------------------------

app.listen(PORT, HOST, () => {
  // HOST peut être 0.0.0.0 (Render/Docker) : valide pour l'écoute, mais les navigateurs
  // n'ouvrent pas http://0.0.0.0 (ERR_ADDRESS_INVALID). En local, utiliser localhost.
  const localUrl = `http://localhost:${PORT}`;
  console.log('\n═══════════════════════════════════════');
  console.log(` Écoute sur ${HOST}:${PORT} (toutes interfaces — requis sur Render)`);
  console.log(` Swagger UI   : ${localUrl}/api-docs`);
  console.log(` API Articles : ${localUrl}/api/articles`);
  console.log('═══════════════════════════════════════\n');
});

// Export pour d'éventuels tests d'intégration (supertest) sans lancer le listen deux fois.
module.exports = app;
