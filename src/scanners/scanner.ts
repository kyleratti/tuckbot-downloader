export interface ConfigOptions {
    /** The frequency (in ms) that the scanner should run */
    scanInterval: number
}

export abstract class Scanner {
    /** The frequency (in ms) that the scanner should run */
    private scanInterval;

    constructor(options: ConfigOptions) {
        this.scanInterval = options.scanInterval;

        setInterval(this.start, this.scanInterval);
    }

    /** Launches the scanner */
    abstract start(): void;
}
