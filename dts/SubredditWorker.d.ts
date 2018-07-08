export declare class SubredditWorker {
    /** The name of the subreddit */
    subName: string;
    /** The snoostorm to work with */
    storm: snoostorm;
    /** The submission stream */
    stream: snoostorm["SubmissionStream"];
    /**
     * Create a new subreddit worker
     * @param strSubName The name of the subreddit to work on
     */
    constructor(strSubName: string, objStorm: snoostorm);
    start(): void;
    stop(): void;
    on(callback: {}): void;
}
