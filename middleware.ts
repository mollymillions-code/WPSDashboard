import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/register", "/api/auth"]

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check if the user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If not authenticated and trying to access a protected route, redirect to login
  if (!token && !path.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
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
}
