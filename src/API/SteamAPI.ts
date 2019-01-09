import { fetchAsync, UrlBuildParams } from '../utils';
import { Database }                   from "../Database";
import { Game }                       from "../DB/Entity/Game";
import { Screenshot }                 from "../DB/Entity/Screenshot";
import { Trailer }                    from "../DB/Entity/Trailer";
import { Category }                   from "../DB/Entity/Category";
import { Developer }                  from "../DB/Entity/Developer";
import { Publisher }                  from "../DB/Entity/Publisher";
import { Genre }                      from "../DB/Entity/Genre";

// Get apps details
// https://store.steampowered.com/api/appdetails?appids=594330
// https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI#Known_methods
//

// Get all available apps
// https://api.steampowered.com/ISteamApps/GetAppList/v2/

// Get currently logged in users' information
// https://store.steampowered.com/dynamicstore/userdata/

export class SteamAPI {
    private static _instance : SteamAPI;
    private STEAM_API_HOST : string;
    private STEAM_STORE_API_HOST : string;
    private STEAM_API_KEY : string;
    private database : Database;
    private updateStack : Game[];


    constructor() {
        this.STEAM_API_HOST = 'https://api.steampowered.com';
        this.STEAM_STORE_API_HOST = 'https://store.steampowered.com';
        this.STEAM_API_KEY = process.env.STEAM_API_KEY;
        this.database = Database.Instance;
        this.updateStack = [];
        this.initializeDatabase();

        this.updateGameInfo = this.updateGameInfo.bind(this);
    }


    public static get Instance() {
        return this._instance || (this._instance = new this());
    }


    async initializeDatabase() {
        console.log("Retrieving list of all apps on Steam...");
        const gameData = await this.getAllGames();

        const gameArray = [];

        for (let game of gameData) {
            let dbEntry = new Game();

            dbEntry.appid = game.appid;
            dbEntry.name = game.name;

            gameArray.push(game);
        }

        await Database.saveEntityType(Game, gameArray);

        this.updateStack = await Database.Instance.getGamesWithoutContent();

        if (this.updateStack.length) {
            console.log(`Updating ${this.updateStack.length} games without content...`);
        }

        this.updateGameInfo();
    }


