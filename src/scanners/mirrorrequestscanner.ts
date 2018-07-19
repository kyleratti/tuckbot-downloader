import { Scanner, ConfigOptions } from './scanner';

import { Video, Status } from '../objects/video';

export default class MirrorRequestScanner extends Scanner {
    constructor(options: ConfigOptions) {
        super(options);
    }
    
    start() {
        Video.findNew()
            .then(videos => {
                videos.forEach(vid => {
                    console.log(`attempting download for ${vid.redditPostId}`);
                    vid.download()
                        .then(() => {
                            vid.upload().then(() => {
                                vid.update({ status: Status.LocallyMirrored });
                                console.log(`successfully uploaded video ${vid.redditPostId}`);
                            })
                            .catch((err) => {
                                console.error(`failed to upload video: ${err}`);
                            });
                        })
                        .catch(err => {
                            if(err.message === 'Error: This video is unavailable.') {
                                console.error(`updating with unavailable state`);
                                vid.update({ status: Status.VideoUnavailable });
                            }
                            console.error(`download error: ${err}`);
                        });
                });
            })
            .catch(err => {
                console.error(`failed finding new videos: ${err}`);
            });
    }
}
