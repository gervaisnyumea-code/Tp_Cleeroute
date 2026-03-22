# Verification API Blog - INF222

Date: 2026-03-22

## Contexte

Verification fonctionnelle de l'API `Blog-api` apres correction des erreurs de wiring route/controller/model.

## Resultats des tests HTTP

| Endpoint                                | Methode | Resultat attendu               | Resultat obtenu |
| --------------------------------------- | ------- | ------------------------------ | --------------- |
| `/api/articles`                         | GET     | Retourne la liste des articles | `HTTP 200`      |
| `/api/articles`                         | POST    | Cree un article                | `HTTP 201`      |
| `/api/articles/:id`                     | GET     | Retourne l'article cree        | `HTTP 200`      |
| `/api/articles/:id`                     | PUT     | Met a jour l'article           | `HTTP 200`      |
| `/api/articles/search?query=modifie`    | GET     | Retourne au moins 1 resultat   | `HTTP 200`      |
| `/api/articles/:id`                     | DELETE  | Supprime l'article             | `HTTP 200`      |
| `/api/articles/:id` (apres suppression) | GET     | Article non trouve             | `HTTP 404`      |

## Conclusion

- Le serveur demarre correctement.
- Les routes CRUD et la recherche fonctionnent.
- Le comportement d'erreur apres suppression est correct (404).
