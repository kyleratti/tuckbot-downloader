import aws from "aws-sdk";
import * as fs from "fs";
import { configurator } from "tuckbot-util";
import { DownloadedVideo } from "../downloaders";

let endpoint = new aws.Endpoint(configurator.storage.s3.endpoint);
let s3 = new aws.S3({
  endpoint: endpoint.href,
  accessKeyId: configurator.storage.s3.accessKeyId,
  secretAccessKey: configurator.storage.s3.secretAccessKey
});

export class S3Uploader {
  static upload(video: DownloadedVideo) {
    return s3
      .upload({
        Bucket: configurator.storage.s3.bucket,
        Key: `${video.redditPostId}.mp4`,
        Body: fs.readFileSync(video.location),
        ACL: "public-read"
      })
      .promise();
  }
}
