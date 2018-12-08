import { Sequelize } from 'sequelize-typescript';

import configurator from 'a-mirror-util/lib/configurator';
import { Video } from '../models/video';

export class Database {
    private dbLocation: String;
    public db: Sequelize;

    constructor(dbLocation: string) {
        let db = new Sequelize({
            database: dbLocation,
            dialect: 'sqlite',
            username: 'root',
            password: '',
            storage: dbLocation,
            logging: configurator.app.environment === 'local'
        });
        db.addModels([Video]);

        this.dbLocation = dbLocation;
        this.db = db;
    }

    connect() {
        this.db
        .authenticate()
        .then(() => {
            this.db.query(`PRAGMA TABLE_INFO(Video)`)
                .then((data) => {
                    if(!data.filename)
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
