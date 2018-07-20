import { Scanner, ConfigOptions } from './scanner';

import { Video, Status } from '../objects/video';

export default class MirrorRequestScanner extends Scanner {
    constructor(options: ConfigOptions) {
        super(options);

        console.log(`starting mirror request scanner at ${options.scanInterval}ms interval`);
    }
    
    start() {
        Video.findNew()
            .then(videos => {
                videos.forEach(vid => {
                    console.log(`attempting download for ${vid.redditPostId}`);
                    vid.download()
                        .then(() => {
                            console.log(`done downloading ${vid.redditPostId}, updating status`);
                            vid.update({ status: Status.Downloaded })
                                .then(() => {
                                    console.log(`updated status on ${vid.redditPostId}, uploading`);
                                    vid.upload()
                                        .then(() => {
                                            console.log(`successfully uploaded video ${vid.redditPostId}`);
                                        })
                                        .catch((err) => {
                                            console.error(`${err}`)
                                        });
                                })
                                .catch((err) => {
                                    console.error(`failed to upload ${vid.redditPostId}: ${err}`);
                                });
                        })
                        .catch((err) => {
                            console.error(`error on ${vid.redditPostId}: ${err}`);
                        });
                });
            })
            .catch(err => {
                console.error(`failed finding new videos: ${err}`);
            });
    }
}
