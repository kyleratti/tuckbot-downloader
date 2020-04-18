import fs from "fs";
import { configurator } from "tuckbot-util";
import { DownloadedVideo } from "../../downloaders/downloadedvideo";
import { VideoDownloader } from "../../downloaders/videodownloader";

describe("ffmpeg", () => {
  test("binary path defined", () => {
    return expect(configurator.ffmpeg.location).not.toBeNull();
  });

  test("binary exists", () => {
    return expect(fs.existsSync(configurator.ffmpeg.location)).toBeTruthy();
  });
});

describe("video download", () => {
  test("processingDir defined", () => {
    return expect(configurator.file.processingDir).not.toBeNull();
  });

  test("processingDir exists", () => {
    return expect(fs.existsSync(configurator.file.processingDir)).toBeTruthy();
  });

  test.each(["ezrsxb", "g3p2fg"])(
    "downloads the video on reddit post %s",
    async (redditPostId) => {
      return expect(
        await VideoDownloader.fetch({
          redditPostId: redditPostId,
          videoUrl: "https://www.reddit.com/" + redditPostId,
        })
      ).toBeInstanceOf(DownloadedVideo);
    }
  );
});
