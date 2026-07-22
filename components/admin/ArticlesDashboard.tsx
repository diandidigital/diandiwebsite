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
import type { Article } from "@/lib/articles";

const DIACRITICS_REGEX = new RegExp("[̀-ͯ]", "g");

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type ArticleDoc = Article & { id: string };

export default function ArticlesDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleDoc[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!clientDb) return;
    const q = query(collection(clientDb, "articles"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setArticles(
        snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Article) }))
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
    const slug = (form.elements.namedItem("slug") as HTMLInputElement).value;
    const excerpt = (form.elements.namedItem("excerpt") as HTMLTextAreaElement)
      .value;
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement)
      .value;
    const coverImagePublicId = (
      form.elements.namedItem("coverImagePublicId") as HTMLInputElement
    ).value;
    const published = (form.elements.namedItem("published") as HTMLInputElement)
      .checked;

    try {
      const res = await fetch("/api/admin/articles", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId ?? undefined,
          title,
          slug,
          excerpt,
          content,
          coverImagePublicId,
          published,
        }),
      });

      if (!res.ok) throw new Error();

      form.reset();
      setEditingId(null);
    } catch {
      setError("Impossible d'enregistrer l'article.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch("/api/admin/articles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  function startEdit(article: ArticleDoc) {
    setEditingId(article.id);
    requestAnimationFrame(() => {
      const form = document.getElementById("article-form") as HTMLFormElement;
      if (!form) return;
      (form.elements.namedItem("title") as HTMLInputElement).value =
        article.title;
      (form.elements.namedItem("slug") as HTMLInputElement).value =
        article.slug;
      (form.elements.namedItem("excerpt") as HTMLTextAreaElement).value =
        article.excerpt;
      (form.elements.namedItem("content") as HTMLTextAreaElement).value =
        article.content;
      (
        form.elements.namedItem("coverImagePublicId") as HTMLInputElement
      ).value = article.coverImagePublicId ?? "";
      (form.elements.namedItem("published") as HTMLInputElement).checked =
        article.published;
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
            <h1 className="text-2xl font-bold">Articles</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/portfolio"
                className="text-sm text-ink/50 hover:text-ink"
              >
                Réalisations
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
            {articles.length === 0 && (
              <p className="text-ink/40 text-sm">Aucun article pour l&apos;instant.</p>
            )}
            {articles.map((article) => (
              <div
                key={article.id}
                className="rounded-xl bg-white border border-ink/5 p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium">{article.title}</p>
                  <p className="text-xs text-ink/40">
                    {article.published ? "Publié" : "Brouillon"} · /blog/
                    {article.slug}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => startEdit(article)}
                    className="text-sm text-brand-blue"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
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
          id="article-form"
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white border border-ink/5 p-8 space-y-4 h-fit"
        >
          <h2 className="font-semibold text-lg mb-2">
            {editingId ? "Modifier l'article" : "Nouvel article"}
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">Titre</label>
            <input
              name="title"
              required
              className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
              onChange={(e) => {
                if (editingId) return;
                const form = e.currentTarget.form;
                const slugInput = form?.elements.namedItem(
                  "slug"
                ) as HTMLInputElement;
                if (slugInput) slugInput.value = slugify(e.currentTarget.value);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input
              name="slug"
              required
              className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Extrait</label>
            <textarea
              name="excerpt"
              required
              rows={2}
              className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Contenu</label>
            <textarea
              name="content"
              required
              rows={10}
              className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Image de couverture (ID public Cloudinary, optionnel)
            </label>
            <input
              name="coverImagePublicId"
              className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="published" className="h-4 w-4" />
            Publié
          </label>

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
                  (document.getElementById("article-form") as HTMLFormElement)?.reset();
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
