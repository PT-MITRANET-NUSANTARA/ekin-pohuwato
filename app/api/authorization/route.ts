import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import jwksClient from 'jwks-rsa';
import { createResponse } from '@/utils/api';
import { getByNIP } from '@/controller/IDSN/JabatanController';

const client = jwksClient({
    jwksUri: process.env.NEXT_PUBLIC_API_JWT_URL || 'default_jwks_uri'
});

const getKey = (header: any, callback: any) => {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }

        if (!key) {
            return callback(new Error('Invalid token'), null);
        }

        const signingKey = key.getPublicKey() ;

        callback(null, signingKey);
    });
};

export async function GET(req: NextRequest) {
    try {
        const token = cookies().get('token')?.value;
        const dt: any = cookies().get('user')?.value;
        const cookie:any = JSON.parse(dt);
        const data = {
            token: token,
            user: cookie.user,
            jabatan: cookie.jabatan
        };
        console.log(data);
        
        return NextResponse.json(createResponse(200, 'Success', data));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        // Mendapatkan body dari request
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ message: 'Token is required' }, { status: 400 });
        }

        // Log token yang diterima
        console.log('Token received:', token);

        // Serialisasi cookie
        const cookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 minggu
            path: '/'
        });

        // Set cookie ke header response
        const response = NextResponse.json({ message: 'Successfully set cookie!', token: token });
        response.headers.set('Set-Cookie', cookie);

        return response;
    } catch (error) {
        console.error('PUT error:', error); // Log error untuk debugging
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // Ambil body dari request
        const body = await req.json();
        const { token } = body;

        // Jika token tidak ditemukan, redirect ke halaman login
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', req.url), 307);
        }

        // Verifikasi token menggunakan JWKS
        const decoded: any = await new Promise((resolve, reject) => {
            jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });

        const respon:any = await getByNIP(token,decoded.mapData.nipBaru);
        const jabatan = respon.mapData.data[0];
  
        
        

        // Jika perlu, serialisasi data yang relevan ke cookie
        const data = {
            user: decoded.mapData,
            jabatan: jabatan
        }
        const userCookie = serialize('user', JSON.stringify(data), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 minggu
            path: '/'
        });

        // Set cookie untuk user
        const response = NextResponse.json({ message: 'Token verified successfully', user: userCookie });
        response.headers.set('Set-Cookie', userCookie);
        return response;
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return NextResponse.redirect(new URL('/auth/login', req.url), 307);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        // Set the cookies to expire by setting maxAge to 0 or an expiration date in the past
        const tokenCookie = serialize('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0), // Set expiration to the past
            path: '/'
        });

        const userCookie = serialize('user', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0), // Set expiration to the past
            path: '/'
        });

        // Create the response object
        const response = NextResponse.json({ message: 'Successfully logged out', ok: true });

        // Set both cookies in the response headers individually
        response.headers.append('Set-Cookie', tokenCookie);
        response.headers.append('Set-Cookie', userCookie);

        return response;
    } catch (error) {
        console.error('DELETE error (Logout):', error);
        return NextResponse.json({ error: 'Failed to log out', ok: false }, { status: 500 });
    }
}
