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
const typeorm_1 = require("typeorm");
const Genre_1 = require("./Genre");
const Category_1 = require("./Category");
const Screenshot_1 = require("./Screenshot");
const Publisher_1 = require("./Publisher");
const Developer_1 = require("./Developer");
const Trailer_1 = require("./Trailer");
let Game = class Game {
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Game.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Game.prototype, "requiredAge", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "iconUrl", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "logoUrl", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "detailedDescription", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "longDescription", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "shortDescription", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "languages", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "headerImage", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "website", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Game.prototype, "score", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Game.prototype, "recommendations", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Game.prototype, "achievements", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "releaseDate", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "supportUrl", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "supportEmail", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "background", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "controllerSupport", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Game.prototype, "drm", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Genre_1.Genre, genre => genre.games, { eager: true }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Promise)
], Game.prototype, "genres", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Category_1.Category, category => category.games, { eager: true }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Promise)
], Game.prototype, "categories", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Publisher_1.Publisher, publisher => publisher.games),
    typeorm_1.JoinTable(),
    __metadata("design:type", Promise)
], Game.prototype, "publishers", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Developer_1.Developer, developer => developer.games),
    typeorm_1.JoinTable(),
    __metadata("design:type", Promise)
], Game.prototype, "developers", void 0);
__decorate([
    typeorm_1.OneToMany(type => Screenshot_1.Screenshot, screenshot => screenshot.game),
    __metadata("design:type", Promise)
], Game.prototype, "screenshots", void 0);
__decorate([
    typeorm_1.OneToMany(type => Trailer_1.Trailer, trailer => trailer.game),
    __metadata("design:type", Promise)
], Game.prototype, "trailers", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Game.prototype, "lastUpdate", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], Game.prototype, "hasContent", void 0);
Game = __decorate([
    typeorm_1.Entity("games")
], Game);
exports.Game = Game;
//# sourceMappingURL=Game.js.map