import { gql }           from "apollo-server-express";
import { getRepository } from "typeorm";
import { Publisher }     from "../../DB/Entity/Publisher";


export const PublisherTypedef = gql`
    extend type Query {
        publisher(id: Int!): Publisher
    }

    type Publisher {
        id: Int!
        name: String
        games: [Game]
    }
`;

export const PublisherResolver = {
    /*    Query: {
            publisher: () => {}
        },*/
    Publisher: {
        games: async ({id}) => {
            const publisher = await getRepository(Publisher).findOne(id);
            return await publisher.games;
        }
    }
};