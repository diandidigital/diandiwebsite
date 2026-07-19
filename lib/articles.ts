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

  const snapshot = await db
    .collection("articles")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data() as Article);
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
