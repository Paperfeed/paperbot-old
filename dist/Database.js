"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./DB/Entity/User");
const Game_1 = require("./DB/Entity/Game");
class Database {
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    constructor() {
        this.init()
            .catch((e) => console.error("Initializing the database failed", e));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            typeorm_1.createConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
                this.connection = yield connection;
                console.log("Database intialized!");
            })).catch(error => console.log(error));
        });
    }
    createNewUser(info) {
        if (!this.connection.isConnected) {
            throw new Error("Database is not connected");
        }
        let user = new User_1.User();
        user.id = info.id;
        user.steamId = info.steamId;
        user.games = info.games;
        user.createdOn = Date.now();
        this.connection.manager.save(user)
            .catch(e => console.error("Something went wrong saving a new user", user, e));
    }
    static saveEntityType(type, entries) {
        const repository = typeorm_1.getRepository(type);
        return repository.save(entries, { chunk: (entries.length > 500 ? entries.length / 500 : 1) })
            .catch(e => console.error("Something went wrong writing to the database", e));
    }
    getGamesWithoutContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = typeorm_1.getRepository(Game_1.Game);
            return yield repository.find({ hasContent: null });
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map