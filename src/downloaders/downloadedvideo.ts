import * as fs from "fs";
import * as path from "path";

export interface VideoData {
  location: string;
  redditPostId: string;
}

export class DownloadedVideo {
  location: string;
  redditPostId: string;

  constructor(data: VideoData) {
    this.location = data.location;
    this.redditPostId = data.redditPostId;
  }

  cleanup() {
    const filePath = path.join(this.location, `/${this.redditPostId}.mp4`);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}
