import request from "request-promise";
import { configurator } from "tuckbot-util";
import { ACMUpdateOptions } from "../structures";

export class ACMApi {
  static async update(data: ACMUpdateOptions) {
    return request({
      uri: `${configurator.acm.endpoint}/mirroredvideos/update`,
      method: "POST",
      headers: {
        "X-ACM-API-Token": configurator.acm.apiToken,
        "X-ACM-Bot-Token": configurator.acm.botToken,
      },
      body: { data: data },
      json: true,
    });
  }
}
