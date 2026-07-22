import Image from "next/image";
import Countdown from "@/components/Countdown";

const LAUNCH_DATE = process.env.NEXT_PUBLIC_LAUNCH_DATE || "2026-09-01T00:00:00";

export const metadata = {
  title: "Bientôt disponible — Diandi Digital",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-gradient-soft px-6 text-center">
      <Image
        src="/logo-diandidigital.png"
        alt="Diandi Digital"
        width={64}
        height={64}
        className="mb-8"
      />
      <p className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-3">
        Diandi Digital
      </p>
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl mb-6">
        Quelque chose de nouveau arrive bientôt
      </h1>
      <p className="text-ink/60 max-w-lg mb-12">
        On prépare une nouveauté. Reviens vite pour la découvrir.
      </p>
      <Countdown targetDate={LAUNCH_DATE} />
    </main>
  );
}
