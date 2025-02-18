import { verifyJWT } from '@/middleware/jwtMiddleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { permissionMiddleware } from './middleware/permissionMiddleware';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Abaikan middleware untuk halaman statis atau login page
    if (
        pathname.startsWith('/auth/login') || // Abaikan halaman /auth/login
        pathname.startsWith('/_next') || // Abaikan file statis dari Next.js (_next/static, _next/image)
        pathname.startsWith('/favicon.ico') || // Abaikan favicon
        pathname.match(/\.(css|js|png|jpg|svg|woff|woff2|ttf)$/) // Abaikan file CSS, JS, dan gambar
    ) {
        return NextResponse.next();
    }

    // Lakukan verifikasi JWT untuk halaman lainnya
    const jwtResponse = await verifyJWT(req);
    if (!jwtResponse) {
        return NextResponse.redirect(new URL('/auth/login', req.url), 307);
    }

    if (pathname.startsWith('/dashboard')) {
        const permissionResponse = await permissionMiddleware(req);
        console.log(permissionResponse);

        if (!permissionResponse) {
            return NextResponse.redirect(new URL('/not-authorized', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/login|api/authorization).*)']
};
