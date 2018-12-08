import express from 'express';
import bodyParser from 'body-parser';

import { APIController, PublicController } from './controllers';

import configurator from 'a-mirror-util/lib/configurator';
import { Database } from './db/database';

import os from 'os';
import path from 'path';

// load database
export var database = new Database(configurator.database.location);

export var UrlType = {
    /** api requests */
    Api: configurator.app.apiUrl,
    /** cdn requests */
    Cdn: configurator.app.cdnUrl,
    /** web requests */
    Web: configurator.app.webUrl
}

/**
 * Combines the strings to the base url
 * @param args The strings to combine
 */
export function makeUrl(baseUrl: string, ...args: string[]) {
    return baseUrl + args.join('');
}

export class WebServer {
    private app: express.Application;
    private port: number;
    
    constructor() {
        let app = express();
        let port = configurator.app.webPort || 3000;

        app.set('view engine', 'pug');

        app.use('/', PublicController);

        this.app = app;
        this.port = port;
    }

    start() {
        database.connect();

        this.app.listen(this.port, () => {
            console.log(`listening for web requests at http://127.0.0.1:${this.port}`);
        })
    }
}

export class CdnServer {
    private app: express.Application;
    private port: number;

    constructor() {
        let app = express();
        let port = configurator.app.cdnPort || 3001;

        this.app = app;
        this.port = port;
    }

    start() {
        this.app.use('/img', express.static(path.join(__dirname, '/../public/img')));
        this.app.use('/css', express.static(path.join(__dirname, '/../public/css')));
        this.app.use('/video', express.static(configurator.file.local.storageDir));

        this.app.listen(this.port, () => {
            console.log(`listening for cdn requests at http://127.0.0.1:${this.port}`);
        });
    }
}

export class ApiServer {
    private app: express.Application;
    private port: number;
 
    constructor() {
        let app = express();
        let port = configurator.app.apiPort || 3002;

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use('/', APIController);

        this.app = app;
        this.port = port;
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`listening for api requests at http://127.0.0.1:${this.port}`);
        });
    }
}

/**
 * Sends a response to the HTTP request
 * @param res The response
 * @param status The HTTP status code to send
 * @param message The message to send with the status data
 * @param data The data to respond to the request with
 */
export function response(res, status, message, data?) {
    return res.status(status).send({
        data: data,
        status: {
            code: status,
            message: message,
            servedBy: os.hostname().split('.')[0]
        }
    });
}
