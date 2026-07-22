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
  if (!body?.title || !body?.slug || !body?.excerpt || !body?.content) {
    return NextResponse.json(
      { error: "Champs requis manquants." },
      { status: 400 }
    );
  }

  await db.collection("articles").add({
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    content: body.content,
    coverImagePublicId: body.coverImagePublicId ?? "",
    published: Boolean(body.published),
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/blog");
  if (body.published) revalidatePath(`/blog/${body.slug}`);

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
  if (!body?.id || !body?.title || !body?.slug || !body?.excerpt || !body?.content) {
    return NextResponse.json(
      { error: "Champs requis manquants." },
      { status: 400 }
    );
  }

  const docRef = db.collection("articles").doc(body.id);
  const existing = await docRef.get();
  const previousSlug = existing.data()?.slug as string | undefined;

  await docRef.update({
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    content: body.content,
    coverImagePublicId: body.coverImagePublicId ?? "",
    published: Boolean(body.published),
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${body.slug}`);
  if (previousSlug && previousSlug !== body.slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }

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

  const docRef = db.collection("articles").doc(body.id);
  const existing = await docRef.get();
  const slug = existing.data()?.slug as string | undefined;

  await docRef.delete();

  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);

  return NextResponse.json({ ok: true });
}
