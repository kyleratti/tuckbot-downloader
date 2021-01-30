import moment from "moment";
import { Submission } from "snoowrap";
import { logger, snooman } from "tuckbot-util";
import { S3, TuckbotApi } from "../services";
import { Scanner } from "./scanner";

export class DeadContentScanner extends Scanner {
  async start() {
    logger.info({
      msg: `Starting dead content scanner`,
      scanInterval: this.scanInterval,
    });

    const doCheck = async () => {
      logger.info({
        msg: `Checking for stale content`,
      });

      const videosToPrune = (await TuckbotApi.fetchStale()).data.staleVideos;

      if (videosToPrune && videosToPrune.length <= 0)
        return logger.debug({
          msg: `No videos need pruning`,
        });

      let shouldRemove = false;
      const removalDate = moment().subtract(20, "days");

      logger.debug({
        msg: `Found videos to prune`,
        videos: videosToPrune,
        removalDate: removalDate,
      });

      for (let i = 0; i < videosToPrune.length; i++) {
        const vid = videosToPrune[i];
        shouldRemove = false;

        try {
          // @ts-ignore
          // FIXME: due to an issue with snoowrap typings, the 'await' keyword causes compile errors. see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33139
          // TODO: handle rejection
          const submission: Submission = await snooman.wrap
            .getSubmission(vid.redditPostId)
            .fetch();

          const lastViewed = moment(vid.lastViewedAt);

          if (!submission) shouldRemove = true;
          else {
            if (
              submission.removal_reason != null ||
              // @ts-expect-error
              // This will error in TS because of a missing properties on the typings file
              submission.removed_by_category != null
            ) {
              // This is the only way I have found to detect whether or not a submission was removed
              logger.debug({
                msg: `Flagging existing mirror of a post now removed from reddit for removal`,
                redditPostId: submission.id,
                removal_reason: submission.removal_reason,
                // @ts-expect-error
                removed_by_category: submission.removed_by_category,
              });
              shouldRemove = true;
            } else if (lastViewed.isBefore(removalDate)) {
              logger.debug({
                msg: `Flagging existing mirror that hasn't been viewed within the threshold for removal`,
                redditPostId: submission.id,
                removalDate: removalDate,
              });

              shouldRemove = true;
            }
          }
        } catch (err) {
          logger.error({
            msg: `Unable to process video needing pruning, flagging for removal`,
            redditPostId: vid.redditPostId,
            error: err,
          });

          shouldRemove = true;
        }

        if (shouldRemove) {
          try {
            await TuckbotApi.remove(vid);

            logger.debug({
              msg: `Removed dead content from tuckbot-api`,
              redditPostId: vid.redditPostId,
            });

            await S3.remove(vid);

            logger.debug({
              msg: `Removed dead content from S3 object storage`,
              redditPostId: vid.redditPostId,
            });
          } catch (err) {
            logger.error({
              msg: `Unable to remove dead content`,
              redditPostId: vid.redditPostId,
              error: err,
            });
          }
        } else {
          await TuckbotApi.prune(vid);
        }
      }
    };

    setInterval(doCheck, this.scanInterval);
    doCheck();
  }
}
