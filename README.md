# a-mirror
A mirror bot for reddit. This bot will attempt to mirror linked video posts from supported services and post a link to them.

a-mirror cannot function without its sidekick, [a-mirror-web](https://github.com/kyleratti/a-mirror-web).

## Retention Policy
The **a-mirror** bot will retain mirrored videos for up to 30 days. Anything beyond that is not guaranteed. If you're interested in using **a-mirror** on your subreddit but need a longer retention period, please [contact the author](https://reddit.com/message/compose/?to=Clutch_22&subject=a-mirror-bot%20retention%20period).

## Data Processing and Data Collected
I have no interest in your personal data; **a-mirror** collects only the data it needs to function via reddit's public API. In addition to needing the URL of the original submission, the date/time of the mirror, its status, and number of views are all necessary for use with the retention policy listed above. Because I feel like it'll come up, view counting is a number in a database; no identifying information is stored with it. The date and time of the last view is, again, only stored to assist with the retention policy.

* Permalink to the OP
* Date and time of posting
* Whether or not the video has been mirrored yet
* Number of views on the mirror
* Last view date and time

## Supported Sites
Only the below sites/services are supported by **a-mirror**:

* YouTube

## Supported Subreddits
The following subreddits rely on **a-mirror** for his holy botness:

* [/r/WranglerYJ](https://reddit.com/r/WranglerYJ) (doesn't really count since I'm a mod here)
* ...no one else! :-(

## Current Features

* Mirroring of YouTube linked posts (note that we are limited by region blocks)

### Planned Features

* `webm` conversion for reduced bandwidth and file sizes
* reddit video support
* Gfycat support
* imgur support
* `!mirror` comment support to attempt to mirror the OP/the link in the parent comment
