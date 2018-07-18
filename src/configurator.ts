import * as dotenv from 'dotenv';

/** Loads the .env file into the environment and returns the current config */
export function load() {
    let objResult = dotenv.load();
    if(objResult.error)
        throw objResult.error
    
    return {
        /** App configuration */
        app: {
            file: {
                /** The file storage mode */
                storeMode: String(process.env.FILE_STORE_MODE),

                /** Local file storage mode configuration */
                local: {
                    /** The local directory to store files in */
                    storageDir: String(process.env.LOCAL_STORAGE_DIR),
                }
            },

            auth: {
                /** The token used to authenticate private API requests */
                token: String(process.env.AUTH_TOKEN)
            },

            /** The full URL to the web endpoint */
            webUrl: String(process.env.WEB_URL),
            /** The full URL to the cdn endpoint */
            cdnUrl: String(process.env.CDN_URL),
            /** The full URL to the api endpoint */
            apiUrl: String(process.env.API_URL)
        },

        /** Database configuration */
        database: {
            location: String(process.env.DATABASE_LOCATION)
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
            /** Whether or not to scan comments for the mirror keyword */
            scanComments: Boolean(process.env.REDDIT_SCAN_COMMENTS),
            /** The mirror keyword to scan for */
            scanKeyword: String(process.env.REDDIT_SCAN_KEYWORD),
        }
    }
}
