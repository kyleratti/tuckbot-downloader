"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scanner_1 = require("./scanner");
const video_1 = require("../objects/video");
class MirrorRequestScanner extends scanner_1.Scanner {
    constructor(options) {
        super(options);
        console.log(`starting mirror request scanner at ${options.scanInterval}ms interval`);
    }
    start() {
        video_1.Video.findNew()
            .then(videos => {
            videos.forEach(vid => {
                console.log(`attempting download for ${vid.redditPostId}`);
                vid.download()
                    .then(() => {
                    console.log(`download for ${vid.redditPostId} finished, beginning upload`);
                    vid.upload()
                        .then(() => {
                        console.log(`successfully uploaded video ${vid.redditPostId}`);
                    })
                        .catch((err) => {
                        console.error(`${err}`);
                    });
                })
                    .catch((err) => {
                    console.error(`error on ${vid.redditPostId}: ${err}`);
                });
            });
        })
            .catch(err => {
            console.error(`failed finding new videos: ${err}`);
        });
    }
}
exports.default = MirrorRequestScanner;
//# sourceMappingURL=mirrorrequestscanner.js.map