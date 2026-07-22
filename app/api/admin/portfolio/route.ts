import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDb, verifyAdminSession } from "@/lib/firebase-admin";

async function requireSession() {
  const sessionCookie = cookies().get("__session")?.value;
  return verifyAdminSession(sessionCookie);
}

export async function POST(req: NextRequest) {
  const decoded = await requireSession();
  if (!decoded) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const db = getFirestoreDb();
  if (!db) {
    return NextResponse.json(
      { error: "Base de données non configurée." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.category || !body?.coverImagePublicId) {
    return NextResponse.json(
      { error: "Champs requis manquants." },
      { status: 400 }
    );
  }

  await db.collection("portfolio").add({
    title: body.title,
    category: body.category,
    coverImagePublicId: body.coverImagePublicId,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const decoded = await requireSession();
  if (!decoded) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const db = getFirestoreDb();
  if (!db) {
    return NextResponse.json(
      { error: "Base de données non configurée." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.title || !body?.category || !body?.coverImagePublicId) {
    return NextResponse.json(
      { error: "Champs requis manquants." },
      { status: 400 }
    );
  }

  await db.collection("portfolio").doc(body.id).update({
    title: body.title,
    category: body.category,
    coverImagePublicId: body.coverImagePublicId,
  });

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const decoded = await requireSession();
  if (!decoded) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const db = getFirestoreDb();
  if (!db) {
    return NextResponse.json(
      { error: "Base de données non configurée." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.id) {
    return NextResponse.json({ error: "Identifiant manquant." }, { status: 400 });
  }

  await db.collection("portfolio").doc(body.id).delete();

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
