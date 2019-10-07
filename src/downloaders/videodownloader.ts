import ffmpeg_bin from "ffmpeg-static";
import Ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path, { resolve } from "path";
import { configurator } from "tuckbot-util";
import youtubedl from "youtube-dl";
import { VideoDownloaderConfig } from "../structures";
import { DownloadedVideo } from "./";

Ffmpeg.setFfmpegPath(ffmpeg_bin.path);

export class VideoDownloader {
  static cleanup(redditPostId: string) {
    let location = resolve(
      configurator.file.processingDir,
      `${redditPostId}.mp4`
    );

    if (fs.existsSync(location)) fs.unlinkSync(location);
  }

  static async fetch(data: VideoDownloaderConfig) {
    if (!fs.existsSync(configurator.file.processingDir))
      fs.mkdirSync(configurator.file.processingDir);

    if (data.videoUrl == null) throw new Error("SOMEHOW videoUrl is null");

    let downloader = youtubedl(
      data.videoUrl,
      [
        `--format`,
        `bestvideo+bestaudio/best`,
        `--recode-video`,
        `mp4`,
        `--merge-output-format`,
        `mp4`,
        `--ffmpeg-location`,
        ffmpeg_bin.path
      ],
      {
        cwd: configurator.file.processingDir
      }
    );

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
        if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);

        fail(info);
      });
    });
  }

  static async convert(vid: DownloadedVideo) {
    if (!fs.existsSync(ffmpeg_bin.path))
      throw new Error("ffmpeg.path not found; conversion not possible");

    Ffmpeg(vid.location)
      .videoCodec("libx264")
      .audioCodec("libfaac")
      .format("mp4")
      .save(vid.location);
  }
}
