"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-28">
      <div className="absolute inset-0 -z-10 bg-brand-gradient-soft" />
      <div
        className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-brand-gradient opacity-20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-24 -left-24 -z-10 h-80 w-80 rounded-full bg-brand-gradient opacity-10 blur-3xl"
        aria-hidden
      />

      <div className="container-xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-ink/70 shadow-card mb-8"
        >
          <span className="h-2 w-2 rounded-full bg-brand-gradient" />
          Studio digital · Web · Design · Marketing
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Des sites et des marques qui{" "}
          <span className="text-gradient">font grandir</span> votre activité
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg text-ink/60 max-w-2xl mx-auto"
        >
          Diandi Digital accompagne les entreprises et les entrepreneurs dans
          la création de sites web, d'applications et d'identités visuelles
          modernes, rapides et pensés pour convertir.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-brand-gradient px-8 py-3.5 text-base font-semibold text-white shadow-soft hover:opacity-90 transition-opacity"
          >
            Démarrer un projet
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center justify-center rounded-full border border-ink/10 bg-white px-8 py-3.5 text-base font-semibold text-ink hover:bg-ink/5 transition-colors"
          >
            Voir nos réalisations
          </a>
        </motion.div>
      </div>
    </section>
  );
}
