import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { clientDb } from "@/lib/firebase-client";

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
  if (!clientDb) return [];

  const q = query(
    collection(clientDb, "articles"),
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data() as Article);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!clientDb) return null;

  const q = query(
    collection(clientDb, "articles"),
    where("slug", "==", slug),
    where("published", "==", true),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as Article;
}
