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
const configurator_1 = __importDefault(require("a-mirror-util/lib/configurator"));
const apiUrl = configurator_1.default.app.apiUrl;
class Video {
    /**
     * Submit a request to queue this video if it's new
     * @param redditPostId The unique reddit post id
     * @param url The video url
     */
    static queueIfNew(redditPostId, url) {
        return request.put({
            uri: apiUrl + '/video/queue',
            body: {
                token: configurator_1.default.auth.token,
                redditPostId: redditPostId,
                videoUrl: url
            },
            json: true
        });
    }
}
exports.Video = Video;
//# sourceMappingURL=video.js.map