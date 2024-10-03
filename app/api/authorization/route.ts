import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import jwksClient from 'jwks-rsa';
import { createResponse } from '@/utils/api';

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

        const data = {
            token: token,
            user: JSON.parse(dt)
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

        // Jika perlu, serialisasi data yang relevan ke cookie
        const userCookie = serialize('user', JSON.stringify(decoded.mapData), {
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
