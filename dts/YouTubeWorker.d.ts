interface ConfigOptions {
    /** The URL of the YouTube Video */
    url: string;
    /** The submission this video is attached to */
    post: any;
    /** The full path to the temporary folder for this video file */
    tempFolder: string;
}
export declare class YouTubeWorker {
    /** The URL of the YouTube video */
    url: string;
    /** The submission this video is attached to */
    post: any;
    /** The full path to the temporary location of the video file */
    tempLocation: string;
    constructor(options: ConfigOptions);
    /**
     * Replies to the specified post with the specified message
     * @param strMessage The message to respond with
     */
    reply(strMessage: string): void;
    /**
     * Cleans up any left over temp files
     */
    cleanup(): void;
    /**
     * Start the download and conversion process
     */
    start(): void;
}
export {};
