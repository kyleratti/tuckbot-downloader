"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = __importStar(require("request-promise-native"));
const lib_1 = require("a-mirror-util/lib/");
const youtube_dl_1 = __importDefault(require("youtube-dl"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
const processingDir = lib_1.configurator.file.processingDir;
const apiUrl = lib_1.configurator.app.apiUrl;
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
    "Beep bop bibbity zam."
];
var Status;
(function (Status) {
    Status[Status["NewRequest"] = 0] = "NewRequest";
    Status[Status["Downloading"] = 10] = "Downloading";
    Status[Status["Downloaded"] = 11] = "Downloaded";
    Status[Status["Transcoding"] = 20] = "Transcoding";
    Status[Status["LocallyMirrored"] = 40] = "LocallyMirrored";
    Status[Status["PostedLocalMirror"] = 50] = "PostedLocalMirror";
    // Errors
    Status[Status["DownloadingFailed"] = 100] = "DownloadingFailed";
    Status[Status["VideoUnavailable"] = 101] = "VideoUnavailable";
    Status[Status["TranscodingFailed"] = 200] = "TranscodingFailed";
})(Status = exports.Status || (exports.Status = {}));
var StorageLocation;
(function (StorageLocation) {
    StorageLocation[StorageLocation["Local"] = 0] = "Local";
})(StorageLocation = exports.StorageLocation || (exports.StorageLocation = {}));
class Video {
    /**
     * Creates a new Video object
     * @param identifier The unique identifier of the post (either a snoowrap post object or a reddit post id)
     */
    constructor(post) {
        this.post = post;
        this.redditPostId = post.id;
        this.processingPath = path_1.default.resolve(processingDir, this.redditPostId + '.mp4');
    }
    /**
     * Determines whether or not this video exists in the database
     * @returns Whether or not this video exists in the database
     */
    exists() {
        return request.get({
            uri: apiUrl + `/video/getinfo/${this.redditPostId}`,
            headers: {
                token: lib_1.configurator.auth.token
            },
            json: true
        });
    }
    create() {
        return request.put({
            uri: apiUrl + '/video/add',
            body: {
                token: lib_1.configurator.auth.token,
                redditPostId: this.redditPostId,
                videoUrl: this.post.url
            },
            json: true
        });
    }
    update(options) {
        let updatedData = {
            token: lib_1.configurator.auth.token,
            redditPostId: this.post.id,
        };
        if (options.status)
            updatedData['status'] = options.status;
        if (options.views)
            updatedData['views'] = options.views;
        if (options.lastView)
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
                if (!fs_1.default.existsSync(processingDir))
                    fs_1.default.mkdirSync(processingDir);
                let downloadUrl = this.post.url;
                if (downloadUrl.substr(0, 18) === 'https://v.redd.it/')
                    downloadUrl += '/DASHPlaylist.mpd';
                let dl = youtube_dl_1.default(downloadUrl, [
                    '--prefer-ffmpeg',
                    '--merge-output-format=mp4'
                ], {
                    cwd: processingDir
                });
                dl.on('info', (info) => {
                    // TODO: something with this data
                });
                dl.pipe(fs_1.default.createWriteStream(this.processingPath));
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
        let fileName = path_1.default.basename(this.processingPath);
        console.log(`processingPath: ${this.processingPath}`);
        return new Promise((success, fail) => {
            request.post({
                uri: apiUrl + '/video/upload',
                formData: {
                    token: lib_1.configurator.auth.token,
                    redditPostId: this.redditPostId,
                    video: {
                        value: fs_1.default.createReadStream(this.processingPath, { flags: 'r+' }),
                        options: {
                            filename: fileName,
                            contentType: 'video/mp4'
                        }
                    }
                }
            }).then(() => {
                if (fs_1.default.existsSync(this.processingPath))
                    fs_1.default.unlinkSync(this.processingPath);
                success();
            })
                .catch(fail);
        });
    }
    /**
     * Replies to the specified post with the specified message
     * @param message The message to respond with
     */
    reply(message) {
        let i = Math.floor(Math.random() * robotWords.length);
        let robotSpeak = robotWords[i];
        return this.post.reply(util_1.default.format("%s\n\n`%s`\n\nThat's robot for [share your thoughts](https://reddit.com/message/compose/?to=Clutch_22&subject=a-mirror-bot%20feedback) or [want to see my programming?](https://amirror.link/source)", message, robotSpeak));
    }
    /**
     * Finds the video by specified id
     * @param redditPostId The unique reddit post id
     */
    static findById(redditPostId) {
        return new Promise((success, fail) => {
            lib_1.snooman.wrap.getSubmission(redditPostId).fetch()
                .then(post => {
                success(new Video(post));
            });
        });
    }
    /**
     * Finds all videos whose 'status' is Status.NewRequest
     * @returns An array of Video objects
     */
    static findNew() {
        let videos = [];
        return new Promise((success, fail) => {
            request.get({
                uri: apiUrl + '/video/getnew',
                headers: {
                    token: lib_1.configurator.auth.token
                },
                json: true
            })
                .then(res => {
                if (!res.data)
                    return [];
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
                    ;
                });
            })
                .catch(fail);
        });
    }
    /**
     * Finds all posts that are mirrored but need the reply comment sent out
     */
    static findUnpostedMirrored() {
        let videos = [];
        return new Promise((success, fail) => {
            request.get({
                uri: apiUrl + '/video/getmirrored',
                headers: {
                    token: lib_1.configurator.auth.token
                },
                json: true
            })
                .then(res => {
                if (!res.data)
                    return [];
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
                .catch(fail);
        });
    }
}
exports.Video = Video;
//# sourceMappingURL=video.js.map