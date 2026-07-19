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

Les mêmes variables doivent être ajoutées dans les paramètres du projet Vercel (Settings → Environment Variables) pour la production.

## Images Cloudinary

Les identifiants publics (`publicId`) des images du portfolio sont centralisés dans `lib/content.ts`. Une fois les images uploadées sur Cloudinary, mettre à jour ces `publicId` pour qu'elles s'affichent sur le site.

## Structure

- `app/` — pages et route API (App Router)
- `components/` — sections du site (Header, Hero, Services, About, Portfolio, Contact, Footer)
- `lib/` — contenu centralisé, helper Cloudinary, client Firebase Admin
