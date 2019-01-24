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
const Genre_1 = require("../../DB/Entity/Genre");
exports.GenreTypedef = apollo_server_express_1.gql `
    extend type Query {
        genre(id: Int!): Genre
    }
    
    type Genre {
        id: Int!
        name: String
        games: [Game]
    }
`;
exports.GenreResolver = {
    Genre: {
        games: ({ id }) => __awaiter(this, void 0, void 0, function* () {
            const genre = yield typeorm_1.getRepository(Genre_1.Genre).findOne(id);
            return yield genre.games;
        })
    }
};
//# sourceMappingURL=Genre.js.map