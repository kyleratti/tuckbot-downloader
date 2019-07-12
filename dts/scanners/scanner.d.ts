export interface ConfigOptions {
    /** The frequency (in ms) that the scanner should run */
    scanInterval: number;
}
export declare abstract class Scanner {
    /** The frequency (in ms) that the scanner should run */
    private scanInterval;
    constructor(options: ConfigOptions);
    /** Launches the scanner */
    abstract start(): void;
}
