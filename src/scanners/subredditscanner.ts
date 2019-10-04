import snoostorm from "snoostorm";
import { Submission } from "snoowrap";
import { configurator, snooman } from "tuckbot-util";
import { VideoDownloader } from "../downloaders";
import { TuckbotApi, ACMApi } from "../services";
import { S3Uploader } from "../uploaders";
import { ConfigOptions, Scanner } from "./scanner";

export class SubredditScanner extends Scanner {
  constructor(options: ConfigOptions) {
    super(options);

    console.log(
      `Starting subreddit scanner at ${options.scanInterval}ms interval`
    );
  }

  private async processVideo(post: Submission) {
    let video = await VideoDownloader.fetch({
      videoUrl: post.url,
      redditPostId: post.id
    });

    console.log(`successfully fetched ${video.redditPostId}`);

    await S3Uploader.upload(video);

    console.log(`successfully uploaded ${video.redditPostId}`);

    const mirrorUrl = `${configurator.tuckbot.frontend.cdnUrl}/${video.redditPostId}.mp4`;

    await TuckbotApi.update({
      redditPostId: video.redditPostId,
      redditPostTitle: post.title,
      mirrorUrl: mirrorUrl
    });

    console.log(`successfully updated tuckbot api ${video.redditPostId}`);

    await ACMApi.update({
      redditPostId: video.redditPostId,
      url: mirrorUrl
    });

    console.log(`successfully updated acm api ${video.redditPostId}`);

    video.cleanup();
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

      stream.on("submission", async (post: Submission) => {
        if (post.is_self) return; // TODO: add logic to detect if a valid video link

        try {
          await this.processVideo(post);
        } catch (err) {
          console.error(`Unable to process video`); // FIXME: v.redd.it doesn't have mp4 available so this fails
          console.error(err);
        }
      });
    });
  }
}
