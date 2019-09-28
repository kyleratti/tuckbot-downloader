import { SubredditScanner } from "./scanners";

export class Server {
  start() {
    let subredditScanner = new SubredditScanner({
      scanInterval: 1000 * 20
    });
    subredditScanner.start();
  }
}
