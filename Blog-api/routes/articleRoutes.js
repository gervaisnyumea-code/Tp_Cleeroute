/**
 * =============================================================================
 * routes/articleRoutes.js — Router Express pour /api/articles
 * =============================================================================
 * Ce fichier ne contient pas la logique métier : il associe méthode HTTP + chemin
 * à des fonctions du contrôleur et au middleware de validation.
 * Les blocs @swagger sont lus par swagger-jsdoc pour générer la documentation OpenAPI.
 * =============================================================================
 */

const express = require('express');
// Router isolé : monté dans server.js avec app.use('/api/articles', articleRoutes)
const router = express.Router();
const articleController = require('../controllers/articleController');
const validateArticle = require('../middleware/validateArticle');

// ─── IMPORTANT : la route /search DOIT être déclarée AVANT /:id ───
// Sinon Express capture le mot "search" comme valeur du paramètre :id (bug classique).

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
// validateArticle s'exécute avant creerArticle : si 400, le contrôleur n'est pas appelé.
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
