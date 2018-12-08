"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const os_1 = __importDefault(require("os"));
const sequelize_1 = require("sequelize");
const video_1 = require("../models/video");
const server_1 = require("../server");
const router = express_1.Router();
router.get('/', (req, res) => {
    // TODO: show home page (? if any???)
    res.send('Hello, world!');
});
router.get('/mobilitymary', (req, res) => {
    return res.status(http_status_codes_1.default.OK).render('mobilitymary', {
        title: "Mirrors of Mobility Mary's finest work",
        stylesheet: server_1.makeUrl(server_1.UrlType.Cdn, '/css/style.css'),
        serverName: os_1.default.hostname().split('.')[0],
        videos: [
            {
                videoId: "Cbau_pVrwZ4",
                videoTitle: "1 29 17 ALMOST KILLED ON FRWY OFF RAMP"
            },
            {
                videoId: "YP3S0pMwUAY",
                videoTitle: "2 CARS CUT ME OFF IN CROSSWALK 1 4 2016"
            },
            {
                videoId: "qMYek2yYrw0",
                videoTitle: "2 CARS IGNORE STOP SIGN"
            },
            {
                videoId: "zqLI8TwiRgk",
                videoTitle: "2BIRD SCOOTERS BLOCKING SIDEWALKS"
            },
            {
                videoId: "kvGszc1ujcY",
                videoTitle: "2CARS CUT ME OFF IN CROSSWALK"
            },
            {
                videoId: "N7BqChQNzac",
                videoTitle: "3 WAY STOP  PALMS BARRY HOW MANY STOP"
            },
            {
                videoId: "oxsas",
                videoTitle: "4 ANDY JAPANESE RESTAURANTS SAWTELLE"
            },
            {
                videoId: "Lyoqa_A5mn4",
                videoTitle: "4 VEHICLES RUN STOP SIGNS"
            },
            {
                videoId: "Rnwbb6x4Rs0",
                videoTitle: "405 NATIONAL & SAWTELLE TUNNEL SIDEWALK STILL BLOCKED"
            },
            {
                videoId: "IZWH7fzcTTw",
                videoTitle: "6 7 18 CUT OFF IN CROSSWALK"
            },
            {
                videoId: "DrEPsiwnkXw",
                videoTitle: "A TAD WINDY TODAY IN L A  APRIL 15 2016"
            },
            {
                videoId: "tmA9aWhy9IA",
                videoTitle: "ALMOST HITS ME GREEN LIGHT CROSSWALK TELLS ME TO HURRY UP NOV 20 2015"
            },
            {
                videoId: "RePuAA00Nlo",
                videoTitle: "ANOTHER BOGUS IRS CALL"
            },
            {
                videoId: "rvphw5j9g9w",
                videoTitle: "ATTACKED IN THE FACE AND ARM BY PLANT WILL NOT APOLOGIZE"
            },
            {
                videoId: "APhmdOPhMGg",
                videoTitle: "ATTEMPT TO X ONRAMP W GREEN LIGHT"
            },
            {
                videoId: "uR06GZ0LQFA",
                videoTitle: "BACKYARD SWAMP"
            },
            {
                videoId: "vYJ7iLWPWq8",
                videoTitle: "BARRINGTON PALMS ROLLS THRU CROSSWALK"
            },
            {
                videoId: "7kFmHFX2kxc",
                videoTitle: "BATBIRD BEING HYPER AT SIESTA TIME 2016"
            },
            {
                videoId: "qdcrJs4ArU",
                videoTitle: "BIG STORM IN MAR VISTA FEB 17, 2017"
            },
            {
                videoId: "01LqxzIWqTs",
                videoTitle: "BIG STORM L A  JANUARY 22, 2017"
            },
            {
                videoId: "VXRjByw2nLs",
                videoTitle: "BIG WIND 11 9 15 FRONT PALMS AND NEIGHBORS TREES"
            },
            {
                videoId: "56g5Rpdxs5A",
                videoTitle: "BIG WIND 11 9 15 FRONT PALMS BENDING OVER GARAGE"
            },
            {
                videoId: "wfsupQRTgD4",
                videoTitle: "Birdie loves Lehmann's Farm pesticide free corn"
            },
            {
                videoId: "YchfaRWgUI0",
                videoTitle: "CAR BLOCKS HANDICAP RAMP PALMSMCLAUGHLIN"
            },
            {
                videoId: "3fxaP9yN130",
                videoTitle: "CAR CUT ME OFF ALMOST HIT ME"
            },
            {
                videoId: "EQinxB0ZYdU",
                videoTitle: "CAR UP HANDICAP RAMP ONTO SIDEWALK"
            },
            {
                videoId: "zQ",
                videoTitle: "CARIS BEETLES MAR VISTA POTLUCK PICNIC 2016"
            },
            {
                videoId: "9xUO3Ke9WaU",
                videoTitle: "COCKATOO INFATUATED WITH POTTERY BIRD"
            },
            {
                videoId: "nfIjgcdt1zk",
                videoTitle: "COCKATOO SHOWER ON TOP OF THE FRIDGE"
            },
            {
                videoId: "K6QQMTTZnM8",
                videoTitle: "CONVO RE OVERPASS ENCAMPMENT"
            },
            {
                videoId: "j5Q0",
                videoTitle: "COOKING VEGGIES JULY 8, 2018"
            },
            {
                videoId: "gMXPfYki5lI",
                videoTitle: "COUCH BLOCKS SIDEWALK LATEST LITTLE ADVENTURE MAY"
            },
            {
                videoId: "ALbs67TDM00",
                videoTitle: "CRAZY DOG LADY VS  DISABLED LADY ON MOBILITY SCOOTER"
            },
            {
                videoId: "aJts5cWtIVg",
                videoTitle: "CRAZY GUY ALMOST HITS ME TACO BELL"
            },
            {
                videoId: "TjX0dOUPDx8",
                videoTitle: "CUT OFF IN BIKE LANE VENICE BL INGLEWOOD BL"
            },
            {
                videoId: "yIf5g",
                videoTitle: "CUT OFF IN CROSSWALK DISCUSS W LADY"
            },
            {
                videoId: "beYjZ3OD4m0",
                videoTitle: "DAVID CARIS 2016 MAR VISTA POTLUCK"
            },
            {
                videoId: "BWDlNndMeSQ",
                videoTitle: "DISABLED ON SCOOTER DANGER OBSTICLES SAWTELLE WLA"
            },
            {
                videoId: "Ukbom_eHrY0",
                videoTitle: "DISABLED SITTING DUCK FREEWAY OFF RAMP DRIVER RUNS RED LIGHT"
            },
            {
                videoId: "0X5ANaEYtDY",
                videoTitle: "ELDERLY HOMELESS LADY REFUSES $4 17 BOTTLE RECYCLE RECEIPT"
            },
            {
                videoId: "8mP_jbzjcX8",
                videoTitle: "ELDERLY HOMELESS LADY REFUSES FOOD"
            },
            {
                videoId: "OISZB56uLB0",
                videoTitle: "ELDERLY MAN ON PHONE BLOCKS CROSSWALK 11 13 15"
            },
            {
                videoId: "jMw1ZgsM6fM",
                videoTitle: "FREEWAY OFFRAMP CUT ME OFF"
            },
            {
                videoId: "oPPpzzVMgbk",
                videoTitle: "FREEWAY ONRAMP 3 CARS CUT ME OFF"
            },
            {
                videoId: "0ykoY1Vc",
                videoTitle: "FWY OVERPASS CAN'T SEE EDGE"
            },
            {
                videoId: "jq51dCa8hTw",
                videoTitle: "GREAT STREETS VENICE BL  UNSAFE BIKE PATH ENTRY"
            },
            {
                videoId: "W_Ue00IQjlY",
                videoTitle: "GUY ACCUSES ME OF ATTACKING HIS PAL"
            },
            {
                videoId: "Y",
                videoTitle: "HALLOWEEN 2015 MCLAUGHLIN FRONT YARD"
            },
            {
                videoId: "ePRnmAOQtC0",
                videoTitle: "HOLIDAY LIGHTS IN MAR VISTA 2015"
            },
            {
                videoId: "po4XMUYjInE",
                videoTitle: "HOMELESS ENCAMPMENT COMPLETELY BLOCKS SIDEWALK"
            },
            {
                videoId: "eHSC9usK1Cc",
                videoTitle: "HOMELESS WOMAN BLOCKING SIDEWALK"
            },
            {
                videoId: "AKQzsWnKkFU",
                videoTitle: "IGNORES STOP SIGN WHOLE FOODS EXIT"
            },
            {
                videoId: "4LXaHE6fcbs",
                videoTitle: "ILLEGAL U TURN CENTINELLA ALMOST KILLS ME SHE'S SORRY"
            },
            {
                videoId: "il7AuLqn5EQ",
                videoTitle: "ILLEGAL U TURN ON SAWTELLE"
            },
            {
                videoId: "m3ppOGkoVX4",
                videoTitle: "IN CROSSWALK NR PARK WHITE CAR STARTS 2 TURN"
            },
            {
                videoId: "40yZy1oryFU",
                videoTitle: "INTERNATIONAL POKEMON CAPTURE"
            },
            {
                videoId: "qvQ7qrq4Juk",
                videoTitle: "LADY WINSTON BELL RINGING SILLY BIRD"
            },
            {
                videoId: "BDxfr4xTW6Q",
                videoTitle: "LADY WINSTON CLOSEUP CAGE DOOR NOV 28 2015"
            },
            {
                videoId: "FgRk",
                videoTitle: "LADY WINSTON THANKFUL NOT TO BE A TURKEY NOV 2015"
            },
            {
                videoId: "5LVz4WRIsqE",
                videoTitle: "LAPD PACIFIC DIV  SANTA ARRIVING VICTORIA MAR VISTA 2016"
            },
            {
                videoId: "x3EvscBwNz8",
                videoTitle: "Lesser Sulpher Crested Cockatoo On My Lenovo"
            },
            {
                videoId: "b0jFzHAqiEI",
                videoTitle: "LW KISSING BABY BIRD ON IPAD"
            },
            {
                videoId: "8CigYUjS22M",
                videoTitle: "MAR VIST 2 NEW RAMPS WESTMINSTER AT BARRY"
            },
            {
                videoId: "ZO1DSNKCfPU",
                videoTitle: "Mar Vista Weather 5 22 08"
            },
            {
                videoId: "zKI7uAA",
                videoTitle: "MAR8 TRUCK BLOCKING SIDEWALK ON PALMS"
            },
            {
                videoId: "qHpSBQrgSB4",
                videoTitle: "MY GREEN LIGHT 2 CARS IMPEDED ME IN CROSSWALK"
            },
            {
                videoId: "qLE",
                videoTitle: "MY LESSER SULFUR CRESTED COCKATOO'S NEW TOYS"
            },
            {
                videoId: "3igWpaaxebg",
                videoTitle: "MY RIGHT OF WAY GUY APPOLOGIZES"
            },
            {
                videoId: "CdIwo2OAm_I",
                videoTitle: "NATIONAL SAWTELLE FREEWAY ONRAMP CROSSWALK"
            },
            {
                videoId: "REgAD_4",
                videoTitle: "NEW BIRDY TOYS MADE BY ME"
            },
            {
                videoId: "PyzUrr0h_7c",
                videoTitle: "NEW PLANT 4 ANDY"
            },
            {
                videoId: "5TTUaSS1CGo",
                videoTitle: "NEW SIDEWALK  RAMPS BARRINGTON GARY RE 4 OTHER LOCATIONS"
            },
            {
                videoId: "dH_kf4F6TrE",
                videoTitle: "NEW SIDEWALK NEW RAMP BARRINGTON N  OF VENICE BL"
            },
            {
                videoId: "BxqPzqSkePM",
                videoTitle: "NO SAFETY IN NUMBERS PALMS MCLAUGHLIN"
            },
            {
                videoId: "no8raCqkVrE",
                videoTitle: "NON POISONOUS HEAT TREATMENT FOR TERMITES IN GARAGE"
            },
            {
                videoId: "8Ct_07KQBWw",
                videoTitle: "OCT 30 ME CYCLIST JOGGER"
            },
            {
                videoId: "i8ZjNEQ7S54",
                videoTitle: "OFFICER ACOSTA W AWESOME LAPD PACIFIC DIV  OFFICERS, SANTA & ELF 2016"
            },
            {
                videoId: "UZdSU0qaVyA",
                videoTitle: "ORGANIC SWEET PICKLE RELISH 7 21 18"
            },
            {
                videoId: "PgTUoVAhzdE",
                videoTitle: "PALMS @ BARRY NO ONE PAYS ATTENTION 2 STOP SIGNS"
            },
            {
                videoId: "83M",
                videoTitle: "PALMS & SAWTELLE NO RAMP FUN FUN FUN"
            },
            {
                videoId: "ul69g47DtEU",
                videoTitle: "PALMS BARRY MOTORCYCLE IGNORES STOP SIGN"
            },
            {
                videoId: "kAI6OrweVHQ",
                videoTitle: "PALMS MCLAUGHLIN 3 CARS CUT ME OFF DAMAGED WALL"
            },
            {
                videoId: "yLWZoZqZUDc",
                videoTitle: "PALMS MCLAUGHLIN ALMOST HIT"
            },
            {
                videoId: "X8sBY_UGziQ",
                videoTitle: "PALMS MCLAUGHLIN CLOSE CALL IN CROSSWALK"
            },
            {
                videoId: "nA0oNqutBuY",
                videoTitle: "PALMS SAWTELLE CARS IGNORE CROSSWALK BOTH DIRECTIONS"
            },
            {
                videoId: "mjJwYLKbfe0",
                videoTitle: "PALMS SEPULVEDA CROSSWALK 4 CARS CUT ME OFF"
            },
            {
                videoId: "JNjEhN_VKK8",
                videoTitle: "Pouring Rain On Driveway"
            },
            {
                videoId: "Z8WeaKP2vMg",
                videoTitle: "Pouring Rain Starting To Flood Street"
            },
            {
                videoId: "GRydAEt1hVo",
                videoTitle: "R TURN FROM WRONG LANE ON RED ALMOST HITS ME"
            },
            {
                videoId: "O0q1bFizZKQ",
                videoTitle: "RAIN STARTING IN MAR VISTA"
            },
            {
                videoId: "eTxMqsWou2E",
                videoTitle: "REMEMBRANCE OF LAST NIGHT ON MY DRIVEWAY 7 3 16"
            },
            {
                videoId: "qHBuJbOrwJ0",
                videoTitle: "ROB KADOTA MVNA AWARD AND CARIS"
            },
            {
                videoId: "AWW2BRYcwe8",
                videoTitle: "ROB KADOTA RE CARIS MAR VISTA POTLUCK 2016"
            },
            {
                videoId: "BEr9Puu4cfE",
                videoTitle: "Rude Cockatoo Poops In Shower"
            },
            {
                videoId: "8R3Ux6J527I",
                videoTitle: "RUNS 2 STOP SIGNS WHOLE FOODS PARKING LOT"
            },
            {
                videoId: "QjdIQP7uuqg",
                videoTitle: "SCARY SITUATION GAS STATION"
            },
            {
                videoId: "9HoRAF3BqSI",
                videoTitle: "SEPULVEDA NR TJ'S 33 CARS DON'T STOP"
            },
            {
                videoId: "s4w0h86f3r4",
                videoTitle: "SEPULVEDA OPEN TRENCH BOTH SIDEWALKS LADY HELPS"
            },
            {
                videoId: "eM",
                videoTitle: "SHOPPING CARTS GONE FROM RED ZONE!"
            },
            {
                videoId: "Ckf5My4Us",
                videoTitle: "Shopping carts now piling up in street McLaughlin Palms"
            },
            {
                videoId: "SBbMN9CheEQ",
                videoTitle: "SO ON BARRINGTON GREEN LIGHT 2 CLOSE CALLS 3 MINS INTO VID NEAR END"
            },
            {
                videoId: "XCgzuFu9vTU",
                videoTitle: "SPEEDING CAR ALMOST HIT ME"
            },
            {
                videoId: "hrhIvAdwisk",
                videoTitle: "SPLIT TREE IN STREET WESTMINISTER BARRY"
            },
            {
                videoId: "B05wTfPe7_c",
                videoTitle: "STOP SIGN CAR CUTS ME OFF ON BARRINGTON"
            },
            {
                videoId: "Oa7jebx8BHY",
                videoTitle: "TELEPHONE SCAM CLAIMS TO BE US TREASURY"
            },
            {
                videoId: "lZ3Ii9IGqVU",
                videoTitle: "Territorial Cockatoo Not Pleased With Power Chair Close To Cage"
            },
            {
                videoId: "7LieTaPWMxg",
                videoTitle: "THANK YOU! LAPD PACIFIC DIV FOR BRINGING SANTA TO MAR VISTA 2016"
            },
            {
                videoId: "i9Phc3qgCGw",
                videoTitle: "THE BIRD NEW STAINLESS STEEL CAGE HELL IN A CELL"
            },
            {
                videoId: "8Vq545mzP9Y",
                videoTitle: "THE STILL NO TUNNEL ACCESS CIRCLE GAME"
            },
            {
                videoId: "acyQ4Y",
                videoTitle: "TYPICAL SHOPPING ORDEAL"
            },
            {
                videoId: "3Qz3MLrZCpY",
                videoTitle: "UNIDENTIFIED INSECT NR FRONT DOOR"
            },
            {
                videoId: "vamFEFSF6sE",
                videoTitle: "UNLEASHED DOG 7 20 18"
            },
            {
                videoId: "SljaqMmWVFU",
                videoTitle: "UNLEASHED DOGS CONDISCENDING WOMAN"
            },
            {
                videoId: "5ysfDGIxrek",
                videoTitle: "VAN ALMOST BROADSIDES ME NR PARK"
            },
            {
                videoId: "2LEo",
                videoTitle: "VENICE AT GRAND VIEW MY GREEN LIGHT"
            },
            {
                videoId: "17Rjg2pO18Y",
                videoTitle: "WHAT IT'S LIKE IN PUBLIC ON MOBILITY SCOOTER"
            },
            {
                videoId: "bMlXPBKNuu4",
                videoTitle: "WHOLE FOODS PARKING LOT STOP SIGNS IGNORED PEDESTRIANS BEWARE!"
            },
            {
                videoId: "pDP_aA8C3b4",
                videoTitle: "WHOLE FOODS PK LOT IDIOT IN HANDICAP AREA"
            },
            {
                videoId: "8QgXr05YjoY",
                videoTitle: "WHOLE FOODS PKNG LT STOP SIGN & CROSSWALK"
            },
            {
                videoId: "YTEKE",
                videoTitle: "WINDY DAY IN MAR VISTA DEC 16 2016"
            },
            {
                videoId: "Mcflzrt3pgM",
                videoTitle: "WOMAN BARKS THREATENS 2 BITE ME"
            },
            {
                videoId: "GudP2PynM",
                videoTitle: "WOMAN ILLEGALLY BLOCKS HANDICAP RAMP WONT MOVE"
            },
            {
                videoId: "sHcIFuybbrQ",
                videoTitle: "XING NR PARK CUT OFF HAVE GREEN LIGHT"
            },
            {
                videoId: "PHBYWc1x10I",
                videoTitle: "XMAS DISPLAY PALMS & FEDERAL 2016"
            },
            {
                videoId: "rRMX3XyzVcQ",
                videoTitle: "XMAS SHOWER 4 DA BOID"
            }
        ]
    });
});
router.get('/mm/:videoId', (req, res) => {
    let videoId = req.params.videoId;
    return res.status(http_status_codes_1.default.OK).render('show', {
        title: 'Mobility Mary\'s Magnificent Mirror',
        stylesheet: server_1.makeUrl(server_1.UrlType.Cdn, '/css/style.css'),
        redditPostId: null,
        videoLocation: server_1.makeUrl(server_1.UrlType.Cdn, '/video/mm/', videoId + '.mp4'),
        posterLocation: server_1.makeUrl(server_1.UrlType.Cdn, '/img/poster.png'),
        serverName: os_1.default.hostname().split('.')[0],
    });
});
router.get('/:redditPostId', (req, res) => {
    let redditPostId = req.params.redditPostId;
    video_1.Video.find({
        where: {
            redditPostId: redditPostId,
            [sequelize_1.Op.or]: [
                { status: video_1.Status.LocallyMirrored },
                { status: video_1.Status.PostedLocalMirror }
            ]
        },
        limit: 1
    }).then(vid => {
        if (vid) {
            return res.status(http_status_codes_1.default.OK).render('show', {
                title: 'a-mirror',
                stylesheet: server_1.makeUrl(server_1.UrlType.Cdn, '/css/style.css'),
                redditPostId: vid.redditPostId,
                videoLocation: server_1.makeUrl(server_1.UrlType.Cdn, '/video/', (vid.filename ? vid.filename : vid.redditPostId + '.mp4')),
                posterLocation: server_1.makeUrl(server_1.UrlType.Cdn, '/img/poster.png'),
                serverName: os_1.default.hostname().split('.')[0],
            });
        }
        return res.status(http_status_codes_1.default.NOT_FOUND).render('errors/404', {
            title: 'Mirror Not Found',
            stylesheet: server_1.makeUrl(server_1.UrlType.Cdn, '/css/style.css'),
            message: 'This video was not found in the database. Typically this means a-mirror has not been asked to mirror this post or doesn\'t have an agreement in place with the subreddit moderators to mirror links reliably.',
            serverName: os_1.default.hostname().split('.')[0]
        });
    });
});
exports.PublicController = router;
//# sourceMappingURL=public.controller.js.map