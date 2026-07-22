"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PortfolioItem } from "@/lib/portfolio";
import { cloudinaryUrl } from "@/lib/cloudinary";

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => {
        const imageUrl = cloudinaryUrl(item.coverImagePublicId, {
          width: 640,
          height: 480,
        });

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card border border-ink/5"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-brand-gradient-soft flex items-center justify-center">
                <span className="text-ink/30 text-sm">
                  Image à venir
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  {item.category}
                </p>
                <p className="text-white font-semibold">{item.title}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
