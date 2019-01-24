import { gql }           from "apollo-server-express";
import { getRepository } from "typeorm";
import { Game }          from "../../DB/Entity/Game";


export const GameTypedef = gql`
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

export const GameResolver = {
    Query: {
        games: async () => {
            const repository = getRepository(Game);
            return await repository.find();
        },
        game: async (obj, {id}) => {
            const repository = getRepository(Game);
            return await repository.findOne(id);
        }
    },
};