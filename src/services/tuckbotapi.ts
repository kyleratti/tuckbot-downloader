import request from "request-promise";
import { configurator } from "tuckbot-util";
import { VideoUpdateOptions } from "../structures";

export class TuckbotApi {
  static async update(data: VideoUpdateOptions) {
    return request({
      uri: `${configurator.tuckbot.api.url}/private/video`,
      method: "POST",
      headers: {
        "X-Tuckbot-API-Token": configurator.tuckbot.api.token
      },
      body: data,
      json: true
    });
  }
}
