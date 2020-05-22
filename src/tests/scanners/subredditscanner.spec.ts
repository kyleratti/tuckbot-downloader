import { Submission } from "snoowrap";
import { snooman } from "tuckbot-util";
import { DownloadedVideo, VideoDownloader } from "../../downloaders";

describe.skip("subredditscanner processVideo", () => {
  test(
    "should process without error",
    async () => {
      const [redditPostId, url] = [
        "g3p2fg",
        "https://www.youtube.com/watch?v=IaZAPEuU6b0&feature=emb_rel_pause",
      ];

      return expect(
        await VideoDownloader.fetch({
          redditPostId: redditPostId,
          videoUrl: url,
        })
      ).toBeInstanceOf(DownloadedVideo);
    },
    1000 * 30
  );
});

describe("Subreddit Scanner", () => {
  test.each(["ezrsxb", "g3p2fg"])(
    "retrieve post info for reddit post %s",
    async (redditPostId) => {
      const snoowrap = snooman.wrap;

      // Workaround for typing error with await keyword
      // see https://github.com/not-an-aardvark/snoowrap/issues/221
      // @ts-ignore
      const post: Submission = await snoowrap
        .getSubmission(redditPostId)
        .fetch();

      return expect(post.id).toBe(redditPostId);
    }
  );
});
