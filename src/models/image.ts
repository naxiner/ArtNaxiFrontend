import { SDRequest } from "./sd-request";

export interface Image {
    id: string,
    url: string,
    creationTime: Date,
    userId: string,
    request: SDRequest,
    isPublic: boolean
}