    async updateGameInfo() {
        if (this.updateStack.length) {
            const game = this.updateStack.pop();
            const steamData = await this.getGameInfo(game.appid);

            if (!steamData) {
                // Something went wrong with fetching steamAPI data
                console.log("Something went wrong fetching game data. Skipping ", game.name);
                //this.updateStack.push(game);
                setTimeout(this.updateGameInfo, 1000);
                return;
            } else if (steamData.type === "invalid") {
                // Sometimes steam doesn't seem to have info on a game
                game.hasContent = true;
                game.lastUpdate = Date.now();
                game.type = "invalid";

                console.log(`No data on "${game.name}". Saving as invalid.`);
                Database.saveEntityType(Game, game);
                setTimeout(this.updateGameInfo, 1000);
                return;
            }

            let developers : Developer[];
            let publishers : Publisher[];
            let categories : Category[];
            let genres : Genre[];
            let screenshots : Screenshot[];
            let trailers : Trailer[];

            try {
                developers = steamData.developers.map(developer => {
                    const entity = new Developer();
                    entity.name = developer;
                    return entity;
                });

                await Database.saveEntityType(Developer, developers);
            } catch (e) {
            }

            try {
                publishers = steamData.publishers.map(publisher => {
                    const entity = new Publisher();
                    entity.name = publisher;
                    return entity;
                });
            } catch (e) {
            }

            try {
                categories = steamData.categories.map(category => {
                    const entity = new Category();
                    entity.name = category.description;
                    return entity;
                });

                await Database.saveEntityType(Category, categories);
            } catch (e) {
            }

            try {
                genres = steamData.genres.map(genre => {
                    const entity = new Genre();
                    entity.name = genre.description;
                    return entity;
                });

                await Database.saveEntityType(Genre, genres);
            } catch (e) {
            }

            try {
                screenshots = steamData.screenshots.map(screenshot => {
                    const entity = new Screenshot();
                    entity.thumbnail = screenshot.path_thumbnail;
                    entity.full = screenshot.path_full;
                    return entity;
                });

                await Database.saveEntityType(Screenshot, screenshots);
            } catch (e) {
            }

            try {
                trailers = steamData.movies.map(trailer => {
                    const entity = new Trailer();
                    entity.id = trailer.id;
                    entity.thumbnail = trailer.thumbnail;
                    entity.webm480 = trailer.webm["480"];
                    entity.webmFull = trailer.webm.max;
                    return entity;
                });

                await Database.saveEntityType(Trailer, trailers);
            } catch (e) {
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
            game.categories = categories;
            game.genres = genres;
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
            Database.saveEntityType(Game, game);
        }

        setTimeout(this.updateGameInfo, 1000);
    }


    async getAllGames() : Promise<GameData[]> {
        const data = await fetchAsync(this.STEAM_API_HOST + '/ISteamApps/GetAppList/v2/');
        return data ? data.applist.apps : null;
    }


    async getUserID(username : string) : Promise<string> {
        const data = await fetchAsync(this.STEAM_BUILD_API_REQUEST(
            this.STEAM_API_HOST,
            '/ISteamUser/ResolveVanityURL/v0001/',
            {
                vanityurl: username
            }
        ));

        if (data && data.response.success === 1) {
            return data.response.steamid
        } else {
            return null;
        }
    }


    async getUserSummary(steamId) : Promise<UserInfo> {
        const data = await fetchAsync(this.STEAM_BUILD_API_REQUEST(
            this.STEAM_API_HOST,
            '/ISteamUser/GetPlayerSummaries/v0001/',
            {
                steamids: steamId
            }
        ));

        if (data && data.response.players.player.length) {
            return data.response.players.player[0]
        } else {
            return null;
        }
    }


    async getUserGames(userId, withAppInfo = 1, freeGames = 1) : Promise<UserGame[]> {
        const data = await fetchAsync(this.STEAM_BUILD_API_REQUEST(
            this.STEAM_API_HOST,
            '/IPlayerService/GetOwnedGames/v0001/',
            {
                steamid:                   userId,
                include_appinfo:           withAppInfo,
                include_played_free_games: freeGames,
                format:                    'json'
            }
        ));

        if (data && data.response.games.length) {
            return data.response.games;
        } else {
            return null;
        }
    }


    async getGameInfo(appid, filters = '') : Promise<Partial<GameInfo>> {

        const data = await fetchAsync(this.STEAM_BUILD_API_REQUEST(
            this.STEAM_STORE_API_HOST,
            '/api/appdetails',
            {
                appids:  appid,
                filters: filters
            }
        )).catch(() => {
        });

        if (data && data[appid].success) {
            return data[appid].data;
        } else if (data[appid].success === false) {
            // No info on this AppId return invalid
            return {type: "invalid"};
        } else {
            return null;
        }
    }


    // Builds the object containing the necessary SteamAPI information to send to the HTMLRequest
    STEAM_BUILD_API_REQUEST(host, path, keys) : string {
        const url = host + path + '?'
            + UrlBuildParams({
                key: this.STEAM_API_KEY,
                ...keys
            });

        if (process.env.NODE_ENV === "development") {
            console.log("Fetching: ", url);
        }

        return url;
    };
}


interface GameInfo {
    type : string;
    name : string;
    steam_appid : number;
    required_age : number;
    controller_support : string;
    is_free : boolean;
    dlc : Array<number>;
    detailed_description : string;
    about_the_game : string;
    short_description : string;
    supported_languages : string;
    reviews : string;
    header_image : string;
    website : string;
    drm_notice : string;
    developers : Array<string>;
    publishers : Array<string>;
    metacritic : GameInfoMetacritic;
    categories : GameInfoCategory[];
    genres : GameInfoGenre[];
    screenshots : GameInfoScreenshot[];
    movies : GameInfoTrailer[];
    recommendations : GameInfoRecommendation;
    achievements : GameInfoAchievements;
    release_date : GameInfoReleaseDate;
    support_info : GameInfoSupportInfo;
    background : string;
    content_descriptors : GameInfoContentDescriptors;
}


interface GameInfoMetacritic {
    score : number;
    url : string;
}


interface GameInfoCategory {
    id : number;
    description : string;
}


interface GameInfoGenre {
    id : number;
    description : string;
}


interface GameInfoScreenshot {
    id : number;
    path_thumbnail : string;
    path_full : string;
}


interface GameInfoTrailer {
    id : number;
    name : string
    thumbnail : string;
    webm : GameInfoTrailerWebM;
    highlight : boolean;
}


interface GameInfoTrailerWebM {
    '480' : string;
    max : string;
}


interface GameInfoRecommendation {
    total : number;
}


interface GameInfoAchievements {
    total : number;
    highlighted : GameInfoAchievement[];
}


interface GameInfoAchievement {
    name : string;
    path : string;
}


interface GameInfoReleaseDate {
    coming_soon : boolean;
    date : string;
}


interface GameInfoSupportInfo {
    url : string;
    email : string;
}


interface GameInfoContentDescriptors {
    ids : number[];
    notes : string;
}


interface UserInfo {
    steamid : string;
    communityvisibilitystate : number;
    profilestate : number;
    personaname : string;
    realname : string;
    profileurl : string;
    avatar : string;
    avatarmedium : string;
    avatarfull : string;
    personastate : number;
    personastateflags : number;
    primaryclanid : string;
    loccountrycode : string;
    locstatecode : string;
    timecreated : number;
    lastlogoff : number;
}


interface GameData {
    appid : number;
    name : string;
}


interface UserGame {
    appid : number;
    name : string;
    playtime_forever : number;
    img_icon_url : string;
    img_logo_url : string;
    has_community_visible_stats : boolean;
    playtime_2weeks? : number;
}