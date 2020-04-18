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
