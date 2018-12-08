declare const _default: {
    /** App configuration */
    app: {
        /** The full URL to the web endpoint */
        webUrl: string;
        /** The port to listen on for web requests */
        webPort: number;
        /** The full URL to the cdn endpoint */
        cdnUrl: string;
        /** The port to listen on for CDN requests */
        cdnPort: number;
        /** The full URL to the api endpoint */
        apiUrl: string;
        /** The port to listen on for api requests */
        apiPort: number;
        /** The base domain */
        baseDomain: string;
        /** The environment the app is running in */
        environment: string;
    };
    /** Authentication configuration */
    auth: {
        /** The token used to authenticate private API requests */
        token: string;
    };
    /** Database configuration */
    database: {
        location: string;
    };
    /** Storage configuration */
    file: {
        /** The file storage mode */
        storeMode: string;
        /** The processing directory for temporary files */
        processingDir: string;
        /** Local file storage mode configuration */
        local: {
            /** The local directory to store files in */
            storageDir: string;
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
    };
};
export default _default;
