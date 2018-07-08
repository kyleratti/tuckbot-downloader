import * as dotenv from 'dotenv';
import * as configurator from './Configurator';

import snoowrap from 'snoowrap';
import snoostorm from 'snoostorm';

import fs from 'fs';
import ytdl from 'ytdl-core';
import path from 'path';
import crypto from 'crypto';
import Ffmpeg from 'fluent-ffmpeg';

import util from 'util';

import {SubredditWorker} from './SubredditWorker';

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
            pollTime: 1000 * 20
        });

        objStream.on("submission", function(objPost) {
            if(objPost.is_self) return;

            let strURL = objPost.url;
            let strHash = crypto.createHash('md5').update(strURL).digest('hex');
            let strBaseDir = path.resolve('../', config.app.file.local.storageDir);
            let strTempOutput = path.resolve(strBaseDir, (strHash + '.mp4'));
            let strFinalOutput = path.resolve(strBaseDir, (strHash + '.webm'));

            // TODO: check for more than YouTube
            if(ytdl.validateURL(strURL)) {
                try {
                    console.log("Starting DL of %s", strURL);
                    ytdl(strURL, {filter: (format) => format.container === 'mp4'})
                        .on('error', (e) => {
                            if(e.message === 'Fetching stream failed: Error: This video is unavailable.') {
                                console.log("Can't retrieve %s: video is unavailable", strURL);
                            } else
                                console.error("ERROR: Fetching stream failed: %s", e);
                        })
                        .pipe(fs.createWriteStream(strTempOutput)).on('finish', () => {
                            console.log("    * Finished downloading, converting to webm now");
                            let objConverter = Ffmpeg({
                                    source: strTempOutput,
                                    timeout: 60 * 5
                                }).withVideoCodec('libvpx')
                                //.withVideoBitrate(1024)
                                .withAudioCodec('libvorbis')
                                .addOutputOptions(['-threads 8', '-cpu-used 5', '-deadline realtime'])
                                .saveToFile(strFinalOutput)
                                .on('end', function() {
                                    console.log("    * Finished, file is at %s", strFinalOutput);
                                    // TODO: upload somewhere else
                                    reply(objPost, "#Here's a [mirror of this video](https://url.com)");
                                })
                                .on('error', function(e) {
                                    console.error("Unable to finish ffmpeg: %s", e);
                                });
                        });
                } catch(e) {
                    console.error("[ERROR] Unable to download YouTube video: %s", e);
                }
            }
        });
    });

    // TODO: check if should listen to comments, and if so, subscribe
}

run();
