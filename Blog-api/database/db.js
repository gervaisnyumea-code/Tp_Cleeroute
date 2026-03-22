/**
 * =============================================================================
 * database/db.js — Connexion SQLite et schéma initial
 * =============================================================================
 * Rôle :
 *   - Ouvrir (ou créer) le fichier blog.db à la racine du projet Blog-api/.
 *   - Activer le mode WAL pour de meilleures perfs lecture/écriture concurrentes.
 *   - Créer la table `articles` si elle n'existe pas (idempotent).
 *
 * Déploiement Render (IMPORTANT) :
 *   - Le disque du conteneur est éphémère : blog.db peut être réinitialisé au redéploiement
 *     ou quand l'instance change. Pour des données persistantes en production il faudrait
 *     une base managée (ex. PostgreSQL sur Render) — hors scope de ce TP SQLite.
 * =============================================================================
 */

const Database = require('better-sqlite3');
const path = require('path');

// __dirname = dossier du présent fichier (database/). On remonte d'un niveau vers Blog-api/.
const dbPath = path.join(__dirname, '..', 'blog.db');

// Ouvre la base ; crée le fichier vide si absent, puis applique le schéma ci-dessous.
const db = new Database(dbPath);

// WAL : écritures dans un fichier -wal, lectures moins bloquées (adapté à un petit serveur API).
db.pragma('journal_mode = WAL');

// Schéma minimal d'un article de blog. INTEGER PRIMARY KEY AUTOINCREMENT génère les id.
// datetime('now','localtime') : valeur par défaut pour la colonne date si non fournie à l'INSERT.
db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        contenu TEXT NOT NULL,
        auteur TEXT NOT NULL,
        date TEXT DEFAULT (datetime('now','localtime')),
        categorie TEXT DEFAULT '',
        tags TEXT DEFAULT ''
    )
    `);

console.log('Base de données SQLite initialisée avec succès !');

// Singleton exporté : tous les modèles importent ce même objet `db`.
module.exports = db;
