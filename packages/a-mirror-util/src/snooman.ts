import snoowrap from 'snoowrap';

import configurator from './configurator';

let wrap: snoowrap = new snoowrap({
    userAgent: configurator.reddit.userAgent,
    clientId: configurator.reddit.clientID,
    clientSecret: configurator.reddit.clientSecret,
    username: configurator.reddit.username,
    password: configurator.reddit.password
});
wrap.config({continueAfterRatelimitError: false, debug: true});

export default {
    /** The snoowrap instance */
    wrap: wrap
}
