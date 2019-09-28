# tuckbot-downloader

![Tucker](https://raw.githubusercontent.com/kyleratti/tuckbot-downloader/master/img/tucker.jpg)

This bot will attempt to mirror linked video posts from supported services and post a link to them. It's named after my dog, Tucker.

This part of the project polls participating subreddits for valid videos, downloads them, converts them (if necessary), uploads them to secondary storage, and then sends the public link to my other project, [a-centralized-mirror](https://github.com/kyleratti/a-centralized-mirror), to be posted in the comments.

There's a few other pieces to Tuckbot.

- [tuckbot-util](https://github.com/kyleratti/tuckbot-util/) - A few utility things that are standardized across tuckbot
- [tuckbot-web](https://github.com/kyleratti/tuckbot-web/) - The public web-facing servers

## Retention Policy

**Tuckbot** will store mirrored videos for however long I consider to be financially appropriate. This is not a professional service so I make no guarantees to availability/uptime/retention.

## Data Processing and Data Collected

I have no interest in personal data; **Tuckbot** collects only the data it needs to function, and all of it is obtained via reddit's public API.

- Permalink to the OP
- Date and time of submission
- Last view date and time

## Supported Sites

Basically anything supported by [youtube-dl](https://youtube-dl.org/) is supported.

## Active Subreddits

The following subreddits are friends of **Tuckbot**:

- [/r/PublicFreakout](https://reddit.com/r/PublicFreakout)

# And a standing ovation to...

I absolutely _cannot_ thank **[RoboPhred](https://github.com/robophred)** enough for this help with this project and every single project I've worked on for the past decade. You are, without a doubt, the smartest man I'll ever know and the only reason I can program in any language at all. Your patience with me over the years is nothing short of astounding. Here's to you man!
