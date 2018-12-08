import { WebServer, CdnServer, ApiServer } from './server';

function run() {
    let webServer = new WebServer();
    webServer.start();

    let cdnServer = new CdnServer();
    cdnServer.start();

    let apiServer = new ApiServer();
    apiServer.start();
}

run();
