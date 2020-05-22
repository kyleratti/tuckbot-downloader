import { snooman } from "tuckbot-util";
import { TuckbotApi } from "../../services";

describe("Dead Content Scanner", () => {
  test("retrieve dead content from tuckbot api", async () => {
    return expect(async () => {
      (await TuckbotApi.fetchStale()).data.staleVideos;
    }).not.toThrow();
  });

  test("retrieve reddit post info for dead content", async () => {
    let videos = (await TuckbotApi.fetchStale()).data.staleVideos;
    let allVidsLoaded = true;

    videos.forEach(async (vid) => {
      try {
        // @ts-ignore
        await snooman.wrap.getSubmission(vid.redditPostId).fetch();
      } catch (err) {
        console.error("ERRR");
        allVidsLoaded = false;
      }
    });

    return expect(allVidsLoaded).toBeTruthy();
  });
});
