import { Router } from 'express';
import multer from 'multer';
import HttpStatus from 'http-status-codes';

import { Op } from 'sequelize';
import path from 'path';

import { configurator } from 'a-mirror-util/lib/';
import { response } from "../server";
import { Video, Status } from '../models/video';

const appToken: string = configurator.auth.token;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, configurator.file.local.storageDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
const router: Router = Router();

/**
 * Checks if the specified request is authorized
 * @param req The request to evaluate
 */
function authorized(req): boolean {
    if(req.method === 'GET')
        return req.headers.token === appToken;

    return req.body && req.body.token === appToken;
}

router.get('/debug/video/getall', (req, res) => {
    if(!authorized(req)) return response(res, HttpStatus.FORBIDDEN, 'Unauthorized');

    Video.findAll()
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

            res.status(HttpStatus.OK).send(data);
        });
});

router.post('/debug/video/resetdownloading', (req, res) => {
    if(!authorized(req)) return response(res, HttpStatus.FORBIDDEN, 'Unauthorized');

    Video.update({
        status: Status.NewRequest
    }, {
        where: {
            status: Status.Downloading
        }
    })
        .then(() => {
            return response(res, HttpStatus.OK, 'OK');
        })
        .catch(err => {
            return response(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
        });
})

router.get('/video/getinfo/:redditPostId', (req, res) => {
    let redditPostId = req.params.redditPostId;

    Video.find({
        where: {
            redditPostId: redditPostId
        },
        limit: 1
    }).then(vid => {
        if(!vid) return response(res, HttpStatus.NOT_FOUND, 'Video not found');

        let data = {
            redditPostId: vid.redditPostId,
            videoUrl: vid.videoUrl,
            status: vid.status,
            views: vid.views,
            lastView: vid.lastView
        }

        return response(res, HttpStatus.OK, 'OK', data);
    });
});

router.get('/video/getnew', (req, res) => {
    if(!authorized(req)) return response(res, HttpStatus.FORBIDDEN, 'Unauthorized');

    Video.findAll({
        where: {
            status: Status.NewRequest
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

            return response(res, HttpStatus.OK, 'OK', data);
        });
});

router.get('/video/getmirrored', (req, res) => {
    if(!authorized(req)) return response(res, HttpStatus.FORBIDDEN, 'Unauthorized');

    Video.findAll({
        where: {
            [Op.or]: [
                {status: Status.LocallyMirrored},
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

        return response(res, HttpStatus.OK, 'OK', data);
    })
});

router.put('/video/queue', (req, res) => {
    if(!authorized(req)) return response(res, HttpStatus.FORBIDDEN, 'Unauthorized');

    let data = req.body;

    Video.find({
        where: {
            redditPostId: data.redditPostId
        },
        limit: 1
    })
        .then(vid => {
            if(vid) return response(res, HttpStatus.CONFLICT, 'Video already exists', {
                redditPostId: data.redditPostId,
                videoUrl: data.videoUrl
            });

            let newVid = Video.create({
                redditPostId: data.redditPostId,
                videoUrl: data.videoUrl,
                status: Status.NewRequest
            }).then(newVid => {
                return response(res, HttpStatus.CREATED, 'Created video request', {
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
    if(!authorized(req)) return response(res, HttpStatus.UNAUTHORIZED, 'Unauthorized');

    let data = req.body;

    let updatedData = {}

    if(data.status)
        updatedData['status'] = data.status;

    if(data.filename)
        updatedData['filename'] = data.filename;

    if(data.views)
        updatedData['views'] = data.views;

    if(data.lastView)
        updatedData['lastView'] = data.lastView;

    Video.update(
        updatedData,
        {
            where: {
                redditPostId: data.redditPostId
            }
        })
        .then(() => {
            return response(res, HttpStatus.OK, 'Record updated successfully');
        })
        .catch((err) => {
            return response(res, HttpStatus.INTERNAL_SERVER_ERROR, `Unable to update record: ${err}`);
        });
});

router.post('/video/upload', upload.single('video'), (req: any, res) => {
    if(!authorized(req)) return response(res, HttpStatus.UNAUTHORIZED, 'Unauthorized');

    if(!req.file) return response(res, HttpStatus.UNPROCESSABLE_ENTITY, 'No file was attached');
    if(!req.body.redditPostId) return response(res, HttpStatus.UNPROCESSABLE_ENTITY, 'No reddit post id specified');

    let redditPostId = req.body.redditPostId;
    let videoFile = req.file;
    let fileExt = path.extname(videoFile.originalname);

    if(configurator.file.local.storageDir) {
        Video.update({ status: Status.LocallyMirrored, filename: videoFile.originalname }, { where: { redditPostId: redditPostId } })
            .then(() => {
                return response(res, HttpStatus.OK, 'File uploaded successfully');
            })
            .catch((err) => {
                return response(res, HttpStatus.INTERNAL_SERVER_ERROR, `Error processing upload: ${err}`);
            });
    } else {
        return response(res, HttpStatus.INTERNAL_SERVER_ERROR, 'File not not picked up by processor; request discarded');
    }
});

export const APIController: Router = router;
