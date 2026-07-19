const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_NOTIFICATION_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL;

export const emailConfigured = Boolean(
  RESEND_API_KEY && CONTACT_NOTIFICATION_EMAIL
);

/**
 * Sends a notification email for a new contact form submission.
 * No-ops silently when Resend isn't configured yet, so the contact
 * form keeps working (Firestore write) even without email set up.
 */
export async function sendContactNotification({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  if (!emailConfigured) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Diandi Digital <site@diandidigital.tech>",
      to: CONTACT_NOTIFICATION_EMAIL,
      reply_to: email,
      subject: `Nouveau message de ${name}`,
      text: `Nom: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });
}
