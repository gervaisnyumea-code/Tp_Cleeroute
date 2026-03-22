# 🗺️ GUIDE GÉNÉRAL — TAF 1 INF222 EC1

## Développement Backend : API Blog avec CleeRoute

> **Objectif** : Ce guide est ton fil directeur. Il te dit QUOI faire, DANS QUEL ORDRE, et POURQUOI à chaque étape.

---

## 📌 Vue d'ensemble du TP

Le TP est divisé en **3 grandes parties** :

| Partie       | Contenu                                | Fichier de référence      |
| ------------ | -------------------------------------- | ------------------------- |
| **Partie 1** | Utilisation de CleeRoute (8 étapes)    | Ce guide + captures écran |
| **Partie 2** | Développement de l'API Blog en Node.js | `03_API_BLOG_CODE.md`     |
| **Partie 3** | Analyse critique de CleeRoute          | `04_ANALYSE_CRITIQUE.md`  |

---

## 🧭 Ton chemin pas à pas

```
ÉTAPE 0 ──► Lire ce guide de bout en bout (15 min)
    │
    ▼
ÉTAPE 1 ──► Aller sur CleeRoute, créer ton compte
    │         → Capturer chaque sous-étape
    │
    ▼
ÉTAPE 2 ──► Lire les QUESTIONS STRATÉGIQUES (fichier 01)
    │         → Copier chaque question dans CleeRoute CHAT
    │         → Comparer les réponses de CleeRoute avec mes réponses
    │         → Prendre des notes (fichier 02)
    │
    ▼
ÉTAPE 3 ──► Installer l'environnement de développement
    │         → Suivre le fichier 02_SETUP.md
    │
    ▼
ÉTAPE 4 ──► Coder l'API Blog
    │         → Suivre le fichier 03_API_BLOG_CODE.md
    │         → Comprendre chaque ligne AVANT de copier
    │
    ▼
ÉTAPE 5 ──► Rédiger le rapport (fichier 05_RAPPORT_TEMPLATE.md)
    │
    ▼
ÉTAPE 6 ──► Déposer sur Google Drive avant le 23/03/2026 à 23h59
```

---

## 📁 Structure de tes fichiers de travail

```
TAF1_INF222/
├── 📄 00_GUIDE_GENERAL.md        ← Tu es ici
├── 📄 01_QUESTIONS_CLEEROUTE.md  ← Questions stratégiques + mes réponses
├── 📄 02_SETUP_ENVIRONNEMENT.md  ← Installation des outils
├── 📄 03_API_BLOG_CODE.md        ← Code complet expliqué
├── 📄 04_ANALYSE_CRITIQUE.md     ← Analyse de CleeRoute
├── 📄 05_RAPPORT_TEMPLATE.md     ← Modèle du rapport final
└── 📁 blog-api/                  ← Ton projet Node.js
    ├── server.js
    ├── package.json
    ├── README.md
    ├── database/
    │   └── db.js
    ├── models/
    │   └── articleModel.js
    ├── controllers/
    │   └── articleController.js
    └── routes/
        └── articleRoutes.js
```

---

## 🎯 Ce que tu vas apprendre

À la fin de ce TP, tu seras capable de :

1. ✅ Créer une **API REST** complète avec Node.js et Express
2. ✅ Manipuler une **base de données SQLite** depuis Node.js
3. ✅ Comprendre et appliquer les **méthodes HTTP** (GET, POST, PUT, DELETE)
4. ✅ Utiliser les **codes de statut HTTP** correctement
5. ✅ **Documenter** une API avec Swagger
6. ✅ Structurer un projet backend en **routes / controllers / models**
7. ✅ Utiliser **CleeRoute** comme outil d'apprentissage personnalisé

---

## ⏱️ Estimation du temps

| Tâche                            | Durée estimée |
| -------------------------------- | ------------- |
| CleeRoute (8 étapes)             | 1h30          |
| Réponses Questions + Comparaison | 1h            |
| Installation environnement       | 30 min        |
| Développement API                | 3h à 4h       |
| Rédaction rapport                | 2h            |
| **TOTAL**                        | **~8h à 10h** |

---

## ⚠️ Règles d'or

> 🧠 **Comprends avant de copier** — Chaque bloc de code a une explication. Lis-la.

> 📸 **Capture d'écran systématique** — Pour chaque étape sur CleeRoute et chaque fonctionnalité qui marche.

> 🔄 **Compare toujours** — Tes réponses vs les miennes vs CleeRoute. C'est là que la vraie compréhension se construit.

> 📝 **Note tout** — Chaque difficulté, chaque découverte. Ça alimente la Partie 3 (Analyse critique).

---

## 🚀 Prochaine étape

➡️ **Va sur [https://www.cleeroute.com/fr](https://www.cleeroute.com/fr)** et commence l'Étape 1 : création du compte.

Ensuite, reviens lire le fichier **`01_QUESTIONS_CLEEROUTE.md`** pour les questions stratégiques. 
