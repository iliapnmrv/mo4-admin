import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export type TokenData = {
  fio: string;
  id: number;
  account: string;
  projects: Record<string, number>;
};

type TokenPayload = {
  data: string;
  iat: number;
  exp: number;
};

export async function middleware(request: NextRequest) {
  const { cookies } = request;
  const { value: token } = cookies.get("dataToken") ?? { value: null };

  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
  if (!token) {
    const response = NextResponse.redirect(new URL(`http://mo4-web`));
    return response;
  }
  const { payload } = await jose.jwtVerify(token, secret);

  const hasPermission =
    payload.data &&
    (JSON.parse(payload.data as string) as TokenData).projects?.admin === 1;

  if (!hasPermission) {
    const response = NextResponse.redirect(new URL(`http://mo4-web`));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
