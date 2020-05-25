import axios from "axios";
import { configurator } from "tuckbot-util";
import { ACMUpdateOptions } from "../structures";

export class ACMApi {
  static async update(data: ACMUpdateOptions) {
    return axios.post(
      `${configurator.acm.endpoint}/mirroredvideos/update`,
      { data: data },
      {
        headers: {
          "X-ACM-API-Token": configurator.acm.apiToken,
          "X-ACM-Bot-Token": configurator.acm.botToken,
        },
        responseType: "json",
      }
    );
  }
}
