import {v2 as cloudinary} from 'cloudinary';
//import { time } from 'console';

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
    const upload_preset: string ='ml_default'; // 'secure_preset';  //required for unsigned uploads
    const signatureParams = { 
        timestamp,
        folder, 
        upload_preset,
    }; 
    const cloud_api_secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud_api_secret) {
        throw new Error("Missing CLOUDINARY_API_SECRET environment variable");
    }
    // Generate the signature using Cloudinary's API secret
    const signature = cloudinary.utils.api_sign_request(
        signatureParams, 
        cloud_api_secret,
    );

    console.log("generated Cloudinary Signature:", signature);

    return { signature, timestamp, folder, upload_preset };
}   