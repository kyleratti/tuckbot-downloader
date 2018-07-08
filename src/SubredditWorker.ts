export class SubredditWorker {
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
    constructor(strSubName:string, objStorm:snoostorm) {
        this.subName = strSubName;
    }

    start() {
        this.stream = this.storm.SubmissionStream({
            subreddit: this.subName,
            results: 10,
            pollTime: 1000 * 2
        });
    }

    stop() {
        this.stream.emit("stop");
    }

    on(callback: {}) {
    };
}
