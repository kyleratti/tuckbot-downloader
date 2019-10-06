import * as fs from "fs";

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
}
