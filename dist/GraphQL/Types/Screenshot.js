"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.ScreenshotTypedef = apollo_server_express_1.gql `
    extend type Query {
        screenshot(game: Int!): Screenshot
    }
    
    type Screenshot {
        id: Int
        thumbnail: String
        full: String
        game: Game!
    }
`;
exports.ScreenshotResolver = {
    Screenshot: {
        game: () => {
        }
    }
};
//# sourceMappingURL=Screenshot.js.map