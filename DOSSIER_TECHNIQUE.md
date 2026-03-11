## Dossier technique – Mirokaï Exp (PWA visiteur + espace admin/config)

---

### 1. Contexte & objectifs

**Problématique**  
Proposer une expérience interactive pour les visiteurs dans un showroom Enchanted Tools, avec :

- Un plan de l’espace affichant les différents modules de démo.
- Une interface vivante et ludique (chatbot, choix d’avatar, mini-jeu possible).
- Un back-office pour l’équipe qui permet de configurer facilement les modules et leur position sur le plan, sans intervention technique.

**Objectifs fonctionnels**

- **Visiteur (PWA)** :
  - Accéder à une application web responsive, installable (PWA).
  - Visualiser un plan avec les modules positionnés.
  - Interagir avec un chatbot et un personnage personnalisé (avatar, map, vêtements).
- **Admin** :
  - Se connecter à un espace admin sécurisé.
  - Créer / éditer / supprimer des modules (n° / nom / description / média).
  - Drag & drop des modules sur un plan (positions X/Y persistées en base).
  - Faire évoluer l’espace sans toucher au code.

---

### 2. Architecture globale

#### 2.1 Vue d’ensemble

- **Type** : Monolithe Next.js (App Router) full-stack.
- **Front** : React 19, Next 16 (app directory), classes utilitaires type Tailwind.
- **Back** : Route handlers Next.js (`app/api/**`) – API REST JSON.
- **Base de données** : MongoDB + Mongoose.
- **Auth admin** :
  - JWT signé avec `ADMIN_JWT_SECRET`, stocké en cookie httpOnly `admin_token`.
  - Proxy Next pour protéger `/admin/**` et `/api/admin/**`.
- **Auth visiteur** :
  - Register + login avec `USER_JWT_SECRET`, cookie httpOnly `user_token`.
  - `UserProvider` côté client pour exposer `user` (id, username, email, avatar, map, clothes, bot…).
- **Internationalisation** : `next-international` (provider client + cookie `locale`).
- **PWA** : optimisée pour mobile, installable via Next (manifest / icons à compléter).

#### 2.2 Schéma (texte)

- **Client (navigateur / PWA)**  
  → Next.js (pages React : `/`, `/plan`, `/login`, `/profile`, `/admin/**`)  
  → `UserProvider`, `I18nAppProvider`, `ToastProvider`, `ChatBot`, `AvatarChoices`, `PlanView`.

