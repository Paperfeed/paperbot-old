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
const Developer_1 = require("../../DB/Entity/Developer");
exports.DeveloperTypedef = apollo_server_express_1.gql `
    extend type Query {
        developer(id: Int!): Developer
    }
    
    type Developer {
        id: Int!
        name: String
        games: [Game]
    }
`;
exports.DeveloperResolver = {
    /*    Query: {
            developer: () => {}
        },*/
    Developer: {
        games: ({ id }) => __awaiter(this, void 0, void 0, function* () {
            const developer = yield typeorm_1.getRepository(Developer_1.Developer).findOne(id);
            return yield developer.games;
        })
    }
};
//# sourceMappingURL=Developer.js.map