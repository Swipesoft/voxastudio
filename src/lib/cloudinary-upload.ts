import cloudinarySignatureHandler from "./sign-cloudinary-params";

// interface for upload result paramters 
interface CloudinaryUploadResult {
  url: string; 
  width: number;
  height: number;
}


export default async function handleCloudinaryUpload(file: File): Promise<CloudinaryUploadResult> {
  const { signature, timestamp, folder, upload_preset } = cloudinarySignatureHandler();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error("Missing CLOUDINARY_CLOUD_NAME environment variable");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("folder", folder);
  formData.append("upload_preset", upload_preset);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY || "");

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("API Key:", process.env.CLOUDINARY_API_KEY);

  console.log(data); 
  if (!data.secure_url) {
    throw new Error("Upload failed");
  }
  // Return the URL and dimensions of the uploaded image
  const result: CloudinaryUploadResult = {
          url: data.secure_url, 
          width: data.width,
          height: data.height
  }; 


  return result; 
}
