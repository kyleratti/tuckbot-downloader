"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scanners_1 = require("./scanners");
class default_1 {
    start() {
        let mirrorReqScanner = new scanners_1.MirrorRequestScanner({
            scanInterval: 1000 * 20
        });
        mirrorReqScanner.start();
        let replyScanner = new scanners_1.ReplyScanner({
            scanInterval: 1000 * 30
        });
        replyScanner.start();
    }
}
exports.default = default_1;
//# sourceMappingURL=server.js.map