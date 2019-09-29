import fs from "fs";
import path from "path";
import { configurator } from "tuckbot-util";
import youtubedl from "youtube-dl";
import { VideoDownloaderConfig } from "../structures";
import { DownloadedVideo } from "./";

export class VideoDownloader {
  static async fetch(data: VideoDownloaderConfig) {
    if (!fs.existsSync(configurator.file.processingDir))
      fs.mkdirSync(configurator.file.processingDir);

    if (data.videoUrl == null) throw new Error("SOMEHOW videoUrl is null");
    console.log(`video url: ${data.videoUrl}`);
    console.log(data);

    let downloader = youtubedl(
      data.videoUrl,
      ["-f=bestvideo+bestaudio/best", "--merge-output-format=mp4"],
      {
        cwd: configurator.file.processingDir
      }
    );
    console.log(downloader);

    let targetPath = path.join(
      configurator.file.processingDir,
      `${data.redditPostId}.mp4`
    );

    downloader.pipe(fs.createWriteStream(targetPath));

    return new Promise<DownloadedVideo>((success, fail) => {
      downloader.on("end", () => {
        let downloadedVid = new DownloadedVideo({
          location: targetPath,
          redditPostId: data.redditPostId
        });

        console.log(`successfully downloaded to ${downloadedVid.location}`);
        success(downloadedVid);
      });

      downloader.on("error", info => {
        if (fs.existsSync(`test/${data.redditPostId}.mp4`))
          fs.unlinkSync(`test/${data.redditPostId}.mp4`);
        console.error(`error on download: ${info.filename}`);
        fail(info);
      });
    });
  }
}
