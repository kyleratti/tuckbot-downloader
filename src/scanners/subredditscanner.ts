import { configurator, snooman } from "a-mirror-util";
import snoostorm from "snoostorm";
import { VideoDownloader } from "../downloaders";
import { ConfigOptions, Scanner } from "./scanner";
import { S3Uploader } from "../uploaders";

export class SubredditScanner extends Scanner {
  constructor(options: ConfigOptions) {
    super(options);

    console.log(
      `Starting subreddit scanner at ${options.scanInterval}ms interval`
    );
  }

  start() {
    if (configurator.reddit.scanSubsList.length <= 0)
      throw new Error("Subreddit scan list is empty; aborting");

    let storm = new snoostorm(snooman.wrap);

    configurator.reddit.scanSubsList.forEach(subName => {
      console.debug(`Creating submission stream watch for /r/${subName}`);
      let stream = storm.SubmissionStream({
        subreddit: subName,
        results: 5,
        pollTime:
          1000 * (2 * Math.ceil(configurator.reddit.scanSubsList.length))
      });

      stream.on("submission", async function(post) {
        if (post.is_self) return;

        let video = await VideoDownloader.fetch(post);
        console.log(video);

        let result = await S3Uploader.upload(video);
        console.log(result);
      });
    });
  }
}
