export interface SDRequest {
    prompt: string;
    negative_prompt?: string;
    styles?: string[];
    seed: number;
    sampler_name: string;
    scheduler: string;
    steps: number;
    cfg_scale: number;
    width: number;
    height: number;
}