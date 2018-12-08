"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const snoowrap_1 = __importDefault(require("snoowrap"));
const configurator_1 = __importDefault(require("./configurator"));
let wrap = new snoowrap_1.default({
    userAgent: configurator_1.default.reddit.userAgent,
    clientId: configurator_1.default.reddit.clientID,
    clientSecret: configurator_1.default.reddit.clientSecret,
    username: configurator_1.default.reddit.username,
    password: configurator_1.default.reddit.password
});
wrap.config({ continueAfterRatelimitError: false, debug: true });
exports.default = {
    /** The snoowrap instance */
    wrap: wrap
};
//# sourceMappingURL=snooman.js.map