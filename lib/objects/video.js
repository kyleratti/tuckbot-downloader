"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const fs_1 = __importDefault(require("fs"));
const processingDir = lib_1.configurator.file.processingDir;
const apiUrl = lib_1.configurator.app.apiUrl;
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
        return request.post({
            uri: apiUrl + '/video/update',
            body: Object.assign({}, options, { token: lib_1.configurator.auth.token, redditPostId: this.post.id }),
            json: true
        });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update({ status: Status.Downloading });
            try {
                if (!fs_1.default.existsSync(processingDir))
                    fs_1.default.mkdirSync(processingDir);
                let downloadUrl = this.post.url;
                if (downloadUrl.substr(0, 18) === 'https://v.redd.it/') // FIXME: this isn't necessary anymore? maybe? who knows. it's undocumented.
                    downloadUrl += '/DASHPlaylist.mpd';
                let dl = youtube_dl_1.default(downloadUrl, [
                    '--prefer-ffmpeg',
                    '--merge-output-format=mp4'
                ], {
                    cwd: processingDir
                });
                dl.pipe(fs_1.default.createWriteStream(this.processingPath));
                yield new Promise((success, fail) => {
                    dl.on('end', success);
                    dl.on('error', fail);
                });
                console.log(`done downloading ${this.redditPostId}, updating status`);
                yield this.update({ status: Status.Downloaded });
            }
            catch (err) {
                fs_1.default.unlinkSync(this.processingPath);
                throw err;
            }
        });
    }
    upload() {
        let fileName = path_1.default.basename(this.processingPath);
        let readStream = fs_1.default.createReadStream(this.processingPath, { flags: 'r+' });
        return request.post({
            uri: apiUrl + '/video/upload',
            formData: {
                token: lib_1.configurator.auth.token,
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
            fs_1.default.unlinkSync(this.processingPath);
            console.log(`finished upload for ${this.redditPostId}. processing path: ${this.processingPath}`);
        })
            .catch(err => {
            readStream.destroy();
            fs_1.default.unlinkSync(this.processingPath);
            throw err;
        });
    }
    /**
     * Replies to the specified post with the specified message
     * @param message The message to respond with
     */
    reply(message) {
        return this.post.reply(`${message}
                
            [^share ^your ^thoughts](https://reddit.com/message/compose/?to=Clutch_22&subject=a-mirror-bot%20feedback) ^or [^want ^to ^see ^my ^programming?](https://amirror.link/source)`);
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
            })
                .catch(fail);
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