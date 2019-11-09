import { SubredditScanner } from ".";
import { S3, TuckbotApi } from "../services";

export class DeadContentScanner extends SubredditScanner {
  async start() {
    setInterval(async () => {
      let videosToPrune = (await TuckbotApi.fetchStale()).data.mirroredVideos;

      videosToPrune.forEach(async vid => {
        // @ts-ignore
        // FIXME: due to an issue with snoowrap typings, the 'await' keyword causes compile errors. see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33139
        let submission: Submission = await snooman.wrap
          .getSubmission(vid.redditPostId)
          .fetch();

        if (submission.removal_reason != null) {
          // This is the only way I have found to detect whether or not a submission was removed
          await TuckbotApi.remove(vid);
          S3.remove(vid);
        } else {
          await TuckbotApi.prune(vid);
        }
      });
    }, this.scanInterval);
  }
}
