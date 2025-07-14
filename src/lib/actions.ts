
"use server"; 

// import util functions from other files 
import { getAdjustedDimensions } from "./get-adjusted-dimensions";
import { getTogether } from "./get-together"; 
import { getIPAddress, getRateLimiter } from "./rate-limiter";

// import packages 
import {z} from "zod"; 

//declare rate limit 
const ratelimit = getRateLimiter();   

// define schema for input validation 
const schema = z.object({
    imageUrl: z.string(), 
    prompt: z.string(), 
    width: z.number(), 
    height: z.number(),
    userAPIKey: z.string().nullable(),
    model: z.enum([
        "black-forest-labs/FLUX.1-kontext-dev",
        "black-forest-labs/FLUX.1-kontext-pro", 
    ]).default("black-forest-labs/FLUX.1-kontext-dev"),

}); 

// decalare type for API response 
type ApiResponse = {
  index: number;
  url: string | null;
  timings: { inference: number } | Record<string, unknown>;
};


// declare image generation function 
export async function generateImage(
    input: z.infer<typeof schema>, 
): Promise<{success:true; url:string} | {success:false; error: string}>{
   const {imageUrl, prompt, width, height, userAPIKey, model} = schema.parse(input);
   
   if (ratelimit && !userAPIKey) {
    const ipAddress = await getIPAddress();
    const {success} = await ratelimit.limit(ipAddress); 
    if (!success) {
        return {
            success: false, 
            error: "Rate limit exceeded. Please try again later.",
        }; 
    }

   }

   const together  = getTogether(userAPIKey); 
   const adjustedDimensions = getAdjustedDimensions(width, height);

   // declare undefined variable for generated image URL 
   let url: string | undefined = undefined; 

   // revise prompt 
   const finalPrompt = `Edit this image: ${prompt}`;
   // try generating image using Together API
   try {
    const response = await together.images.create({
        model, 
        prompt: finalPrompt, 
        width: adjustedDimensions.width,
        height: adjustedDimensions.height,
        image_url: imageUrl,
    }); 

    const item = response.data[0]; 
    
    // runtime check + cast
  if (
    item &&
    typeof item === 'object' &&
    'url' in item &&
    'timings' in item &&
    item.timings &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (item as any).timings.inference === 'number') {
    const response_data = item as ApiResponse;
    console.log('Response Data:', response_data);
    url = response_data.url ?? undefined;
  }

    

  } catch (e: unknown) {
  if (typeof e === "string" && e.includes("403")) {
    return {
      success: false,
      error: "Rate limit exceeded. Please try again later or Use your Together API key.",
    };
  }

  if (e instanceof Error && e.message.includes("403")) {
    return {
      success: false,
      error: "Rate limit exceeded. Please try again later or Use your Together API key.",
    };
  }

  console.log(e);
}


   if (url){
    return {
        success: true, 
        url
    };  
   } else {
    return {
        success: false, 
        error: "Image generation failed. Please try again later.",
    }; 
   }

}