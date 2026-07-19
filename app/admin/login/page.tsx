"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseClientConfigured } from "@/lib/firebase-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!auth) return;

    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  if (!firebaseClientConfigured) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-mist px-6">
        <p className="text-ink/60 text-center max-w-sm">
          L&apos;authentification n&apos;est pas encore configurée. Ajoute les
          variables Firebase dans <code>.env.local</code>.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-mist px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white border border-ink/5 shadow-card p-8 space-y-5"
      >
        <h1 className="text-xl font-semibold text-center mb-2">
          Connexion admin
        </h1>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-ink/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1.5"
          >
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-ink/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {error && (
          <p className="text-sm text-brand-rose text-center">{error}</p>
        )}
      </form>
    </main>
  );
}
