import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/firebase-admin";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = cookies().get("__session")?.value;
  const decoded = await verifyAdminSession(sessionCookie);

  if (!decoded) redirect("/admin/login");

  return <>{children}</>;
}
