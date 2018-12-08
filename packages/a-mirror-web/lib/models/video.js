"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
var Status;
(function (Status) {
    Status[Status["NewRequest"] = 0] = "NewRequest";
    Status[Status["Downloading"] = 10] = "Downloading";
    Status[Status["Transcoding"] = 20] = "Transcoding";
    Status[Status["LocallyMirrored"] = 40] = "LocallyMirrored";
    Status[Status["PostedLocalMirror"] = 50] = "PostedLocalMirror";
    // Errors
    Status[Status["DownloadingFailed"] = 100] = "DownloadingFailed";
    Status[Status["VideoUnavailable"] = 101] = "VideoUnavailable";
    Status[Status["TranscodingFailed"] = 200] = "TranscodingFailed";
})(Status = exports.Status || (exports.Status = {}));
let Video = class Video extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        unique: true
    }),
    __metadata("design:type", String)
], Video.prototype, "redditPostId", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false
    }),
    __metadata("design:type", String)
], Video.prototype, "videoUrl", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
    }),
    __metadata("design:type", String)
], Video.prototype, "filename", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        defaultValue: -1
    }),
    __metadata("design:type", Number)
], Video.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], Video.prototype, "views", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: true
    }),
    __metadata("design:type", Date)
], Video.prototype, "lastView", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Video.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Video.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Date)
], Video.prototype, "deletedAt", void 0);
Video = __decorate([
    sequelize_typescript_1.Table({
        timestamps: true
    })
], Video);
exports.Video = Video;
//# sourceMappingURL=video.js.map