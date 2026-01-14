import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Define protected routes
    const isDashboardRoute = pathname.startsWith('/user-dashboard')

    if (isDashboardRoute) {
        // The cookie name we sync from the client in FrontendLayout.tsx
        const cookieName = `sb-acgbmvotllgzbwonvhnb-auth-token`
        const authCookie = req.cookies.get(cookieName)

        // Log for debugging if needed (will show in terminal)
        // console.log('Middleware checking route:', pathname, 'Has auth cookie:', !!authCookie)

        if (!authCookie || !authCookie.value) {
            // If no cookie is found, redirect to login
            const loginUrl = new URL('/login', req.url)
            // We don't want to loop if already on login, but matcher handles that
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

// Matcher to limit middleware to specific routes
export const config = {
    matcher: [
        '/user-dashboard/:path*',
    ],
}
