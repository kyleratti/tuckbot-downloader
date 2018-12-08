"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const configurator_1 = __importDefault(require("a-mirror-util/lib/configurator"));
const video_1 = require("../models/video");
class Database {
    constructor(dbLocation) {
        let db = new sequelize_typescript_1.Sequelize({
            database: dbLocation,
            dialect: 'sqlite',
            username: 'root',
            password: '',
            storage: dbLocation,
            logging: configurator_1.default.app.environment === 'local'
        });
        db.addModels([video_1.Video]);
        this.dbLocation = dbLocation;
        this.db = db;
    }
    connect() {
        this.db
            .authenticate()
            .then(() => {
            this.db.query(`PRAGMA TABLE_INFO(Video)`)
                .then((data) => {
                if (!data.filename)
                    this.db.query(`ALTER TABLE Video ADD filename VARCHAR(255) DEFAULT NULL`);
                this.db.query(`DELETE FROM Video WHERE redditPostId IS NULL OR redditPostId = '' OR redditPostId = '8zwds01'`);
                console.log("sqlite database loaded successfully");
            })
                .catch((err) => {
                throw new Error(`failed loading modified database: ${err}`);
            });
        })
            .catch(err => {
            throw new Error("unable to load database: " + err);
        });
        this.db.sync();
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map