export interface SDRequest {
    prompt: string;
    negativePrompt?: string;
    styles?: string[];
    seed: number;
    samplerName: string;
    scheduler: string;
    steps: number;
    cfg_scale: number;
    width: number;
    height: number;
}