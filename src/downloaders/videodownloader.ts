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

    let downloader = youtubedl(data.videoUrl, ["--merge-output-format=mp4"], {
      cwd: configurator.file.processingDir
    });

    let targetPath = path.join(
      configurator.file.processingDir,
      `${data.redditPostId}.mp4`
    );

    return new Promise<DownloadedVideo>((success, fail) => {
      downloader.pipe(fs.createWriteStream(targetPath));

      downloader.on("end", () => {
        let downloadedVid = new DownloadedVideo({
          location: targetPath,
          redditPostId: data.redditPostId
        });

        success(downloadedVid);
      });

      downloader.on("error", info => {
        if (fs.existsSync(`test/${data.redditPostId}.mp4`))
          fs.unlinkSync(`test/${data.redditPostId}.mp4`);

        fail(info);
      });
    });
  }
}
