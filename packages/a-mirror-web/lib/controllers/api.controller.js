"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const lib_1 = require("a-mirror-util/lib/");
const server_1 = require("../server");
const video_1 = require("../models/video");
const appToken = lib_1.configurator.auth.token;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, lib_1.configurator.file.local.storageDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer_1.default({ storage: storage });
const router = express_1.Router();
/**
 * Checks if the specified request is authorized
 * @param req The request to evaluate
 */
function authorized(req) {
    if (req.method === 'GET')
        return req.headers.token === appToken;
    return req.body && req.body.token === appToken;
}
router.get('/debug/video/getall', (req, res) => {
    if (!authorized(req))
        return server_1.response(res, http_status_codes_1.default.FORBIDDEN, 'Unauthorized');
    video_1.Video.findAll()
        .then((videos) => {
        let data = [];
        videos.forEach(vid => {
            data.push({
                id: vid.id,
                redditPostId: vid.redditPostId,
                videoUrl: vid.videoUrl,
                status: vid.status,
                views: vid.views,
                lastView: vid.lastView
            });
        });
        res.status(http_status_codes_1.default.OK).send(data);
    });
});
router.post('/debug/video/resetdownloading', (req, res) => {
    if (!authorized(req))
        return server_1.response(res, http_status_codes_1.default.FORBIDDEN, 'Unauthorized');
    video_1.Video.update({
        status: video_1.Status.NewRequest
    }, {
        where: {
            status: video_1.Status.Downloading
        }
    })
        .then(() => {
        return server_1.response(res, http_status_codes_1.default.OK, 'OK');
    })
        .catch(err => {
        return server_1.response(res, http_status_codes_1.default.INTERNAL_SERVER_ERROR, err);
    });
});
router.get('/video/getinfo/:redditPostId', (req, res) => {
    let redditPostId = req.params.redditPostId;
    video_1.Video.find({
        where: {
            redditPostId: redditPostId
        },
        limit: 1
    }).then(vid => {
        if (!vid)
            return server_1.response(res, http_status_codes_1.default.NOT_FOUND, 'Video not found');
        let data = {
            redditPostId: vid.redditPostId,
            videoUrl: vid.videoUrl,
            status: vid.status,
            views: vid.views,
            lastView: vid.lastView
        };
        return server_1.response(res, http_status_codes_1.default.OK, 'OK', data);
    });
});
router.get('/video/getnew', (req, res) => {
    if (!authorized(req))
        return server_1.response(res, http_status_codes_1.default.FORBIDDEN, 'Unauthorized');
    video_1.Video.findAll({
        where: {
            status: video_1.Status.NewRequest
        },
        limit: 3 // let's try and handle no more than a few for each time we poll
    })
        .then(videos => {
        let data = [];
        videos.forEach(vid => {
            data.push({
                id: vid.id,
                videoUrl: vid.videoUrl,
                redditPostId: vid.redditPostId,
                status: vid.status,
                views: vid.views,
                lastView: vid.lastView
            });
        });
        return server_1.response(res, http_status_codes_1.default.OK, 'OK', data);
    });
});
router.get('/video/getmirrored', (req, res) => {
    if (!authorized(req))
        return server_1.response(res, http_status_codes_1.default.FORBIDDEN, 'Unauthorized');
    video_1.Video.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { status: video_1.Status.LocallyMirrored },
            ],
        },
        limit: 5 // to help prevent hitting the API throttle limit
    }).then(videos => {
        let data = [];
        videos.forEach(vid => {
            data.push({
                id: vid.id,
                videoUrl: vid.videoUrl,
                redditPostId: vid.redditPostId,
                status: vid.status,
                views: vid.views,
                lastView: vid.lastView
            });
        });
        return server_1.response(res, http_status_codes_1.default.OK, 'OK', data);
    });
});
router.put('/video/queue', (req, res) => {
    if (!authorized(req))
        return server_1.response(res, http_status_codes_1.default.FORBIDDEN, 'Unauthorized');
    let data = req.body;
    video_1.Video.find({
        where: {
            redditPostId: data.redditPostId
        },
        limit: 1
    })
        .then(vid => {
        if (vid)
            return server_1.response(res, http_status_codes_1.default.CONFLICT, 'Video already exists', {
                redditPostId: data.redditPostId,
                videoUrl: data.videoUrl
            });
        let newVid = video_1.Video.create({
            redditPostId: data.redditPostId,
            videoUrl: data.videoUrl,
            status: video_1.Status.NewRequest
        }).then(newVid => {
            return server_1.response(res, http_status_codes_1.default.CREATED, 'Created video request', {
                id: newVid.id,
                redditPostId: newVid.redditPostId,
                videoUrl: newVid.videoUrl,
                status: newVid.status,
                views: newVid.views,
                lastView: newVid.lastView
            });
        });
    });
});
router.post('/video/update', (req, res) => {
    if (!authorized(req))
        return server_1.response(res, http_status_codes_1.default.UNAUTHORIZED, 'Unauthorized');
    let data = req.body;
    let updatedData = {};
    if (data.status)
        updatedData['status'] = data.status;
    if (data.filename)
        updatedData['filename'] = data.filename;
    if (data.views)
        updatedData['views'] = data.views;
    if (data.lastView)
        updatedData['lastView'] = data.lastView;
    video_1.Video.update(updatedData, {
        where: {
            redditPostId: data.redditPostId
        }
    })
        .then(() => {
        return server_1.response(res, http_status_codes_1.default.OK, 'Record updated successfully');
    })
        .catch((err) => {
        return server_1.response(res, http_status_codes_1.default.INTERNAL_SERVER_ERROR, `Unable to update record: ${err}`);
    });
});
router.post('/video/upload', upload.single('video'), (req, res) => {
    if (!authorized(req))
        return server_1.response(res, http_status_codes_1.default.UNAUTHORIZED, 'Unauthorized');
    if (!req.file)
        return server_1.response(res, http_status_codes_1.default.UNPROCESSABLE_ENTITY, 'No file was attached');
    if (!req.body.redditPostId)
        return server_1.response(res, http_status_codes_1.default.UNPROCESSABLE_ENTITY, 'No reddit post id specified');
    let redditPostId = req.body.redditPostId;
    let videoFile = req.file;
    let fileExt = path_1.default.extname(videoFile.originalname);
    if (lib_1.configurator.file.local.storageDir) {
        video_1.Video.update({ status: video_1.Status.LocallyMirrored, filename: videoFile.originalname }, { where: { redditPostId: redditPostId } })
            .then(() => {
            return server_1.response(res, http_status_codes_1.default.OK, 'File uploaded successfully');
        })
            .catch((err) => {
            return server_1.response(res, http_status_codes_1.default.INTERNAL_SERVER_ERROR, `Error processing upload: ${err}`);
        });
    }
    else {
        return server_1.response(res, http_status_codes_1.default.INTERNAL_SERVER_ERROR, 'File not not picked up by processor; request discarded');
    }
});
exports.APIController = router;
//# sourceMappingURL=api.controller.js.map