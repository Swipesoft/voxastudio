import {Ratelimit} from '@upstash/ratelimit'; 
import {Redis} from '@upstash/redis'; 
import {headers} from 'next/headers'; 
import "server-only"; 

export function getRateLimiter() {
    let ratelimit: Ratelimit  | undefined; 

    // redis object instance from environment variables 
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    // Add rate limiting if Upstash API keys are set, otherwise skip 
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        ratelimit = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(50, '1 d'), // 10 requests per day
            analytics: true,
            prefix: 'voxastudio',
        });
    }

    return ratelimit;

}


export async function getIPAddress(){
    const FALLBACK_IP_ADDRESS : string= "0.0.0.0"; 
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for'); 

    if (forwardedFor){
        return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS; 

    }

    return headersList.get('x-real-ip') ?? FALLBACK_IP_ADDRESS;

}