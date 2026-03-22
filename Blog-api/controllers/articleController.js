//controllers/articleController.js

const articleModel = require('../models/articleModel');

const articleController = {

    //------------------------------------------------------------
    // Post /api/articles - Créer un article
    //------------------------------------------------------------

    creerArticle(req, res) {

        try {
            const nouvelArticle = articleModel.creer(req.body);

            return res.status(201).json({
                success: true,
                message: "Article créé avec succès ",
                data: nouvelArticle

            });

        } catch (erreur) {

            console.error('Erreur lors de la creation :', erreur);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'

            });

        }

    },

    //----------------------------------------------------------------
    // Get /api/articles - Lire tous les articles 
    //----------------------------------------------------------------

    obtenirArticles(req, res) {

        try {
            //rep.query contient les parametres de l'URL (?categorie=Tech&auteur=Alice)
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

    //--------------------------------------------------------
    //  Get /api/articles/:id - Lire un article
    //--------------------------------------------------------

    obtenirArticleParId(req, res) {
        try {
            //req.params.id = la valeur dans l'URL (/api/articles/5 -> id = "5")
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
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

    //----------------------------------------------------------
    // Put /api/articles/:id - Modifier un article 
    //----------------------------------------------------------

    modifierArticle(req, res) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
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

    //-----------------------------------------------------------
    // Delete /api/article/:id - Supprimer un article
    //-----------------------------------------------------------

    supprimerArticle(req, res) {

        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: `L'ID doit être un nombre entier`

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

    //------------------------------------------------------
    // Get /api/articles/search?query=texte - Rechercher
    //------------------------------------------------------

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