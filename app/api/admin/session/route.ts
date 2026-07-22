import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

const SESSION_MAX_AGE = 60 * 60 * 24 * 5; // 5 jours

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const idToken = body?.idToken;

  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "Token manquant." }, { status: 400 });
  }

  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    return NextResponse.json(
      { error: "L'authentification admin n'est pas configurée." },
      { status: 503 }
    );
  }

  try {
    await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE * 1000,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Session invalide." }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("__session", "", { path: "/", maxAge: 0 });
  return res;
}
