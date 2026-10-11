import { NextRequest, NextResponse } from "next/server";

const RESERVED_TOP_LEVEL_SEGMENTS = new Set([
  "about",
  "account",
  "contact-sales",
  "contributors",
  "download",
  "policy",
  "pricing",
  "products",
  "resources",
  "solutions",
  "terms-of-service",
  "auth",
  "accept_org_invitation",
  "accept_general_invitation",
  "billing",
  "404",
  "api",
]);

const NOT_FOUND_REWRITE_PATH = "/__proxy_not_found__/404";

function notFoundResponse(request: NextRequest): NextResponse {
  return NextResponse.rewrite(new URL(NOT_FOUND_REWRITE_PATH, request.url), {
    status: 404,
  });
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const slug = request.nextUrl.pathname.slice(1);

  if (
    !slug ||
    slug.includes(".") ||
    slug.startsWith("_") ||
    RESERVED_TOP_LEVEL_SEGMENTS.has(slug)
  ) {
    return NextResponse.next();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) return NextResponse.next();

  try {
    const res = await fetch(
      `${baseUrl.replace(/\/$/, "")}/organisations/slug-exists/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return NextResponse.next();

    const body = await res.json();
    if (body?.data?.exists) {
      return NextResponse.next();
    }

    return notFoundResponse(request);
  } catch (error) {
    console.error("proxy: org slug check failed, failing open:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/:slug"],
};
