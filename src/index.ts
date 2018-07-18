import configurator from 'a-mirror-web/src/configurator';

import snoowrap from 'snoowrap';
import snoostorm from 'snoostorm';

import ytdl from 'ytdl-core';
import util from 'util';

import { Video, Status } from './objects/video';

// load config
const appToken = configurator.auth.token;
const webUrl = configurator.app.webUrl;
const cdnUrl = configurator.app.cdnUrl;

// set up snoowrap
export var wrap = new snoowrap({
    userAgent: configurator.reddit.userAgent,
    clientId: configurator.reddit.clientID,
    clientSecret: configurator.reddit.clientSecret,
    username: configurator.reddit.username,
    password: configurator.reddit.password,
});

wrap.config({
    continueAfterRatelimitError: false // we will handle our own replies
});

// set up snoostorm
export var storm = new snoostorm(wrap);

function runScanner() {
    // check that subs are set up, then subscribe to submission stream
    if(configurator.reddit.scanSubsList.length <= 0)
        throw new Error('Subreddit scan list is empty; aborting');

    configurator.reddit.scanSubsList.forEach(subName => {
        console.log("Starting submission stream for /r/%s", subName);

        let stream = storm.SubmissionStream({
            subreddit: subName,
            results: 1,
            pollTime: 1000 * 60
        });

        stream.on('submission', async function(post) {
            if(post.is_self) return;

            let vid = await new Video(post);

            let url = post.url;

            // TODO: check for more than YouTube
            if(ytdl.validateURL(url)) {
                let postId = post.id; // permalink ID of reddit post

                console.log(`checking api for ${postId}`);

                vid.exists()
                    .then(() => {
                        return console.log(`post ${vid.redditPostId} already exists in database, ignoring...`);
                    })
                    .catch(err => {
                        if(err.statusCode === 404) {
                            console.log(`received first request to mirror ${vid.redditPostId}, creating video mirror entry`);
                            vid.create()
                                .then(data => {
                                    console.log(`added video ${vid.redditPostId} to request database successfully`);
                                })
                                .catch(err => {
                                    console.error(`failed to add video to database: ${err}`);
                                });
                        } else {
                            console.error(`failed to fetch info on ${vid.redditPostId}: ${err}`);
                        }
                    });
            }
        });
    });

    // TODO: check if should listen to comments, and if so, subscribe
}

/** Poll the database for new videos to download, transcode, and share */
function pollForVideos() {
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

function pollForNeededReplies() {
    // TODO: get all videos that are mirrored but not posted, try replying now
    Video.findUnpostedMirrored()
        .then(videos => {
            videos.forEach(vid => {
                console.log(`attempting reply for ${vid.redditPostId}`);

                vid.reply(util.format("#Here's a [mirror of this video](https://amirror.link/%s)", vid.redditPostId))
                    .then(() => {
                        console.log(`posted reply`);
                        vid.update({
                            status: Status.PostedLocalMirror
                        });
                    })
                    .catch(err => {
                        console.error(`failed replying to message: ${err}`);
                    });
            });
        })
        .catch(err => {
            console.log(`failed finding mirrored videos: ${err}`);
        });
}

runScanner();
pollForVideos();
pollForNeededReplies();

setInterval(pollForVideos, 1000 * 5);
setInterval(pollForNeededReplies, 1000 * 30);
