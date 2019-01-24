import { gql } from "apollo-server-express";


export const TrailerTypedef = gql`
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

export const TrailerResolver = {
    Trailer: {
        game: () => {}
    }
};