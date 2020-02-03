import ffmpeg_bin from "ffmpeg-static";
import Ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import fs from "fs";
import glob from "glob";
import { resolve } from "path";
import { configurator } from "tuckbot-util";
import youtubedl from "youtube-dl";
import { VideoDownloaderConfig } from "../structures";
import { DownloadedVideo } from "./";
import * as path from "path";

export class VideoDownloader {
  private static getFiles(redditPostId: string) {
    return glob.sync(configurator.file.processingDir + `${redditPostId}.*`, {});
  }

  static cleanup(redditPostId: string) {
    let files = this.getFiles(redditPostId);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fs.unlinkSync(file);
    }
  }

  private static locateVideo(redditPostId: string): string {
    let files = this.getFiles(redditPostId);

    if (!files || files.length <= 0)
      throw new Error(
        `Unable to locate "${redditPostId}.*" in "${configurator.file.processingDir}"`
      );

    let targetFile = files[0];

    /*
     * Originally, I was detecting if multiple files existed
     * If this was successful, there should only be one
     * However, youtube-dl's exec() function appears to run the callback
     * before youtube-dl finishes cleaning up the extra files. Instead,
     * we have to check for the existance of the .mp4 file. It's not as
     * clean as I'd like, but hey, if it works, it works.
     */
    if (files.length > 1)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          file ===
          path.join(configurator.file.processingDir, `${redditPostId}.mp4`)
        ) {
          targetFile = file;
          break;
        }
      }

    return resolve(targetFile);
  }

  static async fetch(data: VideoDownloaderConfig) {
    if (!fs.existsSync(configurator.file.processingDir))
      fs.mkdirSync(configurator.file.processingDir);

    return new Promise<DownloadedVideo>((success, fail) => {
      /*
       * I fought with this fucking thing for several hours and finally figured it out
       * This bug actually plagued the project back in its first iteration, too, and I had no clue why
       * I spent additional hours during this re-write trying to figure out why the hell random videos failed
       * Eventually I stumbled upon this issue: https://github.com/przemyslawpluta/node-youtube-dl/issues/221
       * In the event the issue disappears, I'll summarize: you need to use youtubedl.exec(...) instead of calling
       * youtubedl(...) directly as some video sources have multiple streams. This breaks the event model. When
       * you call exec(), all of the processing work is done by youtubedl - you just lose the fancy events and
       * progress reporting.
       */
      youtubedl.exec(
        data.videoUrl,
        [
          `-f`,
          `best[ext=mp4]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best`,
          `--ffmpeg-location`,
          `${ffmpeg_bin.path}`,
          `-o`,
          `${data.redditPostId}.%(ext)s`,
          `--recode-video`,
          `mp4`
        ],
        {
          cwd: configurator.file.processingDir
        },
        (err, _output) => {
          if (err) return fail(err);

          let location = VideoDownloader.locateVideo(data.redditPostId);

          return success(
            new DownloadedVideo({
              location: location,
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

    if (vid.location.endsWith(".mp4")) return vid;

    const outputFormat = "mp4";
    const newLocation = resolve(
      configurator.file.processingDir,
      `${vid.redditPostId}.${outputFormat}`
    );

    Ffmpeg.setFfmpegPath(ffmpeg_bin.path);

    Ffmpeg.getAvailableEncoders((err, encoders) => {
      console.log("getAvailableEncoders", encoders);
    });

    return new Promise<DownloadedVideo>((success, fail) => {
      let command = Ffmpeg(vid.location);

      console.log(new Date());
      console.log(command);
      command.audioCodec("aac");
      command.videoCodec("libx264");
      command.format(outputFormat);
      command.save(newLocation);
      command.on("error", err => {
        fail(err);
      });
      command.on("end", () => {
        console.log(`finished`);
        console.log(new Date());

        success(
          new DownloadedVideo({
            location: newLocation,
            redditPostId: vid.redditPostId
          })
        );
      });
    });
  }
}
