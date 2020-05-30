import { SubmissionStream } from "snoostorm";
import { Submission } from "snoowrap";
import { configurator, snooman } from "tuckbot-util";
import { VideoDownloader } from "../downloaders";
import { ACMApi, TuckbotApi } from "../services";
import { S3 } from "../services/s3";
import { ScannedPost } from "../structures";
import { ConfigOptions, Scanner } from "./scanner";

export class SubredditScanner extends Scanner {
  constructor(options: ConfigOptions) {
    super(options);

    console.log(
      `Starting subreddit scanner at ${options.scanInterval}ms interval`
    );
  }

  public static async processVideo(scannedPost: ScannedPost) {
    // FIXME: this is a horrible, horrible way to do this
    // refactor to not catch and re-throw errors
    let video;

    try {
      video = await VideoDownloader.fetch({
        videoUrl: scannedPost.url,
        redditPostId: scannedPost.redditPostId,
      });

      console.log(`successfully fetched ${video.redditPostId}`);
    } catch (err) {
      throw err;
    }

    try {
      await S3.upload(video);

      console.log(`successfully uploaded ${video.redditPostId}`);
    } catch (err) {
      throw err;
    }

    const mirrorUrl = `${configurator.tuckbot.frontend.url}/${video.redditPostId}`;
    const videoUrl = `${configurator.tuckbot.frontend.cdnUrl}/${video.redditPostId}.mp4`;

    try {
      await TuckbotApi.update({
        redditPostId: video.redditPostId,
        redditPostTitle: scannedPost.title,
        mirrorUrl: videoUrl,
      });

      console.log(`successfully updated tuckbot api ${video.redditPostId}`);
    } catch (err) {
      throw err; // FIXME: this could be cleaner
    }

    try {
      await ACMApi.update({
        redditPostId: video.redditPostId,
        url: mirrorUrl,
      });

      console.log(`successfully updated acm api ${video.redditPostId}`);
    } catch (err) {
      throw err;
    }

    VideoDownloader.cleanup(video.redditPostId);
  }

  start() {
    if (configurator.reddit.scanSubsList.length <= 0)
      throw new Error("Subreddit scan list is empty; aborting");

    configurator.reddit.scanSubsList.forEach((subName) => {
      console.debug(`Creating submission stream watch for /r/${subName}`);
      const stream = new SubmissionStream(snooman.wrap, {
        subreddit: subName,
        limit: 5,
        pollTime:
          5000 * (2 * Math.ceil(configurator.reddit.scanSubsList.length)),
      });

      stream.on("item", async (post: Submission) => {
        if (post.is_self) return; // TODO: add logic to detect if a valid video link

        try {
          await SubredditScanner.processVideo({
            redditPostId: post.id,
            title: post.title,
            url: post.url,
          });
        } catch (err) {
          console.error(`Unable to process video`);
          console.error(err);
        } finally {
          VideoDownloader.cleanup(post.id);
        }
      });
    });
  }
}
