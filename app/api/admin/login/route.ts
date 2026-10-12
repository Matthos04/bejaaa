import { NextResponse } from "next/server";
import { adminCookieName, createAdminSession, verifyAdminPassword } from "@/lib/server";
import { checkOrigin } from "@/lib/server";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  checkOrigin(req);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const attempt = attempts.get(ip);
  if (attempt && attempt.resetAt > now && attempt.count >= 5) {
    return NextResponse.redirect(new URL("/admin/login?error=1", req.url), 303);
  }
  const form = await req.formData();
  const password = form.get("password");
  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    const next = attempt && attempt.resetAt > now ? { count: attempt.count + 1, resetAt: attempt.resetAt } : { count: 1, resetAt: now + 10 * 60 * 1000 };
    attempts.set(ip, next);
    return NextResponse.redirect(new URL("/admin/login?error=1", req.url), 303);
  }
  attempts.delete(ip);
  const session = createAdminSession();
  const response = NextResponse.redirect(new URL("/admin", req.url), 303);
  response.cookies.set(adminCookieName, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}
