import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/controller/AuthorizationController';

export async function verifyJWT(req: NextRequest) {
    // Bangun URL absolut berdasarkan request yang masuk
    try {
        const cookie = cookies().get('token')?.value;
        console.log('token',cookie);
        
        const response = await verifyToken(cookie, req);
        if (response.status === 200) {
            const data = await response.json();
            // console.log(data);
            console.log(data);

            const result = NextResponse.next();
            result.headers.set('Set-Cookie', data.user);
            return result;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}
