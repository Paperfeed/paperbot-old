import { gql } from "apollo-server-express";


export const ScreenshotTypedef = gql`
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

export const ScreenshotResolver = {
    Screenshot: {
        game: () => {
        }
    }
};