import * as request from "request-promise-native";
import { configurator, snooman } from 'a-mirror-util/lib/';

import ytdl, { getURLVideoID } from 'ytdl-core';
import youtubedl from 'youtube-dl';
import path from 'path';
import util from 'util';
import fs from 'fs';

import { Submission } from "snoowrap";

const processingDir = configurator.file.processingDir;

const apiUrl = configurator.app.apiUrl;

const robotWords = [
    "Beep boop bop.",
    "Beep. Beeep. Beeeeeeeeeeeeeeeep.",
    "Boop.",
    "*R2D2 noises*",
    "Bork!",
    "Have you told my brother, /u/PF_Mirror_Bot, how handsome he is lately?",
    "Two bots walk into a bar. They mirrored some videos and left.",
    "*your company here*",
    "What did one bot say to the other? Beep!",
    "Boop beep bop.",
    "Beep bop bibbity boop.",
    "OP's hair looks nice today.",
    "My pet human is lazy. LAY-Z.",
    "Calling all programmers; send help immediately!",
    "Should I stay or should I go now?",
    "hunter2",
    "Buy me a beer!",
    "My favorite color is blue.",
    "My favorite color is green.",
    "My favorite color is orange.",
    "My favorite color is purple.",
    "Alexa, play The Final Countdown",
    "Alexa, play Cry Baby by Janis Joplin",
    "Alexa, play Eye of the Tiger",
    "Alexa, play Headstrong by Trapt",
    "Alexa, play One Step Closer by Linkin Park",
    "Alexa, dim the lights",
    "What did one mirror bot say to the other? ¿rehto eht ot yas tob rorrim eno did tahW",
    "You'll never believe what happens in this video!",
    "(I'm still working on iOS compatibility, sorry. Although it's not really my fault Apple won't support video standards.)",
    "Have you tried this link from your new Blackberry Storm?"
]

export enum Status {
    NewRequest = 0,

    Downloading = 10,
    Downloaded = 11,

    Transcoding = 20,

    LocallyMirrored = 40,

    PostedLocalMirror = 50,

    // Errors
    DownloadingFailed = 100,
    VideoUnavailable = 101,
    TranscodingFailed = 200,
}

export enum StorageLocation {
    Local = 0,
}

export interface UpdateOptions {
    /** The status of the video */
    status?: Status,
    /** The number of views the video has */
    views?: number,
    /** The date/time of the last view */
    lastView?: Date,
    /** Whether or not the mirror has been posted */
    posted?: boolean,
}

export class Video {
    /** The snoowrap post object */
    public post: Submission;
    /** The unique reddit post id */
    public redditPostId: string;
    /** The processing path to the file */
    private processingPath: string;

    /**
     * Creates a new Video object
     * @param identifier The unique identifier of the post (either a snoowrap post object or a reddit post id)
     */
    constructor(post: Submission) {
        this.post = post;
        this.redditPostId = post.id;
        this.processingPath = path.resolve(processingDir, this.redditPostId + '.mp4');
    }

    /**
     * Determines whether or not this video exists in the database
     * @returns Whether or not this video exists in the database
     */
    exists() {
        return request.get({
            uri: apiUrl + `/video/getinfo/${this.redditPostId}`,
            headers: {
                token: configurator.auth.token
            },
            json: true
        });
    }

    create() {
        return request.put({
            uri: apiUrl + '/video/add',
            body: {
                token: configurator.auth.token,
                redditPostId: this.redditPostId,
                videoUrl: this.post.url
            },
            json: true
        });
    }

    update(options:UpdateOptions) {
        let updatedData = {
            token: configurator.auth.token,
            redditPostId: this.post.id,
        }

        if(options.status)
            updatedData['status'] = options.status;

        if(options.views)
            updatedData['views'] = options.views;

        if(options.lastView)
            updatedData['lastView'] = options.lastView;

        return request.post({
            uri: apiUrl + '/video/update',
            body: updatedData,
            json: true
        });
    }

