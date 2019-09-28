import { configurator } from "a-mirror-util";
import aws from "aws-sdk";
import * as fs from "fs";
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
        Key: `key-${video.redditPostId}`,
        Body: fs.readFileSync(video.location)
      })
      .promise();
  }
}
