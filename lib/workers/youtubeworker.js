"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DownloadWorker {
    constructor(options) {
        this.video = options.video;
        this.tempFolder = options.tempFolder;
        this.fileName = options.fileName;
    }
    /**
     * Cleans up any left over temp files
     */
    cleanup() {
        let filePath = path_1.default.resolve(this.tempFolder, this.fileName);
        if (fs_1.default.existsSync(filePath))
            fs_1.default.unlinkSync(filePath);
    }
    /**
     * Start the download and conversion process
     */
    start() {
        return new Promise((success, fail) => {
            if (!fs_1.default.existsSync(this.tempFolder))
                fs_1.default.mkdirSync(this.tempFolder);
            let filePath = path_1.default.resolve(this.tempFolder, this.fileName);
            ytdl_core_1.default(this.video.post.url, { filter: (format) => format.container === 'mp4' })
                .on('error', (e) => {
                this.cleanup();
                fail(e);
            })
                .pipe(fs_1.default.createWriteStream(filePath))
                .on('finish', () => {
                success();
            });
        });
    }
}
exports.DownloadWorker = DownloadWorker;
//# sourceMappingURL=youtubeworker.js.map