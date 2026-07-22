import { getFirestoreDb } from "@/lib/firebase-admin";

export type PortfolioItem = {
  title: string;
  category: string;
  coverImagePublicId: string;
  createdAt: string;
};

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  const snapshot = await db
    .collection("portfolio")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data() as PortfolioItem);
}
