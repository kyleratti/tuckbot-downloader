export interface VideoData {
    location: string;
    redditPostId: string;
}
export declare class DownloadedVideo {
    location: string;
    redditPostId: string;
    constructor(data: VideoData);
}
