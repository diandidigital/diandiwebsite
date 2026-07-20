"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="py-28 bg-white">
      <div className="container-xl grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-3">
            À propos
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Une agence de développement à taille humaine, exigeante sur le résultat
          </h2>
          <p className="text-ink/60 leading-relaxed mb-4">
            Diandi Digital est avant tout une agence de développement
            d'applications web et Android. Nous accompagnons aussi les
            entreprises et entrepreneurs dans la conception de sites et
            d'identités visuelles modernes. Notre approche : comprendre vos
            objectifs, concevoir une expérience claire, et livrer un produit
            rapide, fiable et bien pensé.
          </p>
          <p className="text-ink/60 leading-relaxed">
            De la stratégie à la mise en ligne, nous restons impliqués à
            chaque étape pour que votre présence digitale reflète vraiment
            votre ambition.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-6"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-mist border border-ink/5 p-8 text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-ink/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
