import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import Settings from '@/models/Settings';
import UMPEG from '@/models/UMPEG';
import Verifikasi from '@/models/Verifikasi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const data: any = cookies().get('user')?.value;
        
        if (!data) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const user = JSON.parse(data);
        const settings: any = await Settings.findOne();
        
        const umpeg: any = await UMPEG.findOne({ 'unit.id_sapk': user.jabatan.unor.induk.id });
        const verificator: any = await Verifikasi.findOne({ 'unit.id_sapk': user.jabatan.unor.induk.id });

        const permissions = new Set<string>(['user']);
        if (user.jabatan.nip_asn === settings.admin_id) {
            permissions.add('admin');
        }
        if (umpeg?.jabatan?.role === user.jabatan.nama_jabatan) {
            permissions.add('umpeg');
        }
        if (verificator) {
            permissions.add('verificator');
        }
        
        const permissionArray = Array.from(permissions);
        return NextResponse.json(createResponse(200, 'Success', permissionArray, true));
    } catch (error) {
        return NextResponse.json({ error: error}, { status: 500 });
    }
}
