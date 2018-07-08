import * as dotenv from 'dotenv';
import * as configurator from './Configurator';

import snoowrap from 'snoowrap';
import snoostorm from 'snoostorm';

import ytdl from 'ytdl-core';
import path from 'path';
import crypto from 'crypto';

import util from 'util';

import {SubredditWorker} from './SubredditWorker';
import { YouTubeWorker } from './YouTubeWorker';

// load config
let objResult = dotenv.load();
if(objResult.error)
    throw objResult.error

const config = configurator.load();

// set up snoowrap
const wrap = new snoowrap({
    userAgent: config.reddit.userAgent,
    clientId: config.reddit.clientID,
    clientSecret: config.reddit.clientSecret,
    username: config.reddit.username,
    password: config.reddit.password,
});

wrap.config({
    continueAfterRatelimitError: true
});

// set up snoostorm
const storm = new snoostorm(wrap);

// set up replybot
const arrRobotWords = [
    "Beep boop bop.",
    "Beep. Beeep. Beeeeeeeeeeeeeeeep.",
    "Boop.",
    "\\*R2D2 noises\\*",
    "Hi"
]

/**
 * Replies to the specified post with the specified message
 * @param objPost The post to respond to
 * @param strMessage The message to respond with
 */
function reply(objPost, strMessage:string) {
    let iRandomIndex = Math.floor(Math.random() * arrRobotWords.length);
    let strRobotSpeak = arrRobotWords[iRandomIndex];

    objPost.reply(util.format("%s\n\n*%s* That's robot for [share your thoughts](https://reddit.com/message/compose/?to=Clutch_22&subject=a-mirror-bot%20feedback) or [want to see my programming?](https://github.com/a-banana/a-mirror)", strMessage, strRobotSpeak));
}

function run() {
    // check that subs are set up, then subscribe to submission stream
    if(config.reddit.scanSubsList.length <= 0)
        throw new Error('Subreddit scan list is empty; aborting');

    config.reddit.scanSubsList.forEach(strSubName => {
        console.log("Starting submission stream for /r/%s", strSubName);

        let objStream = storm.SubmissionStream({
            //subreddit: strSubName,
            results: 1,
            pollTime: 1000 * 2
        });

        objStream.on("submission", function(objPost) {
            if(objPost.is_self) return;

            let strURL = objPost.url;
            let strHash = crypto.createHash('md5').update(strURL).digest('hex');
            let strBaseDir = path.resolve('../', config.app.file.local.storageDir);

            // TODO: check for more than YouTube
            if(ytdl.validateURL(strURL)) {
                let objWorker = new YouTubeWorker({
                    url: strURL,
                    post: objPost,
                    tempFolder: strBaseDir
                });
                objWorker.start();
            }
        });
    });

    // TODO: check if should listen to comments, and if so, subscribe
}

run();
