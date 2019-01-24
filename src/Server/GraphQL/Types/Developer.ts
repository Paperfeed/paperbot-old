import { gql }           from "apollo-server-express";
import { getRepository } from "typeorm";
import { Developer }     from "../../DB/Entity/Developer";


export const DeveloperTypedef = gql`
    extend type Query {
        developer(id: Int!): Developer
    }
    
    type Developer {
        id: Int!
        name: String
        games: [Game]
    }
`;

export const DeveloperResolver = {
/*    Query: {
        developer: () => {}
    },*/
    Developer: {
        games: async ({id}) => {
            const developer = await getRepository(Developer).findOne(id);
            return await developer.games;
        }
    }
};