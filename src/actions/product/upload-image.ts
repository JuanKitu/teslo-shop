'use server';
import {v2 as cloudinary} from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export async function uploadImages(images: File[]) {
    try {
        return await Promise.all(
            images.map(async (file) => {
                const buffer = await file.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                const res = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`);
                return res.secure_url;
            })
        );
    } catch (error) {
        console.log(error);
        return [];
    }
}