"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const apollo_server_express_1 = require("apollo-server-express");
const Category_1 = require("./Types/Category");
const Developer_1 = require("./Types/Developer");
const Game_1 = require("./Types/Game");
const Genre_1 = require("./Types/Genre");
const Publisher_1 = require("./Types/Publisher");
const Screenshot_1 = require("./Types/Screenshot");
const Trailer_1 = require("./Types/Trailer");
/*const defaultResolvers = {
    Query: {
        game: () => {
        }
    }
};*/
const Query = apollo_server_express_1.gql `
    type Query {
        _empty: String
    }
`;
exports.typeDefs = [
    Query,
    Category_1.CategoryTypedef,
    Developer_1.DeveloperTypedef,
    Game_1.GameTypedef,
    Genre_1.GenreTypedef,
    Publisher_1.PublisherTypedef,
    Screenshot_1.ScreenshotTypedef,
    Trailer_1.TrailerTypedef
];
exports.resolvers = lodash_merge_1.default(
// defaultResolvers,
Category_1.CategoryResolver, Developer_1.DeveloperResolver, Game_1.GameResolver, Genre_1.GenreResolver, Publisher_1.PublisherResolver, Screenshot_1.ScreenshotResolver, Trailer_1.TrailerResolver);
exports.default = apollo_server_express_1.makeExecutableSchema({ typeDefs: exports.typeDefs, resolvers: exports.resolvers });
//# sourceMappingURL=Schema.js.map