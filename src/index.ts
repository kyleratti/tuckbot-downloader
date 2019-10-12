import { Server } from "./server";
import { SubredditScanner } from "./scanners";

if (
  process.env.NODE_ENV === "PRODUCTION" ||
  process.env.DEBUG_START_ANYWAY != null
) {
  let server = new Server();
  server.start();
} else {
  SubredditScanner.processVideo({
    redditPostId: "test",
    title:
      "Ulster town officials release video of county Legislator Jennifer Schwartz Berky's traffic stop",
    url: "https://www.youtube.com/watch?v=ffaTOD8O-Qs"
  });
}
