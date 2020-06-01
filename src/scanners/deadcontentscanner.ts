import moment from "moment";
import { Submission } from "snoowrap";
import { snooman } from "tuckbot-util";
import { S3, TuckbotApi } from "../services";
import { Scanner } from "./scanner";

export class DeadContentScanner extends Scanner {
  async start() {
    console.log(
      `Starting dead content scanner at ${this.scanInterval}ms interval`
    );

    const doCheck = async () => {
      console.log(`Checking for stale content`);
      let videosToPrune = (await TuckbotApi.fetchStale()).data.staleVideos;

      console.debug(`Found ${videosToPrune.length} video(s)`);

      let shouldRemove = false;
      const removalDate = moment().subtract(20, "days");

      console.debug(`Cut-off for stale content is ${removalDate.toString()}`);

      videosToPrune.forEach(async (vid) => {
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
              console.log(`'${submission.id}' now removed from reddit`);
              shouldRemove = true;
            } else if (lastViewed.isBefore(removalDate)) {
              console.log(
                `${submission.id} last viewed > 20 days ago; removing`
              );
              shouldRemove = true;
            }
          }
        } catch (err) {
          console.error(
            `Failed to process stale content (${vid.redditPostId}): ${err}`
          );
          shouldRemove = true;
        }

        if (shouldRemove) {
          try {
            await TuckbotApi.remove(vid);
            console.log(`sent tuckbot api req to remove ${vid.redditPostId}`);
            await S3.remove(vid);
            console.log(`removed s3 object for ${vid.redditPostId}`);
          } catch (err) {
            console.error(`error removing ${vid.redditPostId}: ${err}`);
          }
        } else {
          await TuckbotApi.prune(vid);
        }
      });
    };

    setInterval(doCheck, this.scanInterval);
    doCheck();
  }
}
