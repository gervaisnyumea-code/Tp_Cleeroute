/**
 * =============================================================================
 * controllers/articleController.js — Couche HTTP : statuts, JSON, erreurs
 * =============================================================================
 * Principe MVC léger :
 *   - Le contrôleur reçoit req/res, valide les paramètres (id numérique, etc.),
 *     appelle le modèle (articleModel) et renvoie toujours du JSON cohérent.
 *   - Aucune requête SQL ici : tout passe par articleModel.
 * =============================================================================
 */

const articleModel = require('../models/articleModel');

const articleController = {

  /**
   * POST /api/articles — Création d'un article.
   * Corps attendu : titre, contenu, auteur (+ optionnels) déjà validés par validateArticle.
   */
  creerArticle(req, res) {
    try {
      // req.body est rempli par express.json() dans server.js.
      const nouvelArticle = articleModel.creer(req.body);

      // 201 Created : ressource nouvelle avec succès.
      return res.status(201).json({
        success: true,
        message: 'Article créé avec succès ',
        data: nouvelArticle
      });
    } catch (erreur) {
      // Erreur inattendue (ex. contrainte DB) — ne pas exposer la stack au client.
      console.error('Erreur lors de la creation :', erreur);
      return res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  },

  /**
   * GET /api/articles — Liste avec filtres optionnels en query string.
   * Exemple : /api/articles?categorie=Tech&auteur=Alice&date=2026-01-01
   */
  obtenirArticles(req, res) {
    try {
      // req.query : objet { categorie, auteur, date } selon ce qui est présent dans l'URL.
      const { categorie, auteur, date } = req.query;
      const filtres = {};

      if (categorie) filtres.categorie = categorie;
      if (auteur) filtres.auteur = auteur;
      if (date) filtres.date = date;

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

  /**
   * GET /api/articles/:id — Détail d'un article par identifiant entier.
   */
  obtenirArticleParId(req, res) {
    try {
      // req.params.id est toujours une chaîne : on convertit pour SQLite et on rejette NaN.
      const id = parseInt(req.params.id, 10);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'L\' ID doit être un nombre entier '
        });
      }

      const article = articleModel.trouverParId(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: `Article avec l'ID ${id} non trouvé `
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

  /**
   * PUT /api/articles/:id — Mise à jour complète des champs (même schéma que POST).
   */
  modifierArticle(req, res) {
    try {
      const id = parseInt(req.params.id, 10);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'L\' ID doit être un nombre entier '
        });
      }

      const articleModifie = articleModel.mettreAJour(id, req.body);

      if (!articleModifie) {
        return res.status(404).json({
          success: false,
          message: `Article avec l'ID ${id} non trouvé `
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Article modifié avec succès ',
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

  /**
   * DELETE /api/articles/:id — Suppression ; renvoie une copie de l'article supprimé.
   */
  supprimerArticle(req, res) {
    try {
      const id = parseInt(req.params.id, 10);

      if (Number.isNaN(id)) {
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

  /**
   * GET /api/articles/search?query=mot — Recherche LIKE sur titre et contenu.
   */
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
        message: 'Erreur interne du serveur '
      });
    }
  }
};

module.exports = articleController;
