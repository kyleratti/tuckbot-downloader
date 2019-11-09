export interface ConfigOptions {
  /** The frequency (in ms) that the scanner should run */
  scanInterval: number;
}

export abstract class Scanner {
  /** The frequency (in ms) that the scanner should run */
  public readonly scanInterval: number;

  constructor(options: ConfigOptions) {
    this.scanInterval = options.scanInterval;
  }

  /** Launches the scanner */
  abstract start(): void;
}
