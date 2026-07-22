import Image from "next/image";
import { nav, site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70 py-14">
      <div className="container-xl flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-diandidigital.png"
            alt={site.name}
            width={32}
            height={32}
          />
          <span className="font-semibold text-white">{site.name}</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} {site.name}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
