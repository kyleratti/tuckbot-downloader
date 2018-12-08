"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const snoostorm_1 = __importDefault(require("snoostorm"));
const lib_1 = require("a-mirror-util/lib/");
const video_1 = require("../objects/video");
class ContentScanner {
    start() {
        if (lib_1.configurator.reddit.scanSubsList.length <= 0)
            throw new Error('Subreddit scan list is empty; aborting');
        let storm = new snoostorm_1.default(lib_1.snooman.wrap);
        lib_1.configurator.reddit.scanSubsList.forEach(subName => {
            console.log(`Starting submission stream for /r/${subName}`);
            let stream = storm.SubmissionStream({
                subreddit: subName,
                results: 1,
                pollTime: 1000 * (2 * Math.ceil(lib_1.configurator.reddit.scanSubsList.length))
            });
            stream.on('submission', function (post) {
                if (post.is_self)
                    return;
                let id = post.id;
                let url = post.url;
                video_1.Video.queueIfNew(id, url)
                    .catch(err => {
                    console.error(`unable to queue if new: ${err}`);
                });
            });
        });
    }
}
exports.ContentScanner = ContentScanner;
//# sourceMappingURL=contentscanner.js.map