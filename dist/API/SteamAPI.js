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
const utils_1 = require("../utils");
const Database_1 = require("../Database");
const Game_1 = require("../DB/Entity/Game");
const Screenshot_1 = require("../DB/Entity/Screenshot");
const Trailer_1 = require("../DB/Entity/Trailer");
const Category_1 = require("../DB/Entity/Category");
const Developer_1 = require("../DB/Entity/Developer");
const Publisher_1 = require("../DB/Entity/Publisher");
const Genre_1 = require("../DB/Entity/Genre");
const typeorm_1 = require("typeorm");
// Get apps details
// https://store.steampowered.com/api/appdetails?appids=594330
// https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI#Known_methods
//
// Get all available apps
// https://api.steampowered.com/ISteamApps/GetAppList/v2/
// Get currently logged in users' information
// https://store.steampowered.com/dynamicstore/userdata/
class SteamAPI {
    constructor() {
        this.STEAM_API_HOST = 'https://api.steampowered.com';
        this.STEAM_STORE_API_HOST = 'https://store.steampowered.com';
        this.STEAM_API_KEY = process.env.STEAM_API_KEY;
        this.database = Database_1.Database.Instance;
        this.updateStack = [];
        this.updateGameInfo = this.updateGameInfo.bind(this);
        this.initializeDatabase();
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Retrieving list of all apps on Steam...");
            const gameData = yield this.getAllGames();
            const gameArray = [];
            for (let game of gameData) {
                let dbEntry = new Game_1.Game();
                dbEntry.id = game.appid;
                dbEntry.name = game.name;
                gameArray.push(game);
            }
            console.log("Saving to database: ", gameArray.length);
            yield Database_1.Database.saveEntityType(Game_1.Game, gameArray);
            console.log("All games updated");
            this.updateStack = yield Database_1.Database.Instance.getGamesWithoutContent();
            if (this.updateStack.length) {
                console.log(`Updating ${this.updateStack.length} games without content...`);
            }
            this.updateGameInfo();
        });
    }
    updateGameInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.updateStack.length) {
                const game = this.updateStack.pop();
                const steamData = yield this.getGameInfo(game.id);
                if (!steamData) {
                    // Something went wrong with fetching steamAPI data
                    console.log("Something went wrong fetching game data. Skipping ", game.name);
                    //this.updateStack.push(game);
                    setTimeout(this.updateGameInfo, 1000);
                    return;
                }
                else if (steamData.type === "invalid") {
                    // Sometimes steam doesn't seem to have info on a game
                    game.hasContent = true;
                    game.lastUpdate = Date.now();
                    game.type = "invalid";
                    console.log(`No data on "${game.name}". Saving as invalid.`);
                    Database_1.Database.saveEntityType(Game_1.Game, game);
                    setTimeout(this.updateGameInfo, 1000);
                    return;
                }
                let developers;
                let publishers;
                let categories;
                let genres;
                let screenshots;
                let trailers;
                try {
                    developers = steamData.developers.map(developer => {
                        const entity = new Developer_1.Developer();
                        entity.name = developer;
                        return entity;
                    });
                    yield Database_1.Database.saveEntityType(Developer_1.Developer, developers);
                }
                catch (e) {
                }
                try {
                    publishers = steamData.publishers.map(publisher => {
                        typeorm_1.getRepository(Publisher_1.Publisher).find({ name: publisher });
                        const entity = new Publisher_1.Publisher();
                        entity.name = publisher;
                        return entity;
                    });
                    yield Database_1.Database.saveEntityType(Publisher_1.Publisher, publishers);
                }
                catch (e) {
                }
                try {
                    categories = steamData.categories.map(category => {
                        const entity = new Category_1.Category();
                        entity.name = category.description;
                        return entity;
                    });
                    yield Database_1.Database.saveEntityType(Category_1.Category, categories);
                }
                catch (e) {
                }
                try {
                    genres = steamData.genres.map(genre => {
                        const entity = new Genre_1.Genre();
                        entity.name = genre.description;
                        return entity;
                    });
                    yield Database_1.Database.saveEntityType(Genre_1.Genre, genres);
                }
                catch (e) {
                }
                try {
                    screenshots = steamData.screenshots.map(screenshot => {
                        const entity = new Screenshot_1.Screenshot();
                        entity.thumbnail = screenshot.path_thumbnail;
                        entity.full = screenshot.path_full;
                        return entity;
                    });
                    yield Database_1.Database.saveEntityType(Screenshot_1.Screenshot, screenshots);
                }
                catch (e) {
                }
                try {
                    trailers = steamData.movies.map(trailer => {
                        const entity = new Trailer_1.Trailer();
                        entity.id = trailer.id;
                        entity.thumbnail = trailer.thumbnail;
                        entity.webm480 = trailer.webm["480"];
                        entity.webmFull = trailer.webm.max;
                        return entity;
                    });
                    yield Database_1.Database.saveEntityType(Trailer_1.Trailer, trailers);
                }
                catch (e) {
                }
                //game.appid = steamData.steam_appid;
                game.type = steamData.type;
                game.name = steamData.name;
                game.requiredAge = steamData.required_age;
                game.controllerSupport = steamData.controller_support;
                game.detailedDescription = steamData.detailed_description;
                game.longDescription = steamData.about_the_game;
                game.shortDescription = steamData.short_description;
                game.languages = steamData.supported_languages;
                game.headerImage = steamData.header_image;
                game.website = steamData.website;
                game.drm = steamData.drm_notice;
                game.developers = Promise.resolve(developers);
                game.publishers = Promise.resolve(publishers);
                game.categories = Promise.resolve(categories);
                game.genres = Promise.resolve(genres);
                game.screenshots = Promise.resolve(screenshots);
                game.trailers = Promise.resolve(trailers);
                game.score = steamData.metacritic !== undefined ? steamData.metacritic.score : null;
                game.recommendations = steamData.recommendations !== undefined ? steamData.recommendations.total : null;
                game.achievements = steamData.achievements !== undefined ? steamData.achievements.total : null;
                game.releaseDate = steamData.release_date !== undefined ? steamData.release_date.date : null;
                game.supportUrl = steamData.support_info !== undefined ? steamData.support_info.url : null;
                game.supportEmail = steamData.support_info !== undefined ? steamData.support_info.email : null;
                game.background = steamData.background;
                game.hasContent = true;
                game.lastUpdate = Date.now();
                console.log(`Saving "${game.name}" into database`);
                yield Database_1.Database.saveEntityType(Game_1.Game, game);
            }
            setTimeout(this.updateGameInfo, 1000);
        });
    }
    getAllGames() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield utils_1.fetchAsync(this.STEAM_API_HOST + '/ISteamApps/GetAppList/v2/');
            return data ? data.applist.apps : null;
        });
    }
    getUserID(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield utils_1.fetchAsync(this.STEAM_BUILD_API_REQUEST(this.STEAM_API_HOST, '/ISteamUser/ResolveVanityURL/v0001/', {
                vanityurl: username
            }));
            if (data && data.response.success === 1) {
                return data.response.steamid;
            }
            else {
                return null;
            }
        });
    }
    getUserSummary(steamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield utils_1.fetchAsync(this.STEAM_BUILD_API_REQUEST(this.STEAM_API_HOST, '/ISteamUser/GetPlayerSummaries/v0001/', {
                steamids: steamId
            }));
            if (data && data.response.players.player.length) {
                return data.response.players.player[0];
            }
            else {
                return null;
            }
        });
    }
    getUserGames(userId, withAppInfo = 1, freeGames = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield utils_1.fetchAsync(this.STEAM_BUILD_API_REQUEST(this.STEAM_API_HOST, '/IPlayerService/GetOwnedGames/v0001/', {
                steamid: userId,
                include_appinfo: withAppInfo,
                include_played_free_games: freeGames,
                format: 'json'
            }));
            if (data && data.response.games.length) {
                return data.response.games;
            }
            else {
                return null;
            }
        });
    }
    getGameInfo(appid, filters = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield utils_1.fetchAsync(this.STEAM_BUILD_API_REQUEST(this.STEAM_STORE_API_HOST, '/api/appdetails', {
                appids: appid,
                filters: filters
            })).catch(() => {
            });
            if (data && data[appid].success) {
                return data[appid].data;
            }
            else if (data[appid].success === false) {
                // No info on this AppId return invalid
                return { type: "invalid" };
            }
            else {
                return null;
            }
        });
    }
    // Builds the object containing the necessary SteamAPI information to send to the HTMLRequest
    STEAM_BUILD_API_REQUEST(host, path, keys) {
        const url = host + path + '?'
            + utils_1.UrlBuildParams(Object.assign({ key: this.STEAM_API_KEY }, keys));
        if (process.env.NODE_ENV === "development") {
            console.log("Fetching: ", url);
        }
        return url;
    }
    ;
}
exports.SteamAPI = SteamAPI;
//# sourceMappingURL=SteamAPI.js.map