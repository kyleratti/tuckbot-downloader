import * as request from "request-promise-native";
import { Submission } from "snoowrap";
export declare enum Status {
    NewRequest = 0,
    Downloading = 10,
    Downloaded = 11,
    Transcoding = 20,
    LocallyMirrored = 40,
    PostedLocalMirror = 50,
    DownloadingFailed = 100,
    VideoUnavailable = 101,
    TranscodingFailed = 200
}
export declare enum StorageLocation {
    Local = 0
}
export interface UpdateOptions {
    /** The status of the video */
    status?: Status;
    /** The number of views the video has */
    views?: number;
    /** The date/time of the last view */
    lastView?: Date;
    /** Whether or not the mirror has been posted */
    posted?: boolean;
}
export declare class Video {
    /** The snoowrap post object */
    post: Submission;
    /** The unique reddit post id */
    redditPostId: string;
    /** The processing path to the file */
    private processingPath;
    /**
     * Creates a new Video object
     * @param identifier The unique identifier of the post (either a snoowrap post object or a reddit post id)
     */
    constructor(post: Submission);
    /**
     * Determines whether or not this video exists in the database
     * @returns Whether or not this video exists in the database
     */
    exists(): request.RequestPromise<any>;
    create(): request.RequestPromise<any>;
    update(options: UpdateOptions): request.RequestPromise<any>;
    download(): Promise<void>;
    upload(): Promise<void>;
    /**
     * Replies to the specified post with the specified message
     * @param message The message to respond with
     */
    reply(message: string): Promise<import("../../../../../Documents/GitHub/a-mirror-downloader/node_modules/snoowrap/dist/objects/ReplyableContent").default<Submission>>;
    /**
     * Finds the video by specified id
     * @param redditPostId The unique reddit post id
     */
    static findById(redditPostId: any): Promise<{}>;
    /**
     * Finds all videos whose 'status' is Status.NewRequest
     * @returns An array of Video objects
     */
    static findNew(): Promise<Video[]>;
    /**
     * Finds all posts that are mirrored but need the reply comment sent out
     */
    static findUnpostedMirrored(): Promise<Video[]>;
}
