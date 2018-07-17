import * as request from "request-promise-native";
import * as configurator from '../configurator';
import { wrap } from "..";

import ytdl from 'ytdl-core';
import path from 'path';
import util from 'util';
import fs from 'fs';

import { YouTubeWorker } from "../YouTubeWorker";
import { Submission } from "../../node_modules/@types/snoowrap";

const config = configurator.load();
const apiUrl = config.app.apiUrl;

const robotWords = [
    "Beep boop bop.",
    "Beep. Beeep. Beeeeeeeeeeeeeeeep.",
    "Boop.",
    "*R2D2 noises*",
    "Bork!"
]

export enum Status {
    NewRequest = 0,
    Downloading = 10,
    Transcoding = 20,

    LocallyMirrored = 40,

    PostedLocalMirror = 50,

    // Errors
    DownloadingFailed = 100,
    VideoUnavailable = 101,
    TranscodingFailed = 200,
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
    public post:Submission;
    /** The unique reddit post id */
    public redditPostId:string;

    /**
     * Creates a new Video object
     * @param identifier The unique identifier of the post (either a snoowrap post object or a reddit post id)
     */
    constructor(post:Submission) {
        this.post = post;
        this.redditPostId = post.id;
    }

    /**
     * Determines whether or not this video exists in the database
     * @returns Whether or not this video exists in the database
     */
    exists() {
        return new Promise((success, fail) => {
            request.get({
                uri: apiUrl + `/video/getinfo/${this.redditPostId}`,
                headers: {
                    token: config.app.auth.token
                },
                json: true
            })
                .then(success)
                .catch(fail);
        });
    }

    create() {
        return new Promise((success, fail) => {
            request.put({
                uri: apiUrl + '/video/add',
                body: {
                    token: config.app.auth.token,
                    redditPostId: this.redditPostId,
                    videoUrl: this.post.url
                },
                json: true
            })
                .then(success)
                .catch(fail);
        });
    }

    update(options:UpdateOptions) {
        return new Promise((success, fail) => {
            let updatedData = {
                token: config.app.auth.token,
                redditPostId: this.post.id,
            }

            if(options.status)
                updatedData['status'] = options.status;

            if(options.views)
                updatedData['views'] = options.views;

            if(options.lastView)
                updatedData['lastView'] = options.lastView;

            request.post({
                uri: apiUrl + '/video/update',
                body: updatedData,
                json: true
            })
                .then(success)
                .catch(fail);
        });
    }

    download() {
        return new Promise((success, fail) => {
            this.update({status: Status.Downloading});

            this.post.fetch().then((obj) => {
                if(ytdl.validateURL(obj.url)) {
                    let worker = new YouTubeWorker({
                        video: this,
                        tempFolder: '/tmp/videos/',
                        fileName: this.redditPostId + '.mp4'
                    });
                    worker.start()
                        .then(success)
                        .catch(fail);
                } else {
                    console.error(`invalid video type for ${obj.url}`);
                }
            });
        });
    }

    upload() {
        let fileName = this.redditPostId + '.mp4';
        let filePath = path.resolve('/tmp/videos/', fileName);

        return new Promise((success, fail) => {
            request.put({
                uri: apiUrl + '/video/upload',
                formData: {
                    token: config.app.auth.token,
                    redditPostId: this.redditPostId,
                    video: {
                        value: fs.createReadStream(filePath),
                        options: {
                            filename: fileName,
                            contentType: fileName === '.mp4' ? 'video/mp4' : 'video/webm'
                        }
                    }
                }
            })
                .then(() => {
                    let filePath = path.resolve('/tmp/videos/', this.redditPostId + '.mp4');
                    fs.exists(filePath, (exists) => {
                        if(exists)
                            fs.unlink(filePath, (e) => {
                                console.error("Can't remove temp file: %s", e);
                            });
                    });
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

        return this.post.reply(util.format("%s\n\n`%s`\n\nThat's robot for [share your thoughts](https://reddit.com/message/compose/?to=Clutch_22&subject=a-mirror-bot%20feedback) or [want to see my programming?](https://github.com/a-banana/a-mirror)", message, robotSpeak));
    }

    static findById(redditPostId) {
        return new Promise((success, fail) => {
            wrap.getSubmission(redditPostId).fetch()
                .then(post => {
                    success(new Video(post))
                });
        });
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
                    token: config.app.auth.token
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
                            });
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
                    token: config.app.auth.token
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
                            });
                    });
                })
                .catch(fail)
        });
    }
}