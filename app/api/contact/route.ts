import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { sendContactNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json(
      { error: "Merci de remplir tous les champs." },
      { status: 400 }
    );
  }

  const db = getFirestoreDb();

  if (!db) {
    return NextResponse.json(
      {
        error:
          "Le formulaire n'est pas encore configuré. Merci de nous contacter directement pour le moment.",
      },
      { status: 503 }
    );
  }

  await db.collection("contacts").add({
    name: body.name,
    email: body.email,
    message: body.message,
    createdAt: new Date().toISOString(),
  });

  try {
    await sendContactNotification({
      name: body.name,
      email: body.email,
      message: body.message,
    });
  } catch {
    // The submission is already saved in Firestore; a failed
    // notification email shouldn't fail the request for the user.
  }

  return NextResponse.json({ ok: true });
}
