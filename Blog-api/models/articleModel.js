// models/articleModel.js

const db = require('../database/db');


const articleModel = {

    // ---------------------------------------------------------------
    // Creer un article
    // ---------------------------------------------------------------
    creer(articleData) {

        const { titre, contenu, auteur, date, categorie, tags } = articleData;

        const stmt = db.prepare(`
            INSERT INTO articles (titre, contenu, auteur, date, categorie, tags)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        // Les '?' sont des placeholders pour les valeurs qui seront insérées de manière sécurisée, évitant les injections SQL.

        const resultat = stmt.run(
            titre.trim(),
            contenu.trim(),
            auteur.trim(),
            date || new Date().toISOString().split('T')[0], // Utilise la date actuelle si aucune n'est fournie
            categorie ? categorie.trim() : '',
            tags ? tags.trim() : ''
        );

        //Retourne l'article créé avec son ID généré automatiquement

        return this.trouverParId(resultat.lastInsertRowid);

    },

    // ---------------------------------------------------------------
    // Lire tous les articles (avec filtres optionnels)
    // ---------------------------------------------------------------

    trouverTous(filtres = {}) {

        let query = 'SELECT * FROM articles WHERE 1=1';
        const conditions = [];
        const params = [];

        //Filtre par categorie
        if (filtres.categorie) {
            query += ' AND categorie = ?'; // Ajoute une condition pour filtrer par catégorie
            conditions.push('categorie'); // Ajoute le nom du filtre aux conditions pour référence
            params.push(filtres.categorie.trim()); // Ajoute la valeur du filtre aux paramètres pour l'exécution de la requête
        }

        //Filtre par auteur
        if (filtres.auteur) {
            query += ' AND auteur = ?'; // Ajoute une condition pour filtrer par auteur
            conditions.push('auteur'); // Ajoute le nom du filtre aux conditions pour référence
            params.push(filtres.auteur.trim()); // Ajoute la valeur du filtre aux paramètres pour l'exécution de la requête
        }

        //Filtre par date (articles publiés à partir d'une certaine date)
        if (filtres.date) {
            query += ' AND date >= ?'; // Ajoute une condition pour filtrer par date
            conditions.push('date'); // Ajoute le nom du filtre aux conditions pour référence
            params.push(filtres.date.trim()); // Ajoute la valeur du filtre aux paramètres pour l'exécution de la requête
        }

        query += ' ORDER BY date DESC'; // Trie les articles par date de publication, du plus récent au plus ancien

        return db.prepare(query).all(...params); // Exécute la requête avec les paramètres et retourne tous les articles correspondants
    },

    // ---------------------------------------------------------------
    // Lire un article par ID
    // ---------------------------------------------------------------
    trouverParId(id) {
        const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
        return stmt.get(id); // Retourne l'article correspondant à l'ID ou undefined si non trouvé
    },

    // ---------------------------------------------------------------
    // Mettre à jour un article
    // ---------------------------------------------------------------
    mettreAJour(id, modifications) {
        const { titre, contenu, auteur, date, categorie, tags } = modifications;

        const stmt = db.prepare(`
            UPDATE articles
            SET titre = ?, contenu = ?, auteur = ?, date = ?, categorie = ?, tags = ?
            WHERE id = ?
        `);

        const resultat = stmt.run(
            titre.trim(),  // Utilise trim() pour enlever les espaces superflus
            contenu.trim(),
            auteur.trim(),
            date || new Date().toISOString().split('T')[0],
            categorie ? categorie.trim() : '', // Si la catégorie est fournie, on la nettoie, sinon on met une chaîne vide
            tags ? tags.trim() : '', // Si les tags sont fournis, on les nettoie, sinon on met une chaîne vide
            id
        );

        //Changes = nombres de lignes affectées par la mise à jour
        if (resultat.changes === 0) {
            return null; // Aucun article mis à jour (ID non trouvé)
        }

        return this.trouverParId(id); // Retourne l'article mis à jour
    },

    // Alias pour compatibilité avec des appels existants
    modifier(id, modifications) {
        return this.mettreAJour(id, modifications);
    },

    // ---------------------------------------------------------------
    // Supprimer un article
    // ---------------------------------------------------------------

    supprimer(id) {

        //Verifie si l'article existe avant de tenter de le supprimer
        const article = this.trouverParId(id);
        if (!article) {
            return null; // Aucun article trouvé avec cet ID
        }

        const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
        stmt.run(id); // Supprime l'article de la base de données

        return article; // Retourne l'article supprimé pour confirmation
    },

    // ---------------------------------------------------------------
    // Rechercher des articles par mot-clé dans le titre ou le contenu
    // ---------------------------------------------------------------
    rechercher(query) {
        const stmt = db.prepare(`
            SELECT * FROM articles
            WHERE titre LIKE ? OR contenu LIKE ?
            ORDER BY date DESC
        `);

        const terme = `%${query.trim()}%`; // Utilise des wildcards pour la recherche partielle
        return stmt.all(terme, terme); // Retourne tous les articles correspondants à la requête de recherche
    }
};

module.exports = articleModel;