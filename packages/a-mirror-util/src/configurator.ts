import * as dotenv from 'dotenv';

let result = dotenv.load();
if(result.error)
    throw result.error;

export default {
    /** App configuration */
    app: {
        /** The full URL to the web endpoint */
        webUrl: String(process.env.WEB_URL),
        /** The port to listen on for web requests */
        webPort: Number(process.env.WEB_PORT),

        /** The full URL to the cdn endpoint */
        cdnUrl: String(process.env.CDN_URL),
        /** The port to listen on for CDN requests */
        cdnPort: Number(process.env.CDN_PORT),

        /** The full URL to the api endpoint */
        apiUrl: String(process.env.API_URL),
        /** The port to listen on for api requests */
        apiPort: Number(process.env.API_PORT),

        /** The base domain */
        baseDomain: String(process.env.BASE_DOMAIN),
        
        /** The environment the app is running in */
        environment: String(process.env.ENVIRONMENT)
    },

    /** Authentication configuration */
    auth: {
        /** The token used to authenticate private API requests */
        token: String(process.env.AUTH_TOKEN)
    },

    /** Database configuration */
    database: {
        location: String(process.env.DATABASE_LOCATION)
    },

    /** Storage configuration */
    file: {
        /** The file storage mode */
        storeMode: String(process.env.FILE_STORE_MODE),

        /** The processing directory for temporary files */
        processingDir: String(process.env.PROCESSING_DIR),

        /** Local file storage mode configuration */
        local: {
            /** The local directory to store files in */
            storageDir: String(process.env.LOCAL_STORAGE_DIR),
        }
    },

    /** reddit configuration */
    reddit: {
        /** The client ID of the application */
        clientID: String(process.env.REDDIT_CLIENT_ID),
        /** The client secret of the application */
        clientSecret: String(process.env.REDDIT_CLIENT_SECRET),
        /** The username of the reddit account (bot account) */
        username: String(process.env.REDDIT_USERNAME),
        /** The password of the reddit account (bot account) */
        password: String(process.env.REDDIT_PASSWORD),
        /** The unique user agent to use with the reddit API */
        userAgent: String(process.env.REDDIT_USER_AGENT),
        /** An array of subreddits to scan and mirror content in */
        scanSubsList: String(process.env.REDDIT_SCAN_SUBS).split(','),
    }
}

