"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const controllers_1 = require("./controllers");
const configurator_1 = __importDefault(require("a-mirror-util/lib/configurator"));
const database_1 = require("./db/database");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
// load database
exports.database = new database_1.Database(configurator_1.default.database.location);
exports.UrlType = {
    /** api requests */
    Api: configurator_1.default.app.apiUrl,
    /** cdn requests */
    Cdn: configurator_1.default.app.cdnUrl,
    /** web requests */
    Web: configurator_1.default.app.webUrl
};
/**
 * Combines the strings to the base url
 * @param args The strings to combine
 */
function makeUrl(baseUrl, ...args) {
    return baseUrl + args.join('');
}
exports.makeUrl = makeUrl;
class WebServer {
    constructor() {
        let app = express_1.default();
        let port = configurator_1.default.app.webPort || 3000;
        app.set('view engine', 'pug');
        app.use('/', controllers_1.PublicController);
        this.app = app;
        this.port = port;
    }
    start() {
        exports.database.connect();
        this.app.listen(this.port, () => {
            console.log(`listening for web requests at http://127.0.0.1:${this.port}`);
        });
    }
}
exports.WebServer = WebServer;
class CdnServer {
    constructor() {
        let app = express_1.default();
        let port = configurator_1.default.app.cdnPort || 3001;
        this.app = app;
        this.port = port;
    }
    start() {
        this.app.use('/img', express_1.default.static(path_1.default.join(__dirname, '/../public/img')));
        this.app.use('/css', express_1.default.static(path_1.default.join(__dirname, '/../public/css')));
        this.app.use('/video', express_1.default.static(configurator_1.default.file.local.storageDir));
        this.app.listen(this.port, () => {
            console.log(`listening for cdn requests at http://127.0.0.1:${this.port}`);
        });
    }
}
exports.CdnServer = CdnServer;
class ApiServer {
    constructor() {
        let app = express_1.default();
        let port = configurator_1.default.app.apiPort || 3002;
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        app.use(body_parser_1.default.json());
        app.use('/', controllers_1.APIController);
        this.app = app;
        this.port = port;
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`listening for api requests at http://127.0.0.1:${this.port}`);
        });
    }
}
exports.ApiServer = ApiServer;
/**
 * Sends a response to the HTTP request
 * @param res The response
 * @param status The HTTP status code to send
 * @param message The message to send with the status data
 * @param data The data to respond to the request with
 */
function response(res, status, message, data) {
    return res.status(status).send({
        data: data,
        status: {
            code: status,
            message: message,
            servedBy: os_1.default.hostname().split('.')[0]
        }
    });
}
exports.response = response;
//# sourceMappingURL=server.js.map