import { MirrorRequestScanner, ReplyScanner } from './scanners';

export default class {
    start() {
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
