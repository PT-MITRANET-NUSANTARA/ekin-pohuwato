import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/controller/AuthorizationController';

export async function verifyJWT(req: NextRequest) {
  const cookie = cookies().get('token')?.value;
  const dt = cookies().get('user')?.value;
  // Bangun URL absolut berdasarkan request yang masuk

  try {
    // Lakukan fetch ke API menggunakan URL absolut
    const response = await verifyToken(cookie, req);

    if (response.status === 200) {
      const data = await response.json();
      // console.log(data);
      
      const result =  NextResponse.next();
      result.headers.set('Set-Cookie', data.user);
      return result;
    } else {
      return NextResponse.redirect(new URL('/auth/login', req.url), 307);
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.redirect(new URL('/auth/login', req.url), 307);
  }
}
