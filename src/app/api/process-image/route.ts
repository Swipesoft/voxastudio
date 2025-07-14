import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/actions";
import handleCloudinaryUpload from "@/lib/cloudinary-upload";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const prompt = formData.get("prompt") as string;
    const userAPIKey = formData.get("userAPIKey") as string | null;
    //const model = formData.get("model") as string || "black-forest-labs/FLUX.1-schnell";

    // Validate required fields
    if (!file || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: file and prompt" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image." },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const uploadResult = await handleCloudinaryUpload(file);
    
    if (!uploadResult.url) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Generate processed image using Together AI
    const result = await generateImage({
      imageUrl: uploadResult.url,
      prompt: prompt,
      width: uploadResult.width,
      height: uploadResult.height,
      userAPIKey: userAPIKey,
      model: "black-forest-labs/FLUX.1-kontext-dev", 
    });

    // model as "black-forest-labs/FLUX.1-kontext-dev" | "black-forest-labs/FLUX.1-kontext-pro",
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      originalImageUrl: uploadResult.url,
      processedImageUrl: result.url,
      dimensions: {
        width: uploadResult.width,
        height: uploadResult.height,
      },
    });

  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



