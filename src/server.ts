import { MirrorRequestScanner, ReplyScanner } from './scanners';

export default class {
    start() {
        /**
         * Start scanner that checks for new mirror requests
         * Start scanner that checks for mirrors that are done and waiting for replies to be posted
         */
        let mirrorReqScanner = new MirrorRequestScanner({
            scanInterval: 1000 * 10
        });
        mirrorReqScanner.start();

        let replyScanner = new ReplyScanner({
            scanInterval: 1000 * 30
        });
        replyScanner.start();
    }
}
