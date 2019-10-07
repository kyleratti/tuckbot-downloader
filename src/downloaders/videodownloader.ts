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

    let targetPath = path.join(
      configurator.file.processingDir,
      `${data.redditPostId}.mp4`
    );

    return new Promise<DownloadedVideo>((success, fail) => {
      // I fought with this fucking thing for several hours and finally figured it out
      // This bug actually plagued the project back in its first iteration, too, and I had no clue why
      // I spent additional hours during this re-write trying to figure out why the hell random videos failed
      // Eventually I stumbled upon this issue: https://github.com/przemyslawpluta/node-youtube-dl/issues/221
      // In the event the issue disappears, I'll summarize: you need to use youtubedl.exec(...) instead of calling
      // youtubedl(...) directly as some video sources have multiple streams. This breaks the event model. When
      // you call exec(), all of the processing work is done by youtubedl - you just lose the fancy events and
      // progress reporting.
      youtubedl.exec(
        data.videoUrl,
        [
          `-f`,
          `bestvideo+bestaudio/best`,
          `--recode-video`,
          `mp4`,
          `--merge-output-format`,
          `mp4`,
          `--ffmpeg-location`,
          `${ffmpeg_bin.path}`
        ],
        {
          cwd: configurator.file.processingDir
        },
        (err, _output) => {
          if (err) return fail(err);

          return success(
            new DownloadedVideo({
              location: targetPath,
              redditPostId: data.redditPostId
            })
          );
        }
      );
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
