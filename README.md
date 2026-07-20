# Diandi Digital — site web

Site vitrine construit avec Next.js 14 (App Router), TypeScript et Tailwind CSS. Déployé sur Vercel, domaine `diandidigital.tech` géré via Cloudflare (DNS uniquement).

## Développement local

```bash
npm install
npm run dev
```

Le site est disponible sur http://localhost:3000.

## Configuration

Copier `.env.local.example` vers `.env.local` et renseigner :

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — nom du cloud Cloudinary utilisé pour les images (portfolio, etc.). Sans cette variable, le site affiche des placeholders à la place des images Cloudinary.
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — identifiants d'un compte de service Firebase Admin (Firestore), utilisés par l'API `/api/contact` pour enregistrer les soumissions du formulaire de contact dans la collection `contacts`. Sans ces variables, le formulaire affiche un message d'erreur propre au lieu de planter.
- `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL` — optionnel : envoie une notification email à chaque nouvelle soumission du formulaire via [Resend](https://resend.com). Sans ces variables, la soumission est quand même enregistrée dans Firestore, seule l'email n'est pas envoyée.

Les mêmes variables doivent être ajoutées dans les paramètres du projet Vercel (Settings → Environment Variables) pour la production.

## SEO & Analytics

- `app/sitemap.ts` et `app/robots.ts` génèrent automatiquement `/sitemap.xml` et `/robots.txt` (équivalent Yoast/RankMath, sans plugin).
- Vercel Analytics est activé nativement (`@vercel/analytics`) — visible dans l'onglet "Analytics" du projet sur Vercel, aucune configuration requise.

## Blog (`/blog`) et administration (`/admin`)

Remplace la publication d'articles WordPress : `/admin` est une interface de publication protégée, sans besoin de toucher au code ou à git pour publier un article.

**Configuration à faire une seule fois dans la Console Firebase :**

1. **Récupérer les clés client** : Project Settings → General → "Your apps" → ajoute une "Web app" si aucune n'existe. Copie `apiKey`, `authDomain`, `projectId` dans `NEXT_PUBLIC_FIREBASE_*` (voir `.env.local.example`), en local et dans les variables d'environnement Vercel.
2. **Activer l'authentification** : Authentication → Sign-in method → active "Email/Password". Puis Authentication → Users → "Add user" pour créer ton compte admin (email + mot de passe).
3. **Règles de sécurité Firestore** : Firestore Database → Rules, colle :
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /articles/{articleId} {
         allow read: if resource.data.published == true;
         allow read, write: if request.auth != null;
       }
       match /contacts/{contactId} {
         allow read, write: if false;
       }
     }
   }
   ```
   (Les soumissions du formulaire de contact passent par le SDK Admin côté serveur, qui contourne ces règles — elles restent donc inaccessibles publiquement.)

**Utilisation** : va sur `/admin/login`, connecte-toi avec le compte créé à l'étape 2, puis crée/édite/supprime des articles depuis `/admin`. Les articles avec la case "Publié" cochée apparaissent sur `/blog`.

## Page "bientôt disponible" et mode maintenance

- `/coming-soon` est une page autonome avec compte à rebours (`components/Countdown.tsx`), consultable à tout moment à cette URL — utile pour annoncer un lancement en partageant ce lien.
- La date du countdown vient de `NEXT_PUBLIC_LAUNCH_DATE` (format `2026-09-01T00:00:00`).
- Pour mettre **tout le site** en attente (mode maintenance), passe `MAINTENANCE_MODE=true` dans les variables d'environnement (local ou Vercel) : `middleware.ts` redirige alors toutes les pages vers `/coming-soon`, sauf `/admin` (pour continuer à publier), `/api`, et les fichiers SEO (`robots.txt`, `sitemap.xml`, `ads.txt`). Remets `MAINTENANCE_MODE=false` (ou supprime la variable) pour rouvrir le site.

## Images Cloudinary

Les identifiants publics (`publicId`) des images du portfolio sont centralisés dans `lib/content.ts`. Une fois les images uploadées sur Cloudinary, mettre à jour ces `publicId` pour qu'elles s'affichent sur le site.

## Structure

- `app/` — pages et route API (App Router)
- `components/` — sections du site (Header, Hero, Services, About, Portfolio, Contact, Footer)
- `lib/` — contenu centralisé, helper Cloudinary, client Firebase Admin
