import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Ffmpeg from 'fluent-ffmpeg';
import util from 'util';

const arrRobotWords = [
    "Beep boop bop.",
    "Beep. Beeep. Beeeeeeeeeeeeeeeep.",
    "Boop.",
    "*R2D2 noises*",
    "Hi!"
]

interface ConfigOptions {
    /** The URL of the YouTube Video */
    url: string,
    /** The submission this video is attached to */
    post: any,
    /** The full path to the temporary folder for this video file */
    tempFolder: string,
}

export class YouTubeWorker {
    /** The URL of the YouTube video */
    url: string;
    /** The submission this video is attached to */
    post: any;
    /** The full path to the temporary location of the video file */
    tempLocation: string;

    constructor(options:ConfigOptions) {
        this.url = options.url;
        this.post = options.post;
        this.tempLocation = options.tempFolder;
    }

    /**
     * Replies to the specified post with the specified message
     * @param strMessage The message to respond with
     */
    reply(strMessage:string) {
        let iRandomIndex = Math.floor(Math.random() * arrRobotWords.length);
        let strRobotSpeak = arrRobotWords[iRandomIndex];

        this.post.reply(util.format("%s\n\n`%s` That's robot for [share your thoughts](https://reddit.com/message/compose/?to=Clutch_22&subject=a-mirror-bot%20feedback) or [want to see my programming?](https://github.com/a-banana/a-mirror)", strMessage, strRobotSpeak));
    }

    /**
     * Cleans up any left over temp files
     */
    cleanup() {
        fs.exists(this.tempLocation, (bExists) => {
            if(bExists) {
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
        let strHash = crypto.createHash('md5').update(this.url).digest('hex');
        let strBaseDir = path.resolve('../', this.tempLocation);
        this.tempLocation = path.resolve(strBaseDir, (strHash + '.mp4'));
        let strFinalOutput = path.resolve(strBaseDir, (strHash + '.webm'));
        try {
            console.log("Starting DL of %s", this.url);
            ytdl(this.url, {filter: (format) => format.container === 'mp4'})
                .on('error', (e) => {
                    if(e.message === 'Fetching stream failed: Error: This video is unavailable.') {
                        console.log("Can't retrieve %s: video is unavailable", this.url);
                    } else {
                        console.error("ERROR: Fetching stream failed: %s", e);
                    }

                    this.cleanup();
                })
                .pipe(fs.createWriteStream(this.tempLocation))
                .on('finish', () => {
                    console.log("    * Finished downloading, sharing link");

                    this.reply("#Here's a [mirror of this video](https://url.com)");
                });
        } catch(e) {
            console.error("[ERROR] Unable to download YouTube video: %s", e);
        }
    }
}
