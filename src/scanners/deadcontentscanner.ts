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
      let videosToPrune = (await TuckbotApi.fetchStale()).data.mirroredVideos;

      console.debug(`Found ${videosToPrune.length} video(s)`);

      let shouldRemove = false;
      const removalDate = moment().subtract(20, "days");

      console.debug(`Cut-off for stale content is ${removalDate.toString()}`);

      videosToPrune.forEach(async vid => {
        shouldRemove = false;

        // @ts-ignore
        // FIXME: due to an issue with snoowrap typings, the 'await' keyword causes compile errors. see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33139
        let submission: Submission = await snooman.wrap
          .getSubmission(vid.redditPostId)
          .fetch();

        let lastViewed = moment(vid.lastViewedAt);

        if (!submission) shouldRemove = true;
        else {
          if (submission.removal_reason != null) {
            // This is the only way I have found to detect whether or not a submission was removed
            console.log(`'${submission.id}' now removed from reddit`);
            shouldRemove = true;
          } else if (lastViewed.isBefore(removalDate)) {
            console.log(`${submission.id} last viewed > 20 days ago; removing`);
            shouldRemove = true;
          }
        }

        if (shouldRemove) {
          await TuckbotApi.remove(vid);
          console.log(`sent tuckbot api req to remove ${vid.redditPostId}`);
          S3.remove(vid);
        } else {
          await TuckbotApi.prune(vid);
        }
      });
    };

    setInterval(doCheck, this.scanInterval);
    doCheck();
  }
}
