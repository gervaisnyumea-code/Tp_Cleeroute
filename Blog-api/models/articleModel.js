/**
 * =============================================================================
 * models/articleModel.js — Accès données SQLite (requêtes préparées)
 * =============================================================================
 * Toutes les requêtes utilisent des placeholders (?) pour limiter les injections SQL.
 * better-sqlite3 est synchrone : pas de async/await, ce qui simplifie le contrôleur.
 * =============================================================================
 */

const db = require('../database/db');

const articleModel = {

  /**
   * Insère une ligne dans `articles` et retourne l'enregistrement complet via trouverParId.
   * @param {object} articleData - titre, contenu, auteur requis ; date, categorie, tags optionnels.
   */
  creer(articleData) {
    const { titre, contenu, auteur, date, categorie, tags } = articleData;

    const stmt = db.prepare(`
            INSERT INTO articles (titre, contenu, auteur, date, categorie, tags)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

    // Les ? sont liés dans l'ordre : évite la concaténation de chaînes SQL (sécurité).
    const resultat = stmt.run(
      titre.trim(),
      contenu.trim(),
      auteur.trim(),
      date || new Date().toISOString().split('T')[0],
      categorie ? categorie.trim() : '',
      tags ? tags.trim() : ''
    );

    // lastInsertRowid : id auto-généré par SQLite après l'INSERT.
    return this.trouverParId(resultat.lastInsertRowid);
  },

  /**
   * Liste tous les articles, avec filtres optionnels sur categorie, auteur, date (>=).
   * Construction dynamique du WHERE : on part de WHERE 1=1 pour concaténer avec AND ... = ?
   */
  trouverTous(filtres = {}) {
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (filtres.categorie) {
      query += ' AND categorie = ?';
      params.push(filtres.categorie.trim());
    }

    if (filtres.auteur) {
      query += ' AND auteur = ?';
      params.push(filtres.auteur.trim());
    }

    if (filtres.date) {
      // Comparaison lexicographique sur TEXT au format YYYY-MM-DD (adapté aux dates ISO courtes).
      query += ' AND date >= ?';
      params.push(filtres.date.trim());
    }

    query += ' ORDER BY date DESC';

    return db.prepare(query).all(...params);
  },

  /**
   * Retourne une ligne ou undefined si l'id n'existe pas.
   */
  trouverParId(id) {
    const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
    return stmt.get(id);
  },

  /**
   * UPDATE sur toutes les colonnes modifiables ; si aucune ligne touchée, retourne null.
   */
  mettreAJour(id, modifications) {
    const { titre, contenu, auteur, date, categorie, tags } = modifications;

    const stmt = db.prepare(`
            UPDATE articles
            SET titre = ?, contenu = ?, auteur = ?, date = ?, categorie = ?, tags = ?
            WHERE id = ?
        `);

    const resultat = stmt.run(
      titre.trim(),
      contenu.trim(),
      auteur.trim(),
      date || new Date().toISOString().split('T')[0],
      categorie ? categorie.trim() : '',
      tags ? tags.trim() : '',
      id
    );

    // changes : nombre de lignes affectées (0 si id inconnu).
    if (resultat.changes === 0) {
      return null;
    }

    return this.trouverParId(id);
  },

  /** Alias historique — même comportement que mettreAJour. */
  modifier(id, modifications) {
    return this.mettreAJour(id, modifications);
  },

  /**
   * Supprime par id après avoir lu l'article pour le renvoyer au client (confirmation).
   */
  supprimer(id) {
    const article = this.trouverParId(id);
    if (!article) {
      return null;
    }

    const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
    stmt.run(id);

    return article;
  },

  /**
   * Recherche insensible à la casse dépend du collation SQLite par défaut ;
   * LIKE %terme% sur titre et contenu.
   */
  rechercher(query) {
    const stmt = db.prepare(`
            SELECT * FROM articles
            WHERE titre LIKE ? OR contenu LIKE ?
            ORDER BY date DESC
        `);

    const terme = `%${query.trim()}%`;
    return stmt.all(terme, terme);
  }
};

module.exports = articleModel;
