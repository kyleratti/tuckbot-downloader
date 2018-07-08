export declare function load(): {
    /** App configuration */
    app: {
        file: {
            /** The file storage mode */
            storeMode: string;
            /** Local file storage mode configuration */
            local: {
                /** The local directory to store files in */
                storageDir: string;
            };
        };
    };
    /** reddit configuration */
    reddit: {
        /** The client ID of the application */
        clientID: string;
        /** The client secret of the application */
        clientSecret: string;
        /** The username of the reddit account (bot account) */
        username: string;
        /** The password of the reddit account (bot account) */
        password: string;
        /** The unique user agent to use with the reddit API */
        userAgent: string;
        /** An array of subreddits to scan and mirror content in */
        scanSubsList: string[];
        /** Whether or not to scan comments for the mirror keyword */
        scanComments: boolean;
        /** The mirror keyword to scan for */
        scanKeyword: string;
    };
};
