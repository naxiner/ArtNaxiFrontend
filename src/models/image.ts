import { SDRequest } from "./sd-request";

export interface Image {
    url: string,
    creationTime: Date,
    userId: string,
    sdReques: SDRequest
}