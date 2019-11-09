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

      videosToPrune.forEach(async vid => {
        // @ts-ignore
        // FIXME: due to an issue with snoowrap typings, the 'await' keyword causes compile errors. see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33139
        let submission: Submission = await snooman.wrap
          .getSubmission(vid.redditPostId)
          .fetch();

        if (submission.removal_reason != null) {
          // This is the only way I have found to detect whether or not a submission was removed
          console.log(`'${submission.id}' now removed`);
          await TuckbotApi.remove(vid);
          console.log(`sent tuckbot api req`);
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
