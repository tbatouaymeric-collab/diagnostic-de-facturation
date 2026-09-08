# Diagnostic facturation électronique — v2

Outil qui aide les indépendants à savoir s'ils sont concernés par la réforme
de la facturation électronique, avec des cas particuliers (international,
clientèle mixte, changement de régime TVA), des exemples concrets, et une
page sources avec date de dernière vérification.

## Structure

- `index.html` — squelette HTML + formulaire caché pour la détection Netlify Forms
- `src/main.js` — routage entre les vues (accueil, quiz, résultat, exemples, sources) et état de l'app
- `src/questions.js` — questions + logique métier (calcul du verdict, sélection multiple des types de clients)
- `src/examples.js` — six profils avec des cas concrets (international, mixte, changement de régime...)
- `src/sources.js` — liste des sources officielles + date de dernière vérification du contenu
- `src/render.js` — fonctions de rendu DOM, séparées de la logique
- `src/style.css` — direction visuelle premium (fond sombre, accent laiton)

## Garder le contenu à jour

Deux choses à revoir régulièrement :

1. **`src/sources.js`** — mets à jour `lastVerified` à chaque fois que tu
   revérifies les règles contre les sources officielles. Cette date s'affiche
   sur le site (page Sources et bas de page du résultat).
2. **`src/questions.js`** — si une règle ou une date change (ex: report de
   l'échéance 2027), c'est le seul fichier à modifier pour la logique.

## Développement local

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```

Le résultat est dans `dist/`, à déployer sur Netlify (glisser-déposer le
dossier `dist`) pour que le formulaire email fonctionne.
