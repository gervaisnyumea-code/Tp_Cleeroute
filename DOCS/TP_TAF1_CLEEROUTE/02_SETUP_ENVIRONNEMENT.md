# 🛠️ SETUP DE L'ENVIRONNEMENT DE DÉVELOPPEMENT

## INF222 EC1 — TAF1 : API Backend Blog

> **Objectif** : Avoir un environnement Node.js fonctionnel, prêt à coder l'API Blog.

---

## Étape 1 : Vérifier si Node.js est installé

Ouvre un terminal (cmd / PowerShell sur Windows, Terminal sur Mac/Linux) et tape :

```bash
node --version
npm --version
```

**Si tu vois quelque chose comme :**

```
v20.11.0
10.2.4
```

→ Node.js est installé, passe à l'Étape 3.

**Si tu vois une erreur** → suis l'Étape 2.

---

## Étape 2 : Installer Node.js

1. Va sur **https://nodejs.org**
2. Télécharge la version **LTS** (Long Term Support) — la version stable recommandée
3. Lance l'installateur, clique "Next" jusqu'à la fin
4. **Ferme et rouvre ton terminal**
5. Retape `node --version` → tu dois voir la version

---

## Étape 3 : Installer VS Code (éditeur de code)

1. Va sur **https://code.visualstudio.com**
2. Télécharge et installe
3. Extensions recommandées (cherche dans l'onglet Extensions de VS Code) :
   - **REST Client** (Huachao Mao) → pour tester ton API sans Postman
   - **Prettier** → formatage automatique du code
   - **ESLint** → détection d'erreurs

---

## Étape 4 : Créer le projet

```bash
# 1. Crée un dossier pour ton projet
mkdir blog-api
cd blog-api

# 2. Initialise le projet Node.js
# (réponds aux questions ou appuie sur Entrée pour les valeurs par défaut)
npm init -y

# 3. Installe les dépendances
npm install express better-sqlite3 cors swagger-jsdoc swagger-ui-express

# 4. Ouvre le projet dans VS Code
code .
```

### Explication des packages installés

| Package              | Rôle                                                |
| -------------------- | --------------------------------------------------- |
| `express`            | Framework web, crée le serveur HTTP                 |
| `better-sqlite3`     | Connexion à la base de données SQLite               |
| `cors`               | Middleware pour autoriser les requêtes cross-origin |
| `swagger-jsdoc`      | Génère la spec OpenAPI depuis les commentaires      |
| `swagger-ui-express` | Affiche l'interface Swagger dans le navigateur      |

---

## Étape 5 : Vérifier le package.json généré

Après l'installation, ton `package.json` doit ressembler à ça :

```json
{
  "name": "blog-api",
  "version": "1.0.0",
  "description": "API REST pour gérer un blog - INF222 TAF1",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "better-sqlite3": "^9.x.x",
    "cors": "^2.x.x",
    "express": "^4.x.x",
    "swagger-jsdoc": "^6.x.x",
    "swagger-ui-express": "^5.x.x"
  }
}
```

---

## Étape 6 : Créer la structure de dossiers

Dans ton terminal (depuis le dossier `blog-api`) :

```bash
mkdir database models controllers routes swagger
```

Tu dois avoir cette structure :

```
blog-api/
├── node_modules/      ← créé automatiquement par npm (ne pas toucher)
├── database/          ← dossier vide pour l'instant
├── models/            ← dossier vide pour l'instant
├── controllers/       ← dossier vide pour l'instant
├── routes/            ← dossier vide pour l'instant
├── swagger/           ← dossier vide pour l'instant
└── package.json       ← créé par npm init
```

---

## Étape 7 : Test rapide — "Hello World" Express

Crée un fichier `server.js` à la racine du projet avec ce contenu :

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'API Blog INF222 — Serveur en marche ! 🚀' });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
```

Lance le serveur :

```bash
node server.js
```

Ouvre ton navigateur et va sur **http://localhost:3000**

Tu dois voir :

```json
{
  "message": "API Blog INF222 — Serveur en marche ! 🚀"
}
```

**Si tu vois ça** → 🎉 Bravo ! Ton environnement est prêt.

Pour arrêter le serveur : **Ctrl + C** dans le terminal.

---

## 📸 Captures d'écran à faire pour le rapport

- [ ] Terminal montrant `node --version` et `npm --version`
- [ ] VS Code ouvert sur le projet
- [ ] Terminal montrant l'installation des packages (`npm install ...`)
- [ ] Terminal montrant le serveur démarré (`✅ Serveur démarré sur...`)
- [ ] Navigateur affichant le message "Hello World"

---

## ➡️ Étape suivante

Une fois l'environnement prêt, passe au fichier **`03_API_BLOG_CODE.md`** pour coder l'API complète.
