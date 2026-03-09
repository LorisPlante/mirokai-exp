import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protection des routes admin (page et API)
  // On NE protège PAS la page de login elle-même pour éviter les boucles de redirection
  const isAdminPage =
    pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && !pathname.endsWith("/login") && !pathname.endsWith("/users");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (!ADMIN_JWT_SECRET) {
    console.error("ADMIN_JWT_SECRET manquant");
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    if (isAdminPage) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    jwt.verify(token, ADMIN_JWT_SECRET);
    return NextResponse.next();
  } catch {
    if (isAdminPage) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

