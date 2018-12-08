import { Table, Model, Column, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

export enum Status {
    NewRequest = 0,
    Downloading = 10,
    Transcoding = 20,

    LocallyMirrored = 40,

    PostedLocalMirror = 50,

    // Errors
    DownloadingFailed = 100,
    VideoUnavailable = 101,
    TranscodingFailed = 200,
}

@Table({
    timestamps: true
})
export class Video extends Model<Video> {
    @Column({
        allowNull: false,
        unique: true
    })
    redditPostId: string;

    @Column({
        allowNull: false
    })
    videoUrl: string;

    @Column({
        allowNull: true,
    })
    filename: string;

    @Column({
        allowNull: true,
        defaultValue: -1
    })
    status: number;

    @Column({
        allowNull: true,
        defaultValue: 0
    })
    views: number;
    
    @Column({
        allowNull: true
    })
    lastView: Date;

    @CreatedAt
    createdAt: Date;
 
    @UpdatedAt
    updatedAt: Date;
  
    @DeletedAt
    deletedAt: Date;
}
