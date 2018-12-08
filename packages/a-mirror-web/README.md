# a-mirror-web
The web interface (public endpoint, cdn, and api) for a-mirror. Techically a-mirror-web can run without a-mirror, but a-mirror cannot run without a-mirror-web.

## Public Endpoint
This endpoint can be hit by anyone without any authentication. The below routes are supported:

* `GET /`
* `GET /:redditPostId`

These endpoints can be hit from `amirror.link`.

## CDN Endpoint
This endpoint can be hit by anyone without any authentication. The below routes are supported:

* `GET /img/:resource.ext`
* `GET /css/:resource.ext`
* `GET /video/:resource.ext`

## API Endpoint
This endpoint is protected against unauthorized users. a-mirror uses this endpoint to keep track of the application's state.

* `GET /debug/video/getall` - Dumps all data from the database
* `GET /video/getinfo/:redditPostId` - Retrieves information about the specified reddit post id (if any)
* `GET /video/getnew` - Retrieves a maximum of **3** new mirror requests
* `GET /video/getmirrored` - Retrieves a maximum of **5** videos that are mirrored but have not had their links shared
* `PUT /video/add` - Puts a new mirror request in the database
* `POST /video/update` - Posts updated information about a post to the database
* `PUT /video/upload` - Uploads a mirrored video file to the server

## Video Storage
Currently, files are all stored locally in a directory specified in `.env`. Depending on the popularity of this project, a library may be added to provide a generalized API for handling videos regardless of destination (local vs. S3), but for now that's outside the scope of this project.

You may be wondering why a-mirror downloads the file and then uploads it to the API. At first glance this may seem like a strange setup, but there's a few reasons:

1. As a-mirror gains more functionality (ie. transcoding), it can scale easier as files are not stored in the a-mirror instance
2. Centralized local storage isn't necessary (this would negate number 1, but mean the infrastructure all has to live in the same place)
3. If deemed necessary by demand, the web API can then choose where to store and serve them appropriately without having to change anything in a-mirror itself
