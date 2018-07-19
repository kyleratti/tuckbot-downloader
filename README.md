# a-mirror
A mirror bot for reddit. This bot will attempt to mirror linked video posts from supported services and post a link to them.

This library polls the api for new mirror requests and attempts to fulfill them. If it's successful, it'll upload the file back to the api, otherwise it'll update the status with the api.

a-mirror has a lot of pieces that all rely on each other to work:

* [a-mirror](https://github.com/kyleratti/a-mirror/) - (you are here)
* [a-mirror-scanner](https://github.com/kyleratti/a-mirror/) - The subreddit scanning server
* [a-mirror-transcoder](https://github.com/kyleratti/a-mirror/transcoder/) - The video transcoder
* [a-mirror-util](https://github.com/kyleratti/a-mirror/) - A few utility things that are standardized across a-mirror
* [a-mirror-web](https://github.com/kyleratti/a-mirror-web/) - The public, cdn, and api server

At a glance it probably looks stupid to split the project into 5 parts, but I assure you it's done for good reasons:
* Infrastructure can be moved as necessary. For example: I can handle the CPU-intensive transcoding process on my dedicated servers while leaving much smaller cloud VM's to serve web traffic
* The downloaders and transcoders can be easily scaled to additional servers as demand dictates
* The API can dynamically decide where to store (and therefore how to serve) videos without changing the downloaders or transcoders

## Retention Policy
**a-mirror** bot will retain mirrored videos for up to 30 days. Anything beyond that is not guaranteed. If you're interested in using **a-mirror** on your subreddit but need a longer retention period, please [contact the author](https://reddit.com/message/compose/?to=Clutch_22&subject=a-mirror-bot%20retention%20period).

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

# And a standing ovation to...
I absolutely *cannot* thank **[RoboPhred](https://github.com/robophred)** enough for this help with this project and every single project I've worked on for the past decade. You are, without a doubt, the smartest man I'll ever know and the only reason I can program in any of the languages I know. Your patience with me over the years is nothing short of astounding.

Here's to you man!
