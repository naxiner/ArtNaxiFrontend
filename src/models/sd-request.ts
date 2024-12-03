export interface SDRequest {
    prompt: string;
    negativePrompt?: string;
    styles?: string[];
    seed: number;
    samplerName: string;
    scheduler: string;
    steps: number;
    cfgScale: number;
    width: number;
    height: number;
}