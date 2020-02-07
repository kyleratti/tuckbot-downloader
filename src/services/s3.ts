import * as aws from "aws-sdk";
import * as fs from "fs";
import { configurator, MirroredVideo } from "tuckbot-util";
import { DownloadedVideo } from "../downloaders";

const endpoint = new aws.Endpoint(configurator.storage.s3.endpoint);
const s3 = new aws.S3({
  endpoint: endpoint.href,
  accessKeyId: configurator.storage.s3.accessKeyId,
  secretAccessKey: configurator.storage.s3.secretAccessKey
});

export class S3 {
  static remove(video: MirroredVideo) {
    return s3
      .deleteObject({
        Bucket: configurator.storage.s3.bucket,
        Key: `${video.redditPostId}.mp4` // TODO: actually get the file name instead of assuming .mp4
      })
      .promise();
  }

  static upload(video: DownloadedVideo) {
    return s3
      .upload({
        Bucket: configurator.storage.s3.bucket,
        Key: `${video.redditPostId}.mp4`, // TODO: actually get the file name instead of assuming .mp4
        Body: fs.readFileSync(video.location),
        ACL: "public-read"
      })
      .promise();
  }
}
