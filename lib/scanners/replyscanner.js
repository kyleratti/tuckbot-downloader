"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const scanner_1 = require("./scanner");
const video_1 = require("../objects/video");
class ReplyScanner extends scanner_1.Scanner {
    constructor(options) {
        super(options);
        console.log(`starting reply scanner at ${options.scanInterval}ms interval`);
    }
    start() {
        video_1.Video.findUnpostedMirrored()
            .then(videos => {
            videos.forEach(vid => {
                console.log(`attempting reply for ${vid.redditPostId}`);
                vid.reply(util_1.default.format("[Mirror](https://amirror.link/%s)", vid.redditPostId))
                    .then((reply) => {
                    reply.approve();
                    reply.distinguish({
                        status: true,
                        sticky: false
                    });
                    console.log(`posted reply`);
                    vid.update({
                        status: video_1.Status.PostedLocalMirror
                    })
                        .catch(err => {
                        console.error(`failed updating status on ${vid.redditPostId}: ${err}`);
                    });
                })
                    .catch(err => {
                    // FIXME: this needs to check to see if we are rate limited
                    console.error(`failed replying to message: ${err}`);
                });
            });
        })
            .catch(err => {
            console.log(`failed finding mirrored videos: ${err}`);
        });
    }
}
exports.default = ReplyScanner;
//# sourceMappingURL=replyscanner.js.map