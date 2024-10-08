import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import Image from '../../../models/Image'; // Adjust according to your model path
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const saveFile = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    return `/uploads/${fileName}`;
};

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const imageIds: string[] = []; 
        const data:any = req.body;
        console.log(data);
        
        if (data.files) {
            for (const file of data.files) {
                const filePath = await saveFile(file.buffer, file.originalFilename);
                imageIds.push(filePath);
            }
        }

        return NextResponse.json(createResponse(201, 'Images uploaded successfully', { imageIds }, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ success: false, error: 'Failed to upload images' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        let images;

        if (id) {
            images = await Image.findById(id);
            if (!images) {
                return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
            }
        } else {
            images = await Image.find({});
        }

        return NextResponse.json(createResponse(200, 'Success', images, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch images' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json({ success: false, message: 'Invalid or missing ID' }, { status: 400 });
        }

        const body = await req.json();
        const updatedImage = await Image.findByIdAndUpdate(id, body, { new: true });

        if (!updatedImage) {
            return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
        }

        return NextResponse.json(createResponse(200, 'Image updated successfully', updatedImage, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update image' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json({ success: false, message: 'Invalid or missing ID' }, { status: 400 });
        }

        const deletedImage = await Image.findByIdAndDelete(id);
        if (!deletedImage) {
            return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
        }

        const filePath = path.join(process.cwd(), 'public', deletedImage.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return NextResponse.json(createResponse(200, 'Image deleted successfully', deletedImage, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
    }
}
