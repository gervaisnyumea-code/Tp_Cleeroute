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
        url: 'http://localhost:4000',
        description: 'Serveur de développement local'
      }
    ],
  },
  apis: ['./routes/*.js'], // Cherche les commentaires Swagger dans les routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };