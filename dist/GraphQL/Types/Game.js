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
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const Game_1 = require("../../DB/Entity/Game");
exports.GameTypedef = apollo_server_express_1.gql `
    extend type Query {
        games: [Game]
        game(id: Int!): Game
    }

    type Game {
        id: Int!
        type: String
        name: String
        requiredAge: Int
        iconUrl: String
        logoUrl: String
        detailedDescription: String
        longDescription: String
        shortDescription: String
        languages: String
        headerImage: String
        website: String
        score: Int
        recommendations: Int
        achievements: Int
        releaseDate: String
        supportUrl: String
        supportEmail: String
        background: String
        controllerSupport: String
        drm: String
        genres: [Genre]
        categories: [Category]
        publishers: [Publisher]
        developers: [Developer]
        screenshots: [Screenshot]
        trailers: [Trailer]
        lastUpdate: Int
        hasContent: Boolean
    }
`;
exports.GameResolver = {
    Query: {
        games: () => __awaiter(this, void 0, void 0, function* () {
            const repository = typeorm_1.getRepository(Game_1.Game);
            return yield repository.find();
        }),
        game: (obj, { id }) => __awaiter(this, void 0, void 0, function* () {
            const repository = typeorm_1.getRepository(Game_1.Game);
            return yield repository.findOne(id);
        })
    },
};
//# sourceMappingURL=Game.js.map