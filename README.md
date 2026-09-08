# Diagnostic facturation électronique

Outil qui aide les auto-entrepreneurs à savoir en 3 questions s'ils sont concernés
par la réforme de la facturation électronique 2026, leurs obligations et les risques.

## Structure

- `index.html` — squelette HTML + formulaire caché pour la détection Netlify Forms
- `src/main.js` — orchestration (état de l'app, navigation entre questions)
- `src/questions.js` — données des questions + logique métier (calcul du verdict)
- `src/render.js` — fonctions de rendu DOM, séparées de la logique
- `src/style.css` — styles

## Développement local

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```

Le résultat est dans `dist/`, à déployer tel quel sur Netlify (glisser-déposer
le dossier `dist` sur app.netlify.com) pour que le formulaire email fonctionne.

## Ouvrir sur StackBlitz

Trois façons de faire, de la plus simple à la plus durable :

1. **Zip → StackBlitz** : va sur https://stackblitz.com/edit/vite (template Vite vanilla),
   supprime les fichiers par défaut, et recrée les fichiers de ce projet en copiant-collant
   leur contenu un par un (5 fichiers, ça va vite).
2. **Via GitHub** : crée un repo GitHub, pousse ce dossier dedans, puis ouvre
   `https://stackblitz.com/github/TON-USER/TON-REPO` — StackBlitz importe tout
   automatiquement et reste synchronisé avec le repo.
3. **CLI StackBlitz** (si tu as Node en local) : `npx @stackblitz/sdk` ou simplement
   glisse le dossier dans l'interface StackBlitz si l'option d'import local est proposée.

La méthode GitHub (option 2) est recommandée si tu comptes continuer à faire évoluer
le projet : ça te donne aussi un historique de versions gratuit.
