import { getFirestoreDb } from "@/lib/firebase-admin";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImagePublicId?: string;
  published: boolean;
  createdAt: string;
};

export async function getPublishedArticles(): Promise<Article[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  // Tri en mémoire plutôt qu'un orderBy() Firestore : évite de dépendre
  // d'un index composite (published + createdAt) à créer manuellement.
  const snapshot = await db
    .collection("articles")
    .where("published", "==", true)
    .get();

  return snapshot.docs
    .map((doc) => doc.data() as Article)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const snapshot = await db
    .collection("articles")
    .where("slug", "==", slug)
    .where("published", "==", true)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as Article;
}
