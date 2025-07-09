import Together from "together-ai"; 

export function getTogether(userAPIKey:string | null): Together { 
    //re-declare first constructor paramter of Together as object type
    const options: ConstructorParameters<typeof Together>[0] = {}; 

    // if HELICONE_API_KEY is available, use for telemetry/logging
    if (process.env.HELICONE_API_KEY) {
        options.baseURL = "https://together.helicone.ai/v1"; 
        options.defaultHeaders = {
            "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
            "Helicone-Property-BYOK": userAPIKey ? "true" : "false",
            "Helicone-Property-appname": "VoxaStudio",
            "Helicone-Property-environment":
            process.env.VERCEL_ENV === "production" ? "prod" : "dev",
        }; 
    }

    //conditional checking for Together API key (i.e cases where Flux-Kontext-pro is used)
    if (userAPIKey) {
        options.apiKey = userAPIKey;
    }

    const together = new Together(options);

    return together;
}

