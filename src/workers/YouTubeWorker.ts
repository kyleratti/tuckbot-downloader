import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import { Video } from './objects/video';

export interface ConfigOptions {
    /** The Video object this worker is attached to */
    video: Video,
    /** The full path to the temporary folder for this video file */
    tempFolder: string,
    /** The file name with extension */
    fileName: string,
}

export class YouTubeWorker {
    /** The Video object this worker is attached to */
    video: Video;
    /** The full path to the temporary folder of the video file */
    tempFolder: string;
    /** The file name with extension */
    fileName: string;

    constructor(options:ConfigOptions) {
        this.video = options.video;
        this.tempFolder = options.tempFolder;
        this.fileName = options.fileName;
    }

    /**
     * Cleans up any left over temp files
     */
    cleanup() {
        let filePath = path.resolve(this.tempFolder, this.fileName);

        if(fs.existsSync(filePath))
            fs.unlinkSync(filePath);
    }

    /**
     * Start the download and conversion process
     */
    start() {
        return new Promise((success, fail) => {
            if(!fs.existsSync(this.tempFolder))
                fs.mkdirSync(this.tempFolder);
            let filePath = path.resolve(this.tempFolder, this.fileName);

            ytdl(this.video.post.url, {filter: (format) => format.container === 'mp4'})
                .on('error', (e) => {
                    this.cleanup();

                    fail(e);
                })
                .pipe(fs.createWriteStream(filePath))
                .on('finish', () => {
                    success();
                });
        });
    }
}
