"use server"; 

import { get } from "http";
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

}