- **API Next.js**
  - Auth admin : `/api/admin/login`, `/api/admin/session`
  - Auth visiteur : `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
  - Modules plan :
    - Public : `/api/plan-modules`
    - Admin : `/api/admin/plan-modules` (GET/POST/PATCH/DELETE/PUT)
  - Bot choice : `/api/bot-choice`
  - Newsletter : `/api/subscribe-newsletter`

- **MongoDB**
  - `AdminUser`
  - `User`
  - `PlanModule`
  - `Newsletter`

- **Proxy**  
  - `proxy.ts` protège `/admin/**` et `/api/admin/**` (vérifie le JWT admin).

---

### 3. Modèle de données

#### 3.1 `User`

```ts
type BotChoice = "Miroka" | "Miroki";
type AvatarChoice = "Avatar1" | "Avatar2" | "Avatar3" | ...;
type MapChoice = "Map1" | "Map2" | "Map3";
type ClothesChoice = "Clothes1" | "Clothes2" | ...;

type User = {
  _id: ObjectId;
  username: string;
  email: string;        // unique
  passwordHash: string;
  bot?: BotChoice | null;
  avatar?: AvatarChoice;
  map?: MapChoice;
  clothes?: ClothesChoice;
  createdAt: Date;
};
```

#### 3.2 `AdminUser`

```ts
type AdminUser = {
  _id: ObjectId;
  email: string;        // unique
  passwordHash: string;
  createdAt: Date;
};
```

#### 3.3 `PlanModule`

```ts
type PlanModule = {
  _id: ObjectId;
  key: string;         // unique, ex: "module-1"
  label: string;       // nom court
  description: string; // cartel / description
  x: number;           // coordonnée X (px dans le plan)
  y: number;           // coordonnée Y (px dans le plan)
  createdAt: Date;
  updatedAt: Date;
};
```

#### 3.4 `Newsletter`

```ts
type Newsletter = {
  _id: ObjectId;
  email: string;       // unique
  createdAt: Date;
};
```

---

### 4. API – Endpoints principaux

#### 4.1 Auth visiteur

- **`POST /api/auth/register`**
  - Input : `{ username, email, password }`
  - Sorties :
    - `201` + user (sans password) si succès.
    - `400 { error: "missing_fields" }` si incomplet.
    - `400 { error: "email_already_used" }` si email déjà utilisé.

- **`POST /api/auth/login`**
  - Input : `{ email, password }`
  - Vérifie `User` + `hashPassword`.
  - Crée un JWT (1 jour) → cookie httpOnly `user_token`.

- **`GET /api/auth/me`**
  - Lit `user_token`, vérifie JWT.
  - Charge le `User` en base (pour récupérer `bot`, avatar, etc.).
  - Renvoie `{ authenticated: true, user: { id, username, email, bot, ... } }` ou `{ authenticated: false }`.

- **`DELETE /api/auth/logout`**
  - Supprime le cookie `user_token`.

#### 4.2 Auth admin

- **`POST /api/admin/login`**
  - Input : `{ email, password }`
  - Place un cookie `admin_token` si succès.

- **`GET /api/admin/session`**
  - Renvoie l’état de session (ou non authentifié).

- **Proxy `proxy.ts`** :
  - Redirige vers `/admin/login` si pas de cookie valide sur les routes protégées.

#### 4.3 Plan modules (visiteur)

- **`GET /api/plan-modules`**
  - Initialise les 11 modules si collection vide (`DEFAULT_MODULES`).
  - Renvoie `{ modules: PlanModule[] }` (sans `_id`).
  - Utilisé par la page `/plan` et éventuellement sur la home.

#### 4.4 Plan modules (admin)

- **`GET /api/admin/plan-modules`**
  - Liste tous les modules existants.

- **`POST /api/admin/plan-modules`**
  - Crée un module : `{ key, label, description, x?, y? }`.

- **`PATCH /api/admin/plan-modules`**
  - Édite un module : `{ key, label?, description? }`.

- **`DELETE /api/admin/plan-modules?key=...`**
  - Supprime un module par `key`.

- **`PUT /api/admin/plan-modules`**
  - Batch update des positions et textes :
  - Body : `{ modules: [{ key, label, description, x, y }, ...] }`.

#### 4.5 Bot / avatar / mini-jeu (visiteur)

- **`POST /api/bot-choice`**
  - Lit `user_token`, vérifie JWT.
  - Met à jour `User.bot` en base.
  - (À étendre pour `avatar`, `map`, `clothes` si besoin).

- **Mini-jeu** :
  - Implémenté côté front (state React + composants).
  - Si besoin de persister les scores, ajout futur d’une collection `GameScore`.

---

### 5. Interface visiteur (PWA)

#### 5.1 Home `/`

- Hero / description (`landing.*` via i18n).
- Boutons principaux :
  - Accès à `/admin` (pour l’équipe interne).
  - Accès à `/login` / `/profile`.
- Switch de langue (`LanguageSwitcher` + cookie `locale`).
- Newsletter :
  - Formulaire connecté à `POST /api/subscribe-newsletter`.
  - Toasters de feedback (succès / erreurs).

#### 5.2 Plan `/plan`

- Composant `PlanView` :
  - Container : `w-full h-[calc(100vh-150px)] overflow-auto`.
  - Plan de taille fixe (`PLAN_WIDTH`, `PLAN_HEIGHT` dans `planDefaults`).
  - Modules positionnés absolument : `left: x; top: y;`.

#### 5.3 Avatar / mini-jeu (`AvatarChoices`)

- Choix d’avatar / map / vêtements via `Swiper` (`swiper/react`) :
  - `onSlideChange` met à jour `selectedAvatar`, `selectedMap`, `selectedClothes`.
  - Étapes (wizard) gérées par `currentStep` :
    - Step 1 : avatar
    - Step 2 : map
    - Step 3 : clothes + mini-jeu potentiel.
- Mini-jeu possible :
  - Exemple : quiz contextuel, puzzle sur la map, etc.

#### 5.4 Chatbot

- Composant `ChatBot` :
  - Bouton flottant en bas à droite.
  - Comportement :
    - Ouverture / fermeture.
    - Scroll auto sur les nouveaux messages.
    - Loader / “typing indicator”.
  - Actuellement “fake bot” (réponses statiques), facilement extensible vers un backend IA.

---

### 6. Espace admin / config

#### 6.1 Authentification

- **`/admin/login`** :
  - Formulaire i18n (`auth.login.*`).
  - Pose `admin_token` (JWT) si succès.

- **`/admin`** :
  - Dashboard simple (infos admin, liens vers `/admin/plan`, etc.).

#### 6.2 Plan Editor `/admin/plan`

- Composant `PlanEditor` :
  - Layout deux colonnes :
    - **Gauche** : liste des modules + formulaires de création / édition / suppression.
    - **Droite** : plan avec modules drag & drop.
  - **Opérations supportées** :
    - **Créer** : `key`, `label`, `description` → `POST /api/admin/plan-modules`.
    - **Éditer** : modifie `label/description` dans le state, persiste via `PUT` global sur clic “Sauvegarder”.
    - **Supprimer** : `DELETE /api/admin/plan-modules?key=...`.
    - **Déplacer** : pointer events (drag & drop) sur le plan, mise à jour de `x/y`, persistance avec “Sauvegarder”.
  - UX :
    - Sticky header avec le bouton “Sauvegarder”.
    - Liste scrollable quand il y a beaucoup de modules.
    - Affichage des coordonnées `x/y` pour du réglage fin.

---

### 7. Choix technos & justification

#### 7.1 Next.js (App Router) vs SPA classique

- **Avantages** :
  - Routing + SSR/SSG intégrés.
  - API routes intégrées → API + front dans un seul repo.
  - Moins de glue code, plus rapide à mettre en place.
- **Alternatives** :
  - SPA React + Node/Express séparé :
    - Plus flexible, mais plus de configuration et de DevOps (deux projets, CORS, etc.).
- **Conclusion** : monolithe Next cohérent avec la taille du projet, simplifie le déploiement.

#### 7.2 MongoDB / Mongoose vs SQL

- **MongoDB** :
  - Schémas flexibles, bien adaptés aux données de config (modules plan, préférences users).
  - Mongoose apporte structure + typage TS.
- **SQL** :
  - Plus strict, utile pour des contraintes fortes et des JOINS complexes.
  - Surdimensionné ici pour des données de config simples.

#### 7.3 JWT + cookies httpOnly

- **Raisons** :
  - Séparation claire visiteur / admin (deux secrets, deux cookies).
  - Cookies httpOnly → réduit la surface XSS.
  - Facilement consommable côté serveur (proxy Next).
- **Alternatives** :
  - NextAuth / Auth.js : très complet, mais plus complexe pour un besoin relativement simple.
- **Conclusion** : JWT custom suffit, plus lisible dans un dossier technique.

#### 7.4 PWA

- Next facilite :
  - Mise en place du `manifest.json`.
  - Intégration d’un service worker.
- Pertinent car :
  - L’application est utilisée sur des devices mobiles / tablettes sur site.
  - L’installation en “icône sur l’écran d’accueil” améliore l’expérience.

---

### 8. Comparaison de solutions (résumé)

- **Architecture** :
  - Monolithe Next (choisi) vs microservices → monolithe plus simple, suffisant pour ce scope.
- **DB** :
  - Mongo (choisi) vs Postgres → Mongo mieux adapté à la configuration modulaire, moins de friction.
- **Auth** :
  - JWT custom (choisi) vs Auth.js → plus de contrôle, plus lisible.
- **i18n** :
  - `next-international` (choisi) vs `next-intl` / solution maison → meilleurs hooks client pour App Router.

Les choix techniques sont faits pour maximiser : **rapidité de dev + clarté + maintenabilité**, plutôt que la sur-optimisation prématurée.

---

### 9. README & documentation (structure proposée)

#### 9.1 README (racine)

Sections recommandées :

- Introduction & objectifs du projet.
- Stack technique.
- Scripts : `npm run dev`, `build`, `start`, `lint`.
- Variables d’environnement :
  - `MONGODB_URI`
  - `ADMIN_JWT_SECRET`
  - `USER_JWT_SECRET`
  - `NEXT_PUBLIC_BASE_URL` (ex : `http://localhost:3000`)
- Lien vers ce dossier technique (`DOSSIER_TECHNIQUE.md`).

#### 9.2 Documentation technique

- Ce document, éventuellement déplacé dans `docs/technical.md`.
- À enrichir avec :
  - Diagrammes (PlantUML, Excalidraw…).
  - Scénarios de séquence (auth, édition plan, etc.).

#### 9.3 Schéma d’architecture (image à ajouter)

- Client → Next (pages, providers) → API → MongoDB.

---

### 10. Guide d’installation

1. **Cloner le repo**

```bash
git clone <url>
cd mirokai-exp
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d’environnement**

Créer un fichier `.env.local` :

```env
MONGODB_URI=mongodb+srv://...
ADMIN_JWT_SECRET=admin-secret-long
USER_JWT_SECRET=user-secret-long
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Lancer en dev**

```bash
npm run dev
```

---

### 11. Guide d’utilisation admin

1. Aller sur `/admin/login`.
2. Se connecter avec un compte admin (créé via la DB ou un script de seed).
3. Dashboard :
   - Lien vers `/admin/plan` pour gérer le plan.
4. **`/admin/plan`** :
   - Liste des modules → cliquer pour en sélectionner un.
   - **Créer un module** → renseigner `key`, `label`, `description`.
   - **Éditer** → modifier `label/description` dans le panneau droit.
   - **Déplacer** → drag & drop des modules directement sur le plan.
   - **Sauvegarder** → persiste `x/y/label/description` en base.

---

### 12. Exemples de données

#### 12.1 Exemple de `PlanModule` en base

```json
{
  "_id": "67890...",
  "key": "module-1",
  "label": "Accueil",
  "description": "Accueil général de l'espace démo.",
  "x": 120,
  "y": 80,
  "createdAt": "2026-03-10T10:00:00Z",
  "updatedAt": "2026-03-10T10:05:00Z"
}
```

#### 12.2 Exemple de `User` visiteur

```json
{
  "_id": "abc123...",
  "username": "mirokai-demo",
  "email": "visitor@example.com",
  "passwordHash": "sha256:...",
  "bot": "Miroka",
  "avatar": "Avatar2",
  "map": "Map1",
  "clothes": "Clothes3",
  "createdAt": "2026-03-10T09:00:00Z"
}
```

---

### 13. Instructions de déploiement

- **Hébergement suggéré** : Vercel (natif pour Next.js) + MongoDB Atlas.
- **Étapes** :
  1. Pousser le repo sur GitHub.
  2. Créer un projet Vercel et importer ce repo.
  3. Configurer les variables d’environnement dans Vercel (mêmes que `.env.local`).
  4. Déployer.

- **PWA** :
  - Ajouter / vérifier le `manifest.json` + les icônes dans `public/`.
  - Vérifier via Lighthouse que l’app est bien installable.

---

Ce dossier peut être livré tel quel comme **dossier technique** pour le projet Mirokaï Exp, et complété par des schémas visuels si besoin (architecture, flux d’auth, parcours utilisateur, etc.).