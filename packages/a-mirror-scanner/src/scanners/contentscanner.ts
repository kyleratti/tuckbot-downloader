import snoostorm from 'snoostorm';

import { configurator, snooman } from 'a-mirror-util/lib/';
import { Video } from '../objects/video';

export class ContentScanner {
    start() {
        if(configurator.reddit.scanSubsList.length <= 0)
            throw new Error('Subreddit scan list is empty; aborting');

        let storm = new snoostorm(snooman.wrap);
    
        configurator.reddit.scanSubsList.forEach(subName => {
            console.log(`Starting submission stream for /r/${subName}`);
    
            let stream = storm.SubmissionStream({
                subreddit: subName,
                results: 1,
                pollTime: 1000 * (2 * Math.ceil(configurator.reddit.scanSubsList.length))
            });

            stream.on('submission', function(post) {
                if(post.is_self) return;

                let id = post.id;
                let url = post.url;

                Video.queueIfNew(id, url)
                    .catch(err => {
                        console.error(`unable to queue if new: ${err}`);
                    });
            });
        });
    }
}
