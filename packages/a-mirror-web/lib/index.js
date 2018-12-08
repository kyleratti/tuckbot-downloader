"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
function run() {
    let webServer = new server_1.WebServer();
    webServer.start();
    let cdnServer = new server_1.CdnServer();
    cdnServer.start();
    let apiServer = new server_1.ApiServer();
    apiServer.start();
}
run();
//# sourceMappingURL=index.js.map