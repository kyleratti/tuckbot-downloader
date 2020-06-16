FROM jrottenberg/ffmpeg:4.2-alpine as ffmpeg-bin
FROM node:12-alpine AS app-build
ARG FFMPEG_LOCATION
ARG PROCESSING_DIR
ARG REDDIT_CLIENT_ID
ARG REDDIT_CLIENT_SECRET
ARG REDDIT_USERNAME
ARG REDDIT_PASSWORD
ARG REDDIT_USER_AGENT
ARG REDDIT_SCAN_SUBS
ARG LOGGER_ELASTICSEARCH_INDEX
ARG LOGGER_ELASTICSEARCH_NODE
ARG LOGGER_LEVEL
ARG STORAGE_S3_ENDPOINT
ARG STORAGE_S3_ACCESS_KEY_ID
ARG STORAGE_S3_SECRET_ACCESS_KEY
ARG STORAGE_S3_BUCKET
ARG TUCKBOT_API_URL
ARG TUCKBOT_API_TOKEN
ARG TUCKBOT_FRONTEND_CDNURL
ARG TUCKBOT_FRONTEND_URL
ARG ACM_ENDPOINT
ARG ACM_API_TOKEN
ARG ACM_BOT_TOKEN
RUN apk add python git
COPY --from=ffmpeg-bin / /
RUN mkdir -p /app-src
WORKDIR /app-src
COPY src/ /app-src/src/
COPY package.json /app-src/
COPY package-lock.json /app-src/
COPY jest.config.js /app-src/
RUN npm install
RUN npm run build
RUN npm run test

FROM node:12-alpine AS app-runtime
RUN apk add python
RUN mkdir /app
COPY --from=ffmpeg-bin / /
COPY --from=app-build /app-src/node_modules/ /app/node_modules/
COPY --from=app-build /app-src/lib/ /app/lib/

WORKDIR /app
CMD [ "node", "-r", "dotenv/config", "lib/index.js" ]
