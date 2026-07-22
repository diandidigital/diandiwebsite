import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArticleBySlug, getPublishedArticles } from "@/lib/articles";
import { cloudinaryUrl } from "@/lib/cloudinary";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return { title: "Article introuvable — Diandi Digital" };
  }

  const imageUrl = article.coverImagePublicId
    ? cloudinaryUrl(article.coverImagePublicId, { width: 1200, height: 630 })
    : undefined;

  return {
    title: `${article.title} — Diandi Digital`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);

  if (!article) notFound();

  const imageUrl = article.coverImagePublicId
    ? cloudinaryUrl(article.coverImagePublicId, { width: 1200, height: 630 })
    : null;

  return (
    <>
      <Header />
      <main className="pt-40 pb-28">
        <article className="container-xl max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-3 text-center">
            Blog
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4">
            {article.title}
          </h1>
          <p className="text-sm text-ink/40 text-center mb-10">
            {new Date(article.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {imageUrl && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="text-ink/80 whitespace-pre-wrap leading-relaxed text-lg">
            {article.content}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
