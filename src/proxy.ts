import { type NextRequest, NextResponse } from "next/server";
import { PIN_COOKIE, pinHash } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  if (req.cookies.get(PIN_COOKIE)?.value === (await pinHash()))
    return NextResponse.next();
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!login|_next|manifest\\.webmanifest|icon.*|favicon\\.ico).*)"],
};
