import { gql }           from "apollo-server-express";
import { getRepository } from "typeorm";
import { Genre }         from "../../DB/Entity/Genre";


export const GenreTypedef = gql`
    extend type Query {
        genre(id: Int!): Genre
    }
    
    type Genre {
        id: Int!
        name: String
        games: [Game]
    }
`;

export const GenreResolver = {
    Genre: {
        games: async ({id}) => {
            const genre = await getRepository(Genre).findOne(id);
            return await genre.games;
        }
    }
};