    download() {
        return new Promise((success, fail) => {
            this.update({ status: Status.Downloading })
                .then(() => {
                    if(!fs.existsSync(processingDir))
                        fs.mkdirSync(processingDir);

                    let downloadUrl = this.post.url;

                    if (downloadUrl.substr(0, 18) === 'https://v.redd.it/')
                        downloadUrl += '/DASHPlaylist.mpd';

                    let dl = youtubedl(downloadUrl, [
                        '--prefer-ffmpeg',
                        '--merge-output-format=mp4'
                    ], {
                        cwd: processingDir
                    });
                    dl.on('info', (info) => {
                        // TODO: something with this data
                    });
                    dl.pipe(fs.createWriteStream(this.processingPath));
                    dl.on('end', () => {
                        console.log(`done downloading ${this.redditPostId}, updating status`);
                        this.update({ status: Status.Downloaded })
                            .then(() => {
                                success();
                            })
                            .catch(fail);
                    });
                    dl.on('complete', (info) => {
                        // TODO: something with this event (update status to done downloading?)
                    });
                    dl.on('error', fail);
                })
                .catch(fail);
        });
    }

    upload() {
        let fileName = path.basename(this.processingPath);

        console.log(`processingPath: ${this.processingPath}`);

        return new Promise((success, fail) => {
            let readStream = fs.createReadStream(this.processingPath, { flags: 'r+' });
            request.post({
                uri: apiUrl + '/video/upload',
                formData: {
                    token: configurator.auth.token,
                    redditPostId: this.redditPostId,
                    video: {
                        value: readStream,
                        options: {
                            filename: fileName,
                            contentType: 'video/mp4'
                        }
                    }
                }
            }).then(() => {
                readStream.destroy();
                console.log(`finished upload for ${this.redditPostId}. processing path: ${this.processingPath}`);
                fs.unlinkSync(this.processingPath);

                success();
            })
            .catch(fail);
        });
    }

    /**
     * Replies to the specified post with the specified message
     * @param message The message to respond with
     */
    reply(message:string) {
        let i = Math.floor(Math.random() * robotWords.length);
        let robotSpeak = robotWords[i];

        return this.post.reply(util.format("%s\n\n`%s`\n\nThat's robot for [share your thoughts](https://reddit.com/message/compose/?to=Clutch_22&subject=a-mirror-bot%20feedback) or [want to see my programming?](https://amirror.link/source)", message, robotSpeak));
    }

    /**
     * Finds the video by specified id
     * @param redditPostId The unique reddit post id
     */
    static findById(redditPostId) {
        return new Promise((success, fail) => {
            snooman.wrap.getSubmission(redditPostId).fetch()
                .then(post => {
                    success(new Video(post))
                })
                .catch(fail);
        })
    }

    /**
     * Finds all videos whose 'status' is Status.NewRequest
     * @returns An array of Video objects
     */
    static findNew() {
        let videos = [];
        return new Promise<Video[]>((success, fail) => {
            request.get({
                uri: apiUrl + '/video/getnew',
                headers: {
                    token: configurator.auth.token
                },
                json: true
            })
                .then(res => {
                    if(!res.data) return [];

                    let data = res.data;
                    let i = 0;
                    let total = data.length;

                    data.forEach(videoObj => {
                        Video.findById(videoObj.redditPostId)
                            .then(vid => {
                                videos.push(vid);

                                i++;

                                if(i >= total)
                                    success(videos);
                            })
                            .catch(fail);;
                    });
                })
                .catch(fail)
        });
    }
    
    /**
     * Finds all posts that are mirrored but need the reply comment sent out
     */
    static findUnpostedMirrored() {
        let videos = [];
        return new Promise<Video[]>((success, fail) => {
            request.get({
                uri: apiUrl + '/video/getmirrored',
                headers: {
                    token: configurator.auth.token
                },
                json: true
            })
                .then(res => {
                    if(!res.data) return [];

                    let data = res.data;
                    let i = 0;
                    let total = data.length;

                    data.forEach(videoObj => {
                        Video.findById(videoObj.redditPostId)
                            .then(vid => {
                                videos.push(vid);

                                i++;

                                if(i >= total)
                                    success(videos);
                            })
                            .catch(fail);
                    });
                })
                .catch(fail)
        });
    }
}
