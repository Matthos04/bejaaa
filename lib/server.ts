import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/database";

const ADMIN_COOKIE = "bejaaa_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET باید حداقل ۳۲ نویسه باشد.");
  return secret;
}

function signature(expires: string) {
  return createHmac("sha256", sessionSecret()).update(expires).digest("hex");
}

export async function isAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const [expires, supplied] = token.split(".");
  if (!expires || !supplied || Number(expires) < Date.now()) return false;
  const left = Buffer.from(supplied, "hex");
  const right = Buffer.from(signature(expires), "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD تنظیم نشده است.");
  const suppliedHash = createHmac("sha256", "bejaaa-admin-check").update(password).digest();
  const expectedHash = createHmac("sha256", "bejaaa-admin-check").update(expected).digest();
  return timingSafeEqual(suppliedHash, expectedHash);
}

export function createAdminSession() {
  const expires = String(Date.now() + SESSION_SECONDS * 1000);
  return { value: `${expires}.${signature(expires)}`, maxAge: SESSION_SECONDS };
}

export const adminCookieName = ADMIN_COOKIE;
export { db };

export function checkOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const url = new URL(req.url);
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || url.protocol.slice(0, -1);
  if (!origin || !host || origin !== `${protocol}://${host}`) throw new Error("درخواست نامعتبر است.");
}

export function fail(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
