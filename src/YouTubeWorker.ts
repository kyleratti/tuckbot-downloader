import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import { Video } from './objects/video';

export interface ConfigOptions {
    /** The Video object this worker is attached to */
    video: Video,
    /** The full path to the temporary folder for this video file */
    tempFolder: string,
}

export class YouTubeWorker {
    /** The Video object this worker is attached to */
    video: Video;
    /** The full path to the temporary location of the video file */
    tempLocation: string;

    constructor(options:ConfigOptions) {
        this.video = options.video;
        this.tempLocation = options.tempFolder;
    }

    /**
     * Cleans up any left over temp files
     */
    cleanup() {
        fs.exists(this.tempLocation, (exists) => {
            if(exists) {
                fs.unlink(this.tempLocation, (e) => {
                    console.error("Can't remove temp file: %s", e);
                });
            }
        });
    }

    /**
     * Start the download and conversion process
     */
    start() {
        return new Promise((success, fail) => {
            let strBaseDir = path.resolve('../', this.tempLocation);
            this.tempLocation = path.resolve(strBaseDir, (this.video.redditPostId + '.mp4'));

            ytdl(this.video.post.url, {filter: (format) => format.container === 'mp4'})
                .on('error', (e) => {
                    fail(e);

                    this.cleanup();
                })
                .pipe(fs.createWriteStream(this.tempLocation))
                .on('finish', () => {
                    success();
                });
        });
    }
}
