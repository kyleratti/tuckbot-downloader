import request from "request-promise";
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
    return request({
      uri: `${configurator.tuckbot.api.url}/private/video`,
      method: "POST",
      headers: {
        "X-Tuckbot-API-Token": configurator.tuckbot.api.token,
      },
      body: data,
      json: true,
    });
  }

  static async prune(
    vid: MirroredVideo | StaleVideo
  ): Promise<PruneVideoResponse> {
    return request({
      uri: `${configurator.tuckbot.api.url}/private/video/prune/${vid.redditPostId}`,
      method: "POST",
      headers: {
        "X-Tuckbot-API-Token": configurator.tuckbot.api.token,
      },
      json: true,
    });
  }

  static async remove(
    vid: MirroredVideo | StaleVideo
  ): Promise<RemoveVideoResponse> {
    return request({
      uri: `${configurator.tuckbot.api.url}/private/video/${vid.redditPostId}`,
      method: "DELETE",
      headers: {
        "X-Tuckbot-API-Token": configurator.tuckbot.api.token,
      },
      json: true,
    });
  }

  static async fetchStale(): Promise<FetchStaleVideosResponse> {
    return request({
      uri: `${configurator.tuckbot.api.url}/private/video/stalevideos`,
      method: "GET",
      headers: {
        "X-Tuckbot-API-Token": configurator.tuckbot.api.token,
      },
      json: true,
    });
  }
}
