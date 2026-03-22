# 📄 TEMPLATE DU RAPPORT FINAL — TAF1 INF222 EC1

## À convertir en PDF avant soumission

> **Utilise ce template comme base pour rédiger ton rapport.**
> Remplace tout ce qui est entre [crochets] par tes vraies informations.
> Ce fichier doit être exporté en PDF sous le nom : `INF222_Ec1_Taf1_Rapport_[Nom]_[Prenom]_[Matricule].pdf`

---

# ╔══════════════════════════════════════╗

# ║         PAGE DE GARDE               ║

# ╚══════════════════════════════════════╝

**Université :** [Nom de l'université]

**Département :** Génie Informatique

**UE :** INF222 — Développement Backend (EC1)

**Travail à Faire (TAF 1)** : Apprentissage structuré avec CleeRoute et développement d'une API Blog

---

**Présenté par :**

| Champ     | Valeur                             |
| --------- | ---------------------------------- |
| Nom       | [TON NOM]                          |
| Prénom    | [TON PRÉNOM]                       |
| Matricule | [TON MATRICULE]                    |
| Filière   | Génie Informatique / Data Sciences |
| Niveau    | [Ton niveau]                       |

---

**Proposé par :** Charles Njiosseu, PhD Student

**Date de soumission :** 23 Mars 2026

---

# ╔══════════════════════════════════════╗

# ║         INTRODUCTION                ║

# ╚══════════════════════════════════════╝

## Introduction

Ce rapport présente le travail réalisé dans le cadre du TAF 1 de l'unité d'enseignement INF222 — Développement Backend. Ce travail poursuit trois objectifs principaux :

**Premier objectif** : Structurer l'apprentissage du développement web en utilisant la plateforme CleeRoute, un outil d'apprentissage personnalisé et adaptatif.

**Deuxième objectif** : Développer un esprit critique en comparant les contenus proposés par CleeRoute avec d'autres sources de connaissance, afin de valider, compléter ou nuancer les informations reçues.

**Troisième objectif** : Produire un premier contenu technique concret — une API REST backend pour la gestion d'un blog — en appliquant les bonnes pratiques du développement web moderne.

Ce rapport est organisé en trois parties : l'utilisation de la plateforme CleeRoute (Partie 1), le développement de l'API Blog (Partie 2), et une analyse critique de la plateforme (Partie 3).

---

# ╔══════════════════════════════════════╗

# ║   PARTIE 1 : UTILISATION CLEEROUTE  ║

# ╚══════════════════════════════════════╝

## Partie 1 : Utilisation de la plateforme CleeRoute

### Étape 1 : Création du compte et validation de l'adresse email

[CAPTURE D'ÉCRAN ICI — formulaire d'inscription ou email de confirmation]

[Décris ce que tu as fait : "J'ai créé un compte en renseignant mon nom, email et mot de passe. J'ai ensuite reçu un email de confirmation..."]

**Notes :** [Ce que tu as observé, difficultés rencontrées, temps nécessaire]

**Critique :** [Ce qui pourrait être amélioré sur cette étape]

---

### Étape 2 : Définition du niveau et de l'objectif

[CAPTURE D'ÉCRAN ICI]

[Décris le niveau que tu as choisi et l'objectif défini]

**Notes :** [Comment la plateforme a-t-elle défini le niveau ? Par questionnaire ? Choix manuel ?]

**Critique :** [Les options proposées couvraient-elles bien les niveaux réels ?]

---

### Étape 3 : Paramétrage du but et du profil

[CAPTURE D'ÉCRAN ICI]

[Décris les paramètres saisis : objectif d'apprentissage, domaine d'intérêt, etc.]

**Notes :** ...

**Critique :** ...

---

### Étape 4 : Génération du parcours

[CAPTURE D'ÉCRAN ICI — le parcours généré avec les modules listés]

[Décris le parcours généré : combien de modules, quels thèmes, dans quel ordre ?]

**Notes :** ...

**Critique :** [Le parcours correspondait-il à tes besoins réels pour ce TP ?]

---

### Étape 5 : Suivi des modules

[CAPTURE D'ÉCRAN ICI — un ou plusieurs modules ouverts]

[Décris comment tu as navigué dans les modules, ce que tu y as trouvé]

**Notes :** ...

**Critique :** ...

---

### Étape 6 : Prise de notes

[CAPTURE D'ÉCRAN ICI — la fonctionnalité de prise de notes]

[Décris comment fonctionne la prise de notes dans CleeRoute, ce que tu as noté]

**Notes :** ...

**Critique :** ...

---

### Étape 7 : Ajout de sources et interaction avec le chat

[CAPTURE D'ÉCRAN ICI — le chat assistant avec une question posée]

[Décris les sources que tu as ajoutées et les questions posées au chat]

**Résumé des 10 questions posées dans le chat :**

| #   | Question posée              | Qualité de la réponse (1-5) | Commentaire |
| --- | --------------------------- | --------------------------- | ----------- |
| 1   | Qu'est-ce qu'une API REST ? | /5                          | ...         |
| 2   | Méthodes HTTP...            | /5                          | ...         |
| 3   | Node.js + Express...        | /5                          | ...         |
| 4   | SQLite...                   | /5                          | ...         |
| 5   | Validation des données...   | /5                          | ...         |
| 6   | Architecture MVC...         | /5                          | ...         |
| 7   | Codes HTTP...               | /5                          | ...         |
| 8   | Swagger...                  | /5                          | ...         |
| 9   | Middleware Express...       | /5                          | ...         |
| 10  | Tests Postman...            | /5                          | ...         |

**Critique :** [Le chat a-t-il bien répondu ? Les réponses étaient-elles précises ? Fiables ?]

---

### Étape 8 : Quiz d'évaluation

[CAPTURE D'ÉCRAN ICI — un quiz en cours ou les résultats]

[Décris le quiz : combien de questions, quels thèmes, ton score]

**Notes :** ...

**Critique :** ...

---

# ╔══════════════════════════════════════╗

# ║   PARTIE 2 : API BACKEND BLOG       ║

# ╚══════════════════════════════════════╝

## Partie 2 : Application Backend — API Blog

### 2.1 Technologies utilisées

| Technologie        | Version    | Rôle                    |
| ------------------ | ---------- | ----------------------- |
| Node.js            | v[version] | Runtime JavaScript      |
| Express.js         | v4.x       | Framework web           |
| better-sqlite3     | v9.x       | Base de données SQLite  |
| swagger-jsdoc      | v6.x       | Génération spec OpenAPI |
| swagger-ui-express | v5.x       | Interface Swagger       |

### 2.2 Architecture du projet

```
blog-api/
├── server.js              (Point d'entrée)
├── package.json           (Dépendances)
├── README.md              (Documentation)
├── database/db.js         (Connexion SQLite)
├── models/articleModel.js (Requêtes SQL)
├── controllers/articleController.js (Logique métier)
├── middleware/validateArticle.js (Validation)
├── routes/articleRoutes.js (Endpoints)
└── swagger/swagger.js     (Configuration Swagger)
```

### 2.3 Schéma de la base de données

**Table `articles` :**

| Colonne   | Type    | Contrainte                | Description              |
| --------- | ------- | ------------------------- | ------------------------ |
| id        | INTEGER | PRIMARY KEY AUTOINCREMENT | Identifiant unique       |
| titre     | TEXT    | NOT NULL                  | Titre de l'article       |
| contenu   | TEXT    | NOT NULL                  | Corps de l'article       |
| auteur    | TEXT    | NOT NULL                  | Nom de l'auteur          |
| date      | TEXT    | DEFAULT now()             | Date de publication      |
| categorie | TEXT    | DEFAULT ''                | Catégorie                |
| tags      | TEXT    | DEFAULT ''                | Tags séparés par virgule |

### 2.4 Endpoints développés

| Méthode | Endpoint             | Description          | Code réponse |
| ------- | -------------------- | -------------------- | ------------ |
| POST    | /api/articles        | Créer un article     | 201 / 400    |
| GET     | /api/articles        | Liste (avec filtres) | 200          |
| GET     | /api/articles/:id    | Un article par ID    | 200 / 404    |
| PUT     | /api/articles/:id    | Modifier un article  | 200 / 404    |
| DELETE  | /api/articles/:id    | Supprimer un article | 200 / 404    |
| GET     | /api/articles/search | Recherche full-text  | 200 / 400    |

### 2.5 Captures d'écran de l'API en fonctionnement

**Serveur démarré :**
[CAPTURE D'ÉCRAN — terminal avec les logs de démarrage]

**Interface Swagger UI :**
[CAPTURE D'ÉCRAN — http://localhost:3000/api-docs]

**POST /api/articles — Création :**
[CAPTURE D'ÉCRAN — test dans Postman ou Swagger ou REST Client]

**GET /api/articles — Liste :**
[CAPTURE D'ÉCRAN]

**GET /api/articles/1 — Un article :**
[CAPTURE D'ÉCRAN]

**PUT /api/articles/1 — Modification :**
[CAPTURE D'ÉCRAN]

**DELETE /api/articles/1 — Suppression :**
[CAPTURE D'ÉCRAN]

**GET /api/articles/search?query=Node — Recherche :**
[CAPTURE D'ÉCRAN]

**Cas d'erreur (404) :**
[CAPTURE D'ÉCRAN — requête avec ID inexistant]

**Cas d'erreur (400) :**
[CAPTURE D'ÉCRAN — requête avec données invalides]

### 2.6 Lien du dépôt GitHub

> 🔗 **Dépôt GitHub** : [URL DE TON DÉPÔT]

### 2.7 Difficultés rencontrées et solutions

[Décris les problèmes que tu as rencontrés pendant le développement et comment tu les as résolus]

Exemple de structure :

- **Problème** : [description du problème]
- **Cause** : [pourquoi ça s'est produit]
- **Solution** : [comment tu l'as résolu]
- **Ce que j'ai appris** : [leçon tirée]

---

# ╔══════════════════════════════════════╗

# ║   PARTIE 3 : ANALYSE CRITIQUE       ║

# ╚══════════════════════════════════════╝

## Partie 3 : Analyse critique de CleeRoute

### 3.1 Points forts

**[Point fort 1 — ex: Personnalisation du parcours]**

[Description argumentée avec exemple concret]

---

**[Point fort 2 — ex: Interface intuitive]**

[Description argumentée avec exemple concret]

---

**[Point fort 3 — ex: Chat assistant disponible]**

[Description argumentée avec exemple concret]

---

### 3.2 Points faibles

**[Point faible 1 — ex: Profondeur technique insuffisante]**

[Description argumentée avec exemple concret tiré de la comparaison des réponses]

---

**[Point faible 2 — ex: Absence d'exercices pratiques]**

[Description argumentée]

---

**[Point faible 3]**

[Description argumentée]

---

### 3.3 Améliorations possibles

| Point faible identifié | Amélioration suggérée | Justification          |
| ---------------------- | --------------------- | ---------------------- |
| [Point 1]              | [Amélioration 1]      | [Pourquoi ça aiderait] |
| [Point 2]              | [Amélioration 2]      | [Pourquoi ça aiderait] |
| [Point 3]              | [Amélioration 3]      | [Pourquoi ça aiderait] |

### 3.4 Utilité pour un étudiant en génie informatique

[Paragraphe d'environ 150-200 mots répondant à ces questions :]

- En quoi CleeRoute est-il utile pour un cours comme INF222 ?
- Quelles sont ses limites face à d'autres ressources ?
- Recommanderais-tu cet outil à tes collègues ? Pourquoi ?

**Note globale :** [X/10] — [Justification en 2-3 phrases]

---

# ╔══════════════════════════════════════╗

# ║         CONCLUSION                  ║

# ╚══════════════════════════════════════╝

## Conclusion

[Résume en 150-200 mots :]

Ce TAF 1 m'a permis de [ce que tu as appris]. À travers l'utilisation de CleeRoute, j'ai [ce que la plateforme t'a apporté]. Le développement de l'API Blog m'a permis de [compétences acquises].

Les points essentiels retenus sont :

- [Point clé 1 sur les API REST / Node.js]
- [Point clé 2 sur l'architecture MVC]
- [Point clé 3 sur CleeRoute comme outil d'apprentissage]

[Perspectives : qu'est-ce que tu aimerais approfondir ? Comment comptes-tu utiliser ces compétences ?]

---

*Rapport rédigé par [Prénom Nom] — INF222 EC1 — Mars 2026*

---

## ✅ Checklist finale avant soumission

- [ ] Page de garde complète (nom, prénom, matricule, filière, UE)
- [ ] Toutes les captures d'écran CleeRoute (8 étapes)
- [ ] Captures d'écran de chaque endpoint testé
- [ ] Lien GitHub dans le rapport
- [ ] README dans le dépôt GitHub
- [ ] Analyse critique avec points forts / faibles / améliorations
- [ ] Rapport exporté en PDF
- [ ] Nom du fichier : `INF222_Ec1_Taf1_Rapport_Nom_Prenom_Matricule.pdf`
- [ ] Déposé dans le Google Drive avant le **23/03/2026 à 23h59**
- [ ] Informations renseignées dans le sheet "Liste des étudiants"
