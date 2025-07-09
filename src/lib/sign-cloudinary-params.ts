import {v2 as cloudinary} from 'cloudinary';
import { time } from 'console';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET ,
}); 

export default function cloudinarySignatureHandler(): {
  signature: string;
  timestamp: number;
  folder: string;
  upload_preset: string;
} {
    // get timestamp for signature 
    const  timestamp = Math.round(new Date().getTime() / 1000);
    const folder: string = 'voxastudio-images';
    const upload_preset: string = 'secure_preset';  //required for unsigned uploads
    const signatureParams = { 
        timestamp,
        folder, 
        upload_preset
    }; 
    // Generate the signature using Cloudinary's API secret
    const signature = cloudinary.utils.api_sign_request(
        signatureParams, 
        process.env.CLOUDINARY_API_SECRET 
    );

    return { signature, timestamp, folder, upload_preset };
}   