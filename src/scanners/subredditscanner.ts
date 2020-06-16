import { SubmissionStream } from "snoostorm";
import { Submission } from "snoowrap";
import { configurator, logger, snooman } from "tuckbot-util";
import { VideoDownloader } from "../downloaders";
import { ACMApi, TuckbotApi } from "../services";
import { S3 } from "../services/s3";
import { ScannedPost } from "../structures";
import { Scanner } from "./scanner";

export class SubredditScanner extends Scanner {
  public static async processVideo(scannedPost: ScannedPost) {
    // FIXME: this is a horrible, horrible way to do this
    // refactor to not catch and re-throw errors
    let video;

    try {
      video = await VideoDownloader.fetch({
        videoUrl: scannedPost.url,
        redditPostId: scannedPost.redditPostId,
      });

      logger.debug({
        msg: `Fetched linked video`,
        redditPostId: video.redditPostId,
      });
    } catch (err) {
      logger.error({
        msg: `Unable to fetch linked video`,
        redditPostId: scannedPost.redditPostId,
        error: err,
      });

      throw err;
    }

    try {
      const result = await S3.upload(video);

      logger.debug({
        msg: `Uploaded video to S3 object storage`,
        redditPostId: video.redditPostId,
        result: {
          bucket: result.Bucket,
          location: result.Location,
          key: result.Key,
        },
      });
    } catch (err) {
      logger.error({
        msg: `Unable to upload video to S3 object storage`,
        redditPostId: video.redditPostId,
        error: err,
      });

      throw err;
    }

    const mirrorUrl = `${configurator.tuckbot.frontend.url}/${video.redditPostId}`;
    const videoUrl = `${configurator.tuckbot.frontend.cdnUrl}/${video.redditPostId}.mp4`;

    try {
      const result = await TuckbotApi.update({
        redditPostId: video.redditPostId,
        redditPostTitle: scannedPost.title,
        mirrorUrl: videoUrl,
      });

      logger.debug({
        msg: `Updated tuckbot-api`,
        redditPostId: video.redditPostId,
        result: result,
      });
    } catch (err) {
      logger.error({
        msg: `Unable to update tuckbot-api`,
        redditPostId: video.redditPostId,
        error: err,
      });

      throw err; // FIXME: this could be cleaner
    }

    try {
      const result = await ACMApi.update({
        redditPostId: video.redditPostId,
        url: mirrorUrl,
      });

      logger.debug({
        msg: `Updated a-centralized-mirror`,
        redditPostId: video.redditPostId,
        result: result,
      });
    } catch (err) {
      logger.error({
        msg: `Unable to update a-centralized-mirror`,
        redditPostId: video.redditPostId,
        error: err,
      });

      throw err;
    }

    VideoDownloader.cleanup(video.redditPostId);
  }

  start() {
    logger.info({
      msg: `Starting subreddit scanner`,
      scanInterval: this.scanInterval,
    });

    if (configurator.reddit.scanSubsList.length <= 0) {
      logger.fatal({
        msg: `Subreddit scan list is empty; aborting`,
      });

      throw `Subreddit scan list is empty; aborting`;
    }

    configurator.reddit.scanSubsList.forEach((subName) => {
      logger.info({
        msg: `Creating submission stream listener`,
        subredditName: subName.toLowerCase(),
      });

      const stream = new SubmissionStream(snooman.wrap, {
        subreddit: subName,
        limit: 5,
        pollTime:
          5000 * (2 * Math.ceil(configurator.reddit.scanSubsList.length)),
      });

      stream.on("item", async (post: Submission) => {
        if (post.is_self) {
          return logger.debug({
            msg: `Skipping processing of self-post`,
            redditPostId: post.id,
            subredditName: subName,
          });
        }

        logger.info({
          msg: `Processing new video submission`,
          redditPostId: post.id,
          subredditName: subName,
          submission: {
            id: post.id,
            title: post.title,
            url: post.url,
          },
        });

        try {
          await SubredditScanner.processVideo({
            redditPostId: post.id,
            title: post.title,
            url: post.url,
          });

          logger.info({
            msg: `Processed scanned video`,
            redditPostId: post.id,
            subredditName: subName,
          });
        } catch (err) {
          logger.error({
            msg: `Unable to process scanned video`,
            redditPostId: post.id,
            subredditName: subName,
            error: err,
          });
        } finally {
          logger.debug({
            msg: `Cleaning up video download`,
            redditPostId: post.id,
          });

          VideoDownloader.cleanup(post.id);

          logger.debug({
            msg: `Finished video download cleanup`,
            redditPostId: post.id,
          });
        }
      });
    });
  }
}
