import * as request from "request-promise-native";
import { configurator, snooman } from 'a-mirror-util/lib/';

import youtubedl from 'youtube-dl';
import path from 'path';
import util from 'util';
import fs from 'fs';

import { Submission } from "snoowrap";

const processingDir = configurator.file.processingDir;

const apiUrl = configurator.app.apiUrl;

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

    update(options: UpdateOptions) {
        return request.post({
            uri: apiUrl + '/video/update',
            body: {
                ...options,
                token: configurator.auth.token,
                redditPostId: this.post.id
            },
            json: true
        });
    }

    async download() {
        await this.update({ status: Status.Downloading })
        try {
            if (!fs.existsSync(processingDir))
                fs.mkdirSync(processingDir);

            let downloadUrl = this.post.url;

            if (downloadUrl.substr(0, 18) === 'https://v.redd.it/') // FIXME: this isn't necessary anymore? maybe? who knows. it's undocumented.
                downloadUrl += '/DASHPlaylist.mpd';

            let dl = youtubedl(downloadUrl, [
                '--prefer-ffmpeg',
                '--merge-output-format=mp4'
            ], {
                    cwd: processingDir
                });
            dl.pipe(fs.createWriteStream(this.processingPath));
            await new Promise<any>((success, fail) => {
                dl.on('end', success);
                dl.on('error', fail);
            });
            console.log(`done downloading ${this.redditPostId}, updating status`);
            await this.update({ status: Status.Downloaded });
        } catch (err) {
            fs.unlinkSync(this.processingPath);
            throw err;
        }
    }

    upload() {
        let fileName = path.basename(this.processingPath);

        let readStream = fs.createReadStream(this.processingPath, { flags: 'r+' });
        return request.post({
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
            fs.unlinkSync(this.processingPath);
            console.log(`finished upload for ${this.redditPostId}. processing path: ${this.processingPath}`);
        })
        .catch(err => {
            readStream.destroy();
            fs.unlinkSync(this.processingPath);
            throw err;
        });
    }

    /**
     * Replies to the specified post with the specified message
     * @param message The message to respond with
     */
    reply(message: string) {
        return this.post.reply(
            `${message}
                
[^share ^your ^thoughts](https://reddit.com/message/compose/?to=Clutch_22&subject=a-mirror-bot%20feedback) ^| [^look ^at ^my ^my ^programming?](https://amirror.link/source)`);
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
                    if (!res.data) return [];

                    let data = res.data;
                    let i = 0;
                    let total = data.length;

                    data.forEach(videoObj => {
                        Video.findById(videoObj.redditPostId)
                            .then(vid => {
                                videos.push(vid);

                                i++;

                                if (i >= total)
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
                    if (!res.data) return [];

                    let data = res.data;
                    let i = 0;
                    let total = data.length;

                    data.forEach(videoObj => {
                        Video.findById(videoObj.redditPostId)
                            .then(vid => {
                                videos.push(vid);

                                i++;

                                if (i >= total)
                                    success(videos);
                            })
                            .catch(fail);
                    });
                })
                .catch(fail)
        });
    }
}
