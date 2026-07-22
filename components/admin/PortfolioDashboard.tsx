"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, clientDb } from "@/lib/firebase-client";
import type { PortfolioItem } from "@/lib/portfolio";

type PortfolioDoc = PortfolioItem & { id: string };

export default function PortfolioDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioDoc[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!clientDb) return;
    const q = query(collection(clientDb, "portfolio"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(
        snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as PortfolioItem) }))
      );
    });
    return unsubscribe;
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const category = (form.elements.namedItem("category") as HTMLInputElement)
      .value;
    const coverImagePublicId = (
      form.elements.namedItem("coverImagePublicId") as HTMLInputElement
    ).value;

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId ?? undefined,
          title,
          category,
          coverImagePublicId,
        }),
      });

      if (!res.ok) throw new Error();

      form.reset();
      setEditingId(null);
    } catch {
      setError("Impossible d'enregistrer la réalisation.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette réalisation ?")) return;
    await fetch("/api/admin/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  function startEdit(item: PortfolioDoc) {
    setEditingId(item.id);
    requestAnimationFrame(() => {
      const form = document.getElementById("portfolio-form") as HTMLFormElement;
      if (!form) return;
      (form.elements.namedItem("title") as HTMLInputElement).value = item.title;
      (form.elements.namedItem("category") as HTMLInputElement).value =
        item.category;
      (
        form.elements.namedItem("coverImagePublicId") as HTMLInputElement
      ).value = item.coverImagePublicId;
    });
  }

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    if (auth) await signOut(auth);
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-mist py-16">
      <div className="container-xl grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Réalisations</h1>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-sm text-ink/50 hover:text-ink">
                Articles
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-ink/50 hover:text-ink"
              >
                Se déconnecter
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {items.length === 0 && (
              <p className="text-ink/40 text-sm">Aucune réalisation pour l&apos;instant.</p>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-white border border-ink/5 p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-ink/40">{item.category}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-sm text-brand-blue"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-sm text-brand-rose"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          id="portfolio-form"
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white border border-ink/5 p-8 space-y-4 h-fit"
        >
          <h2 className="font-semibold text-lg mb-2">
            {editingId ? "Modifier la réalisation" : "Nouvelle réalisation"}
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">Titre</label>
            <input
              name="title"
              required
              className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Catégorie</label>
            <input
              name="category"
              required
              className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Image (ID public Cloudinary)
            </label>
            <input
              name="coverImagePublicId"
              required
              className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Enregistrement..." : editingId ? "Mettre à jour" : "Publier"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  (document.getElementById("portfolio-form") as HTMLFormElement)?.reset();
                }}
                className="text-sm text-ink/50"
              >
                Annuler
              </button>
            )}
          </div>

          {error && <p className="text-sm text-brand-rose">{error}</p>}
        </form>
      </div>
    </main>
  );
}
