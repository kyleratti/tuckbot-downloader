import { DeadContentScanner, SubredditScanner } from "./scanners";

export class Server {
  start() {
    let subredditScanner = new SubredditScanner({
      scanInterval: 1000 * 20,
    });
    subredditScanner.start();

    let deadcontentScanner = new DeadContentScanner({
      scanInterval: 1000 * 45,
    });
    deadcontentScanner.start();
  }
}
