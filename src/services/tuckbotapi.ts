import axios from "axios";
import {
  configurator,
  FetchStaleVideosResponse,
  MirroredVideo,
  PruneVideoResponse,
  RemoveVideoResponse,
  StaleVideo,
  VideoUpdateRequestOptions,
} from "tuckbot-util";

export class TuckbotApi {
  static async update(data: VideoUpdateRequestOptions) {
    return axios.post(`${configurator.tuckbot.api.url}/private/video`, data, {
      headers: {
        "X-Tuckbot-API-Token": configurator.tuckbot.api.token,
      },
      responseType: "json",
    });
  }

  static async prune(
    vid: MirroredVideo | StaleVideo
  ): Promise<PruneVideoResponse> {
    return axios.post(
      `${configurator.tuckbot.api.url}/private/video/prune/${vid.redditPostId}`,
      {},
      {
        headers: {
          "X-Tuckbot-API-Token": configurator.tuckbot.api.token,
        },
        responseType: "json",
      }
    );
  }

  static async remove(
    vid: MirroredVideo | StaleVideo
  ): Promise<RemoveVideoResponse> {
    return axios.delete(
      `${configurator.tuckbot.api.url}/private/video/${vid.redditPostId}`,
      {
        headers: {
          "X-Tuckbot-API-Token": configurator.tuckbot.api.token,
        },
        responseType: "json",
      }
    );
  }

  static async fetchStale(): Promise<FetchStaleVideosResponse> {
    return axios.get(
      `${configurator.tuckbot.api.url}/private/video/stalevideos`,
      {
        headers: {
          "X-Tuckbot-API-Token": configurator.tuckbot.api.token,
        },
        responseType: "json",
      }
    );
  }
}
