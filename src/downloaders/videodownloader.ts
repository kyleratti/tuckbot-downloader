import { configurator } from "a-mirror-util";
import fs from "fs";
import path from "path";
import { Submission } from "snoowrap";
import youtubedl from "youtube-dl";
import { DownloadedVideo } from "./";

export class VideoDownloader {
  static async fetch(url: string) {
    if (!fs.existsSync(configurator.file.processingDir))
      fs.mkdirSync(configurator.file.processingDir);

    console.log(`video url: ${url}`);

    let downloader = youtubedl(
      url,
      ["-f bestvideo+bestaudio/best", "--merge-output-format=mp4"],
      {
        cwd: configurator.file.processingDir
      }
    );

    let targetPath = path.join(
      configurator.file.processingDir,
      `TODO_NAME_THIS.mp4`
    );

    downloader.pipe(fs.createWriteStream(targetPath));

    return new Promise<any>((success, fail) => {
      downloader.on("end", () => {
        let downloadedVid = new DownloadedVideo({
          location: targetPath,
          redditPostId: "TODO_REDDIT_POST_ID???"
        });

        console.log(`successfully downloaded to ${downloadedVid.location}`);
        success(downloadedVid);
      });

      downloader.on("error", info => {
        fs.unlinkSync("./file.mp4");
        console.error(`error on download: ${info.filename}`);
        fail(info);
      });
    });
  }
  static async fetch(redditPost: Submission) {
    if (!fs.existsSync(configurator.file.processingDir))
      fs.mkdirSync(configurator.file.processingDir);

    let videoUrl = redditPost.url;

    if (videoUrl == null) throw new Error("SOMEHOW videoUrl is null");
    console.log(`video URL: ${videoUrl}`);
    console.log(redditPost);

    let downloader = youtubedl(
      videoUrl,
      ["-f bestvideo+bestaudio/best", "--merge-output-format=mp4"],
      {
        cwd: configurator.file.processingDir
      }
    );

    let targetLocation = path.join(
      configurator.file.processingDir,
      `${redditPost.id}.mp4`
    );

    downloader.pipe(fs.createWriteStream(targetLocation));

    return new Promise<any>((success, fail) => {
      downloader.on("end", () => {
        let downloadedVideo = new DownloadedVideo({
          location: targetLocation,
          redditPostId: redditPost.id
        });
        console.log(`successfully downloaded to ${downloadedVideo.location}`);
        success(downloadedVideo);
      });
      downloader.on("error", info => {
        fs.unlinkSync("./file.mp4");
        console.error(`error on download: ${info.filename}`);
        fail(info);
      });
    });
  }
}
