import merge                                     from 'lodash.merge';
import { makeExecutableSchema, gql }             from "apollo-server-express";
import { CategoryTypedef, CategoryResolver }     from "./Types/Category";
import { DeveloperTypedef, DeveloperResolver }   from "./Types/Developer";
import { GameTypedef, GameResolver }             from "./Types/Game";
import { GenreTypedef, GenreResolver }           from "./Types/Genre";
import { PublisherTypedef, PublisherResolver }   from "./Types/Publisher";
import { ScreenshotTypedef, ScreenshotResolver } from "./Types/Screenshot";
import { TrailerTypedef, TrailerResolver }       from "./Types/Trailer";


/*const defaultResolvers = {
    Query: {
        game: () => {
        }
    }
};*/

const Query = gql`
    type Query {
        _empty: String
    }
`;

export const typeDefs = [
    Query,
    CategoryTypedef,
    DeveloperTypedef,
    GameTypedef,
    GenreTypedef,
    PublisherTypedef,
    ScreenshotTypedef,
    TrailerTypedef
];

export const resolvers = merge(
    // defaultResolvers,
    CategoryResolver,
    DeveloperResolver,
    GameResolver,
    GenreResolver,
    PublisherResolver,
    ScreenshotResolver,
    TrailerResolver
);

export default makeExecutableSchema({typeDefs, resolvers});