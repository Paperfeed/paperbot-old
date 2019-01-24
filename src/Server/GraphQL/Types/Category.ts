import { gql }           from "apollo-server-express";
import { getRepository } from "typeorm";
import { Category }      from "../../DB/Entity/Category";


export const CategoryTypedef = gql`
    extend type Query {
        category(id: Int!): Category
    }

    type Category {
        id: Int!
        name: String
        games: [Game]
    }
`;

export const CategoryResolver = {
    /*
    Query: {
      category: () => {}
    },
    */
    Category: {
        games: async ({id}) => {
            const category = await getRepository(Category).findOne(id);
            return await category.games;
        }
    }
};