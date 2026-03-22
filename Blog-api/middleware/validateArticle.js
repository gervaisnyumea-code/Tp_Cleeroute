/**
 * =============================================================================
 * middleware/validateArticle.js — Validation des entrées POST/PUT articles
 * =============================================================================
 * Middleware Express : (req, res, next) => ...
 * - Si des erreurs sont détectées : réponse 400 JSON et on s'arrête (pas de next()).
 * - Si tout est valide : next() déclenche le contrôleur suivant dans la chaîne.
 * Utilisé uniquement sur les routes qui modifient des données (POST, PUT).
 * =============================================================================
 */

function validateArticle(req, res, next) {
  const { titre, contenu, auteur } = req.body;
  const errors = [];

  // --- Titre : obligatoire, chaîne non vide, longueur bornée (cohérent avec une colonne TEXT / UI). ---
  if (!titre || typeof titre !== 'string' || titre.trim().length === 0) {
    errors.push('Le titre est obligatoire et ne peut pas etre vide');
  } else if (titre.trim().length < 3) {
    errors.push('Le titre doit contenir au moins 3 caractères ');
  } else if (titre.trim().length > 255) {
    errors.push('Le titre ne peut pas dépasser 255 caractères');
  }

  // --- Contenu : obligatoire, longueur minimale pour éviter les articles vides. ---
  if (!contenu || typeof contenu !== 'string' || contenu.trim().length === 0) {
    errors.push('Le contenu est obligatoire et ne peut pas etre vide');
  } else if (contenu.trim().length < 10) {
    errors.push('Le contenu doit contenir au moins 10 caracteres');
  }

  // --- Auteur : obligatoire, nom raisonnablement court. ---
  if (!auteur || typeof auteur !== 'string' || auteur.trim().length === 0) {
    errors.push('L\'auteur est obligatoire et ne peut pas etre vide');
  } else if (auteur.trim().length < 2) {
    errors.push('Le nom de l\' auteur doit contenir au moins 2 caractères');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Données de l\' article invalides',
      errors: errors
    });
  }

  // Chaîne de middlewares : passage au contrôleur articleController.* .
  next();
}

module.exports = validateArticle;
