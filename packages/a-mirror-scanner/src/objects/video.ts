import * as request from 'request-promise-native';

import configurator from 'a-mirror-util/lib/configurator';

const apiUrl = configurator.app.apiUrl;

export class Video {
    /**
     * Submit a request to queue this video if it's new
     * @param redditPostId The unique reddit post id
     * @param url The video url
     */
    static queueIfNew(redditPostId: string, url: string) {
        return request.put({
            uri: apiUrl + '/video/queue',
            body: {
                token: configurator.auth.token,
                redditPostId: redditPostId,
                videoUrl: url
            },
            json: true
        });
    }
}
