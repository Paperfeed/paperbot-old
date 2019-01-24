"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.TrailerTypedef = apollo_server_express_1.gql `
    extend type Query {
        trailer(game: Int!): Trailer
    }
    
    type Trailer {
        id : Int
        thumbnail : String
        webm480 : String
        webmFull : String
        game : Game
    }
`;
exports.TrailerResolver = {
    Trailer: {
        game: () => { }
    }
};
//# sourceMappingURL=Trailer.js.map