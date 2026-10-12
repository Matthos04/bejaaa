import { NextResponse } from "next/server";
import { adminCookieName, checkOrigin } from "@/lib/server";

export async function POST(req: Request) {
  checkOrigin(req);
  const response = NextResponse.redirect(new URL("/admin/login", req.url), 303);
  response.cookies.set(adminCookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
