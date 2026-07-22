import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublishedArticles } from "@/lib/articles";
import { cloudinaryUrl } from "@/lib/cloudinary";

export const metadata = {
  title: "Blog — Diandi Digital",
  description: "Articles et actualités de Diandi Digital.",
};

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <Header />
      <main className="pt-40 pb-28">
        <div className="container-xl">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-3">
              Blog
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Actualités et conseils
            </h1>
          </div>

          {articles.length === 0 ? (
            <p className="text-center text-ink/50">
              Aucun article publié pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => {
                const imageUrl = article.coverImagePublicId
                  ? cloudinaryUrl(article.coverImagePublicId, {
                      width: 640,
                      height: 400,
                    })
                  : null;

                return (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group rounded-2xl bg-white shadow-card border border-ink/5 overflow-hidden hover:shadow-soft transition-shadow"
                  >
                    <div className="relative aspect-[16/10] bg-brand-gradient-soft">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-ink/40 mb-2">
                        {new Date(article.createdAt).toLocaleDateString(
                          "fr-FR",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </p>
                      <h2 className="font-semibold text-lg mb-2">
                        {article.title}
                      </h2>
                      <p className="text-sm text-ink/60 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
