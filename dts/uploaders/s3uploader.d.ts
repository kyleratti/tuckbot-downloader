import aws from "aws-sdk";
import { DownloadedVideo } from "../downloaders";
export declare class S3Uploader {
    static upload(video: DownloadedVideo): Promise<aws.S3.ManagedUpload.SendData>;
}
