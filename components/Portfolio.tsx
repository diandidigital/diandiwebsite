import { getPortfolioItems } from "@/lib/portfolio";
import PortfolioGrid from "@/components/PortfolioGrid";

export default async function Portfolio() {
  const items = await getPortfolioItems();

  return (
    <section id="portfolio" className="py-28">
      <div className="container-xl">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-3">
            Réalisations
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Quelques projets récents
          </h2>
        </div>

        <PortfolioGrid items={items} />
      </div>
    </section>
  );
}
