/**
 * =============================================================================
 * swagger/swagger.js — Configuration Swagger (OpenAPI 3) + UI
 * =============================================================================
 * - swagger-jsdoc lit les blocs @swagger dans routes/*.js pour construire la spec.
 * - swagger-ui-express sert une page HTML interactive sur /api-docs (voir server.js).
 *
 * Déploiement Render :
 *   - Render fournit RENDER_EXTERNAL_URL (ex. https://blog-api-xxxx.onrender.com).
 *   - On l’ajoute comme serveur dans la spec pour que « Try it out » pointe vers la prod.
 *   - En local, seul http://localhost:4000 reste proposé si aucune URL publique n’est définie.
 * =============================================================================
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Construit la liste des serveurs affichés dans Swagger UI (sélecteur en haut).
 * Priorité : PUBLIC_URL (manuel) > RENDER_EXTERNAL_URL (auto Render) > localhost.
 */
function buildServers() {
  const servers = [];

  // URL explicite utile si tu déploies ailleurs que Render ou pour forcer https.
  const publicUrl = process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL;

  if (publicUrl) {
    // Supprime un slash final pour éviter //api/... dans les requêtes générées.
    const base = publicUrl.replace(/\/$/, '');
    servers.push({
      url: base,
      description: 'Production (Render ou URL publique configurée)'
    });
  }

  // Toujours proposer le serveur local pour le développement.
  const localPort = process.env.PORT || 4000;
  servers.push({
    url: `http://localhost:${localPort}`,
    description: 'Serveur de développement local'
  });

  return servers;
}

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
    // Serveurs dynamiques : prod si variables Render / PUBLIC_URL, sinon local uniquement.
    servers: buildServers(),
  },
  // Fichiers parsés pour extraire les annotations @swagger (chemins relatifs au cwd = Blog-api/).
  apis: ['./routes/*.js'],
};

// Génère l’objet OpenAPI complet une fois au chargement du module.
const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
