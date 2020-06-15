import { DeadContentScanner, SubredditScanner } from "./scanners";

export class Server {
  start() {
    const subredditScanner = new SubredditScanner({
      scanInterval: 1000 * 20, // TODO: set these from an environment variable
    });
    subredditScanner.start();

    const deadcontentScanner = new DeadContentScanner({
      scanInterval: 1000 * 30, // TODO: set these from an environment variable
    });
    deadcontentScanner.start();
  }
}
