"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container-xl flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-2">
          <Image
            src="/LOGO-DIANDIDIGITAL 100.png"
            alt={site.name}
            width={40}
            height={40}
            priority
          />
          <span className="font-semibold text-lg tracking-tight">
            {site.name}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/70 hover:text-ink transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-card hover:opacity-90 transition-opacity"
        >
          Démarrer un projet
        </a>

        <button
          className="md:hidden p-2"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink mb-1.5" />
          <span className="block w-6 h-0.5 bg-ink" />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-ink/5 px-6 py-4 flex flex-col gap-4">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink/70"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
          >
            Démarrer un projet
          </a>
        </div>
      )}
    </header>
  );
}
