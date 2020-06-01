import { Submission } from "snoowrap";
import { snooman } from "tuckbot-util";
import { TuckbotApi } from "../../services";

describe("Dead Content Scanner", () => {
  test("retrieve dead content from tuckbot api", async () => {
    return expect(async () => {
      (await TuckbotApi.fetchStale()).data.staleVideos;
    }).not.toThrow();
  });

  test("retrieve reddit post info for dead content", async () => {
    const videos = (await TuckbotApi.fetchStale()).data.staleVideos;
    let allVidsLoaded = true;

    for (let i = 0; i < videos.length; i++) {
      const vid = videos[i];
      try {
        // @ts-ignore
        await snooman.wrap.getSubmission(vid.redditPostId).fetch();
      } catch (err) {
        console.error(err);
        allVidsLoaded = false;
      }
    }

    return expect(allVidsLoaded).toBeTruthy();
  });

  test("identify submission removed by author", async () => {
    // @ts-ignore
    const post: Submission = await snooman.wrap.getSubmission("guqq1j").fetch();

    // @ts-expect-error
    return expect(post.removed_by_category).toBe("author");
  });

  test("identify submission removed by moderator", async () => {
    // @ts-ignore
    const post: Submission = await snooman.wrap.getSubmission("guswxq").fetch();

    // @ts-expect-error
    return expect(post.removed_by_category).toBe("moderator");
  });
});
