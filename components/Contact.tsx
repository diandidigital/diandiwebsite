"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Une erreur est survenue.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    }
  }

  return (
    <section id="contact" className="py-28 bg-white">
      <div className="container-xl">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Parlons de votre projet
          </h2>
          <p className="text-ink/60">
            Décrivez-nous votre besoin, nous revenons vers vous rapidement.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto rounded-2xl bg-mist border border-ink/5 p-8 space-y-5"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Nom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-1.5"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
              placeholder="Parlez-nous de votre projet..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-white shadow-card hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
          </button>

          {status === "success" && (
            <p className="text-sm text-emerald-600 text-center">
              Merci ! Votre message a bien été envoyé.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-brand-rose text-center">
              {errorMessage}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
