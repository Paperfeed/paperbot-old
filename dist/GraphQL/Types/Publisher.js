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
const Publisher_1 = require("../../DB/Entity/Publisher");
exports.PublisherTypedef = apollo_server_express_1.gql `
    extend type Query {
        publisher(id: Int!): Publisher
    }

    type Publisher {
        id: Int!
        name: String
        games: [Game]
    }
`;
exports.PublisherResolver = {
    /*    Query: {
            publisher: () => {}
        },*/
    Publisher: {
        games: ({ id }) => __awaiter(this, void 0, void 0, function* () {
            const publisher = yield typeorm_1.getRepository(Publisher_1.Publisher).findOne(id);
            return yield publisher.games;
        })
    }
};
//# sourceMappingURL=Publisher.js.map