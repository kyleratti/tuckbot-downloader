import { expect } from "chai";
import "mocha";
import { VideoDownloader } from "./videodownloader";
import { DownloadedVideo } from "./downloadedvideo";

describe("v.redd.it video download", () => {
  it("should  download a .mp4 file", async () => {
    const result = await VideoDownloader.fetch({
      redditPostId: "ezrsxb",
      videoUrl:
        "https://www.reddit.com/r/PublicFreakout/comments/ezrsxb/dont_be_so_afraid_its_ok/"
    });

    return expect(result).to.instanceOf(DownloadedVideo);
  }).timeout(0);
});
