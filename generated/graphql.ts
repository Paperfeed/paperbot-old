import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Time: any;
  /** The `Long` scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any;
};







export type CollectionsInput = {
  connectToId: Scalars['ID'];
  connectToCollection: Scalars['String'];
  fromIdName: Scalars['String'];
  toIdName: Scalars['String'];
  indexName: Scalars['String'];
};

export type ConnectionsInput = {
  connectToId: Scalars['ID'];
  connectToCollection: Scalars['String'];
  fromIdName: Scalars['String'];
  toIdName: Scalars['String'];
  toCollection: Scalars['String'];
  fromCollection?: Maybe<Scalars['String']>;
  indexName: Scalars['String'];
};


/** 'Game' input values */
export type GameInput = {
  name?: Maybe<Scalars['String']>;
  genre?: Maybe<Array<Maybe<GenreInput>>>;
};

/** 'Genre' input values */
export type GenreInput = {
  name?: Maybe<Scalars['String']>;
};

/** 'Guild' input values */
export type GuildInput = {
  id: Scalars['ID'];
  prefix?: Maybe<Scalars['String']>;
  boundChannel?: Maybe<Scalars['String']>;
  users?: Maybe<GuildUsersRelation>;
  stats?: Maybe<GuildStatsRelation>;
};

/** Allow manipulating the relationship between the types 'Guild' and 'Stats'. */
export type GuildStatsRelation = {
  /** Create one or more documents of type 'Stats' and associate them with the current document. */
  create?: Maybe<Array<Maybe<StatsInput>>>;
  /** Connect one or more documents of type 'Stats' with the current document using their IDs. */
  connect?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Disconnect the given documents of type 'Stats' from the current document using their IDs. */
  disconnect?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** Allow manipulating the relationship between the types 'Guild' and 'User'. */
export type GuildUsersRelation = {
  /** Create one or more documents of type 'User' and associate them with the current document. */
  create?: Maybe<Array<Maybe<UserInput>>>;
  /** Connect one or more documents of type 'User' with the current document using their IDs. */
  connect?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Disconnect the given documents of type 'User' from the current document using their IDs. */
  disconnect?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Update an existing document in the collection of 'User' */
  updateUser?: Maybe<User>;
  /** Create a new document in the collection of 'User' */
  createUser: User;
  upsertGuild: Guild;
  /** Create a new document in the collection of 'Guild' */
  createGuild: Guild;
  /** Delete an existing document in the collection of 'Guild' */
  deleteGuild?: Maybe<Guild>;
  /** Update an existing document in the collection of 'Guild' */
  updateGuild?: Maybe<Guild>;
  /** Update an existing document in the collection of 'Stats' */
  updateStats?: Maybe<Stats>;
  /** Delete an existing document in the collection of 'User' */
  deleteUser?: Maybe<User>;
  /** Delete an existing document in the collection of 'Game' */
  deleteGame?: Maybe<Game>;
  /** Update an existing document in the collection of 'Game' */
  updateGame?: Maybe<Game>;
  /** Create a new document in the collection of 'Stats' */
  createStats: Stats;
  /** Delete an existing document in the collection of 'Stats' */
  deleteStats?: Maybe<Stats>;
  /** Create a new document in the collection of 'Game' */
  createGame: Game;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  data: UserInput;
};


export type MutationCreateUserArgs = {
  data: UserInput;
};


export type MutationUpsertGuildArgs = {
  collection?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  data?: Maybe<UpsertGuildInput>;
  connections?: Maybe<Array<Maybe<ConnectionsInput>>>;
};


export type MutationCreateGuildArgs = {
  data: GuildInput;
};


export type MutationDeleteGuildArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateGuildArgs = {
  id: Scalars['ID'];
  data: GuildInput;
};


export type MutationUpdateStatsArgs = {
  id: Scalars['ID'];
  data: StatsInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteGameArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateGameArgs = {
  id: Scalars['ID'];
  data: GameInput;
};


export type MutationCreateStatsArgs = {
  data: StatsInput;
};


export type MutationDeleteStatsArgs = {
  id: Scalars['ID'];
};


export type MutationCreateGameArgs = {
  data: GameInput;
};

/** Allow manipulating the relationship between the types 'Stats' and 'Guild'. */
export type StatsGuildsRelation = {
  /** Create one or more documents of type 'Guild' and associate them with the current document. */
  create?: Maybe<Array<Maybe<GuildInput>>>;
  /** Connect one or more documents of type 'Guild' with the current document using their IDs. */
  connect?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Disconnect the given documents of type 'Guild' from the current document using their IDs. */
  disconnect?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** 'Stats' input values */
export type StatsInput = {
  drinks?: Maybe<Scalars['Int']>;
  chugs?: Maybe<Scalars['Int']>;
  user?: Maybe<StatsUserRelation>;
  guilds?: Maybe<StatsGuildsRelation>;
};

/** Allow manipulating the relationship between the types 'Stats' and 'User' using the field 'Stats.user'. */
export type StatsUserRelation = {
  /** Create a document of type 'User' and associate it with the current document. */
  create?: Maybe<UserInput>;
  /** Connect a document of type 'User' with the current document using its ID. */
  connect?: Maybe<Scalars['ID']>;
  /** If true, disconnects this document from 'User' */
  disconnect?: Maybe<Scalars['Boolean']>;
};


export type UpsertGuildInput = {
  prefix?: Maybe<Scalars['String']>;
  boundChannel?: Maybe<Scalars['String']>;
};

/** Allow manipulating the relationship between the types 'User' and 'Guild'. */
export type UserGuildsRelation = {
  /** Create one or more documents of type 'Guild' and associate them with the current document. */
  create?: Maybe<Array<Maybe<GuildInput>>>;
  /** Connect one or more documents of type 'Guild' with the current document using their IDs. */
  connect?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** Disconnect the given documents of type 'Guild' from the current document using their IDs. */
  disconnect?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

/** 'User' input values */
export type UserInput = {
  avatar?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  steamId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
  stats?: Maybe<UserStatsRelation>;
  guilds?: Maybe<UserGuildsRelation>;
};

/** Allow manipulating the relationship between the types 'User' and 'Stats' using the field 'User.stats'. */
export type UserStatsRelation = {
  /** Create a document of type 'Stats' and associate it with the current document. */
  create?: Maybe<StatsInput>;
  /** Connect a document of type 'Stats' with the current document using its ID. */
  connect?: Maybe<Scalars['ID']>;
  /** If true, disconnects this document from 'Stats' */
  disconnect?: Maybe<Scalars['Boolean']>;
};

export type Game = {
  __typename?: 'Game';
  /** The document's ID. */
  _id: Scalars['ID'];
  /** The document's timestamp. */
  _ts: Scalars['Long'];
  name?: Maybe<Scalars['String']>;
  genre?: Maybe<Array<Maybe<Genre>>>;
};

export type Genre = {
  __typename?: 'Genre';
  name?: Maybe<Scalars['String']>;
};

export type Guild = {
  __typename?: 'Guild';
  stats: StatsPage;
  /** The document's ID. */
  _id: Scalars['ID'];
  prefix?: Maybe<Scalars['String']>;
  users: UserPage;
  boundChannel?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};


export type GuildStatsArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
};


export type GuildUsersArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
};

/** The pagination object for elements of type 'Guild'. */
export type GuildPage = {
  __typename?: 'GuildPage';
  /** The elements of type 'Guild' in this page. */
  data: Array<Maybe<Guild>>;
  /** A cursor for elements coming after the current page. */
  after?: Maybe<Scalars['String']>;
  /** A cursor for elements coming before the current page. */
  before?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** Find a document from the collection of 'Game' by its id. */
  findGameByID?: Maybe<Game>;
  allGuilds: GuildPage;
  allStats: StatsPage;
  allUsers: UserPage;
  /** Find a document from the collection of 'User' by its id. */
  findUserByID?: Maybe<User>;
  /** Find a document from the collection of 'Stats' by its id. */
  findStatsByID?: Maybe<Stats>;
  /** Find a document from the collection of 'Guild' by its id. */
  findGuildByID?: Maybe<Guild>;
};


export type QueryFindGameByIdArgs = {
  id: Scalars['ID'];
};


export type QueryAllGuildsArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
};


export type QueryAllStatsArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
};


export type QueryAllUsersArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
};


export type QueryFindUserByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindStatsByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindGuildByIdArgs = {
  id: Scalars['ID'];
};

export type Stats = {
  __typename?: 'Stats';
  /** The document's ID. */
  _id: Scalars['ID'];
  drinks?: Maybe<Scalars['Int']>;
  chugs?: Maybe<Scalars['Int']>;
  guilds: GuildPage;
  user?: Maybe<User>;
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};


export type StatsGuildsArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
};

/** The pagination object for elements of type 'Stats'. */
export type StatsPage = {
  __typename?: 'StatsPage';
  /** The elements of type 'Stats' in this page. */
  data: Array<Maybe<Stats>>;
  /** A cursor for elements coming after the current page. */
  after?: Maybe<Scalars['String']>;
  /** A cursor for elements coming before the current page. */
  before?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  name?: Maybe<Scalars['String']>;
  stats?: Maybe<Stats>;
  avatar?: Maybe<Scalars['String']>;
  steamId?: Maybe<Scalars['String']>;
  /** The document's ID. */
  _id: Scalars['ID'];
  country?: Maybe<Scalars['String']>;
  guilds: GuildPage;
  id: Scalars['ID'];
  creationDate?: Maybe<Scalars['Int']>;
  userName?: Maybe<Scalars['String']>;
  /** The document's timestamp. */
  _ts: Scalars['Long'];
};


export type UserGuildsArgs = {
  _size?: Maybe<Scalars['Int']>;
  _cursor?: Maybe<Scalars['String']>;
};

/** The pagination object for elements of type 'User'. */
export type UserPage = {
  __typename?: 'UserPage';
  /** The elements of type 'User' in this page. */
  data: Array<Maybe<User>>;
  /** A cursor for elements coming after the current page. */
  after?: Maybe<Scalars['String']>;
  /** A cursor for elements coming before the current page. */
  before?: Maybe<Scalars['String']>;
};


export type GuildInfoFragment = (
  { __typename?: 'Guild' }
  & Pick<Guild, 'boundChannel' | 'prefix'>
  & { stats: (
    { __typename?: 'StatsPage' }
    & StatsPageInfoFragment
  ) }
);

export type UpsertGuildMutationVariables = Exact<{
  guildId: Scalars['ID'];
  data: UpsertGuildInput;
  connections?: Maybe<Array<Maybe<ConnectionsInput>> | Maybe<ConnectionsInput>>;
}>;


export type UpsertGuildMutation = (
  { __typename?: 'Mutation' }
  & { upsertGuild: (
    { __typename?: 'Guild' }
    & Pick<Guild, 'prefix' | 'boundChannel'>
  ) }
);

export type GetGuildQueryVariables = Exact<{
  guildId: Scalars['ID'];
}>;


export type GetGuildQuery = (
  { __typename?: 'Query' }
  & { findGuildByID?: Maybe<(
    { __typename?: 'Guild' }
    & GuildInfoFragment
  )> }
);

export type GetGuildSettingsQueryVariables = Exact<{
  guildId: Scalars['ID'];
}>;


export type GetGuildSettingsQuery = (
  { __typename?: 'Query' }
  & { findGuildByID?: Maybe<(
    { __typename?: 'Guild' }
    & Pick<Guild, 'boundChannel' | 'prefix'>
  )> }
);

export type StatsInfoFragment = (
  { __typename?: 'Stats' }
  & Pick<Stats, 'chugs' | 'drinks'>
);

export type StatsPageInfoFragment = (
  { __typename?: 'StatsPage' }
  & Pick<StatsPage, 'before' | 'after'>
  & { data: Array<Maybe<(
    { __typename?: 'Stats' }
    & StatsInfoFragment
  )>> }
);

export type WriteStatsToUserMutationVariables = Exact<{
  userId: Scalars['ID'];
  data: StatsInput;
}>;


export type WriteStatsToUserMutation = (
  { __typename?: 'Mutation' }
  & { updateStats?: Maybe<(
    { __typename?: 'Stats' }
    & StatsInfoFragment
  )> }
);

export type GetStatsByUserQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetStatsByUserQuery = (
  { __typename?: 'Query' }
  & { findStatsByID?: Maybe<(
    { __typename?: 'Stats' }
    & StatsInfoFragment
  )> }
);

export type GetStatsByGuildQueryVariables = Exact<{
  guildId: Scalars['ID'];
}>;


export type GetStatsByGuildQuery = (
  { __typename?: 'Query' }
  & { findGuildByID?: Maybe<(
    { __typename?: 'Guild' }
    & { stats: (
      { __typename?: 'StatsPage' }
      & StatsPageInfoFragment
    ) }
  )> }
);

export type UserInfoFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'avatar' | 'country' | 'creationDate' | 'steamId' | 'userName'>
  & { stats?: Maybe<(
    { __typename?: 'Stats' }
    & StatsInfoFragment
  )> }
);

export type UserPageInfoFragment = (
  { __typename?: 'UserPage' }
  & Pick<UserPage, 'before' | 'after'>
  & { data: Array<Maybe<(
    { __typename?: 'User' }
    & UserInfoFragment
  )>> }
);

export type CreateUserMutationVariables = Exact<{
  user: UserInput;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & UserInfoFragment
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  userId: Scalars['ID'];
  data: UserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser?: Maybe<(
    { __typename?: 'User' }
    & UserInfoFragment
  )> }
);

export type FindUserQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type FindUserQuery = (
  { __typename?: 'Query' }
  & { findUserByID?: Maybe<(
    { __typename?: 'User' }
    & UserInfoFragment
  )> }
);

export type FindGuildUsersQueryVariables = Exact<{
  guildId: Scalars['ID'];
}>;


export type FindGuildUsersQuery = (
  { __typename?: 'Query' }
  & { findGuildByID?: Maybe<(
    { __typename?: 'Guild' }
    & { users: (
      { __typename?: 'UserPage' }
      & UserPageInfoFragment
    ) }
  )> }
);

export const StatsInfoFragmentDoc = gql`
    fragment StatsInfo on Stats {
  chugs
  drinks
}
    `;
export const StatsPageInfoFragmentDoc = gql`
    fragment StatsPageInfo on StatsPage {
  before
  data {
    ...StatsInfo
  }
  after
}
    ${StatsInfoFragmentDoc}`;
export const GuildInfoFragmentDoc = gql`
    fragment GuildInfo on Guild {
  boundChannel
  prefix
  stats {
    ...StatsPageInfo
  }
}
    ${StatsPageInfoFragmentDoc}`;
export const UserInfoFragmentDoc = gql`
    fragment UserInfo on User {
  id
  avatar
  country
  creationDate
  stats {
    ...StatsInfo
  }
  steamId
  userName
}
    ${StatsInfoFragmentDoc}`;
export const UserPageInfoFragmentDoc = gql`
    fragment UserPageInfo on UserPage {
  before
  data {
    ...UserInfo
  }
  after
}
    ${UserInfoFragmentDoc}`;
export const UpsertGuildDocument = gql`
    mutation upsertGuild($guildId: ID!, $data: UpsertGuildInput!, $connections: [ConnectionsInput]) {
  upsertGuild(
    collection: "guilds"
    id: $guildId
    data: $data
    connections: $connections
  ) {
    prefix
    boundChannel
  }
}
    `;
export const GetGuildDocument = gql`
    query getGuild($guildId: ID!) {
  findGuildByID(id: $guildId) {
    ...GuildInfo
  }
}
    ${GuildInfoFragmentDoc}`;
export const GetGuildSettingsDocument = gql`
    query getGuildSettings($guildId: ID!) {
  findGuildByID(id: $guildId) {
    boundChannel
    prefix
  }
}
    `;
export const WriteStatsToUserDocument = gql`
    mutation writeStatsToUser($userId: ID!, $data: StatsInput!) {
  updateStats(id: $userId, data: $data) {
    ...StatsInfo
  }
}
    ${StatsInfoFragmentDoc}`;
export const GetStatsByUserDocument = gql`
    query getStatsByUser($userId: ID!) {
  findStatsByID(id: $userId) {
    ...StatsInfo
  }
}
    ${StatsInfoFragmentDoc}`;
export const GetStatsByGuildDocument = gql`
    query getStatsByGuild($guildId: ID!) {
  findGuildByID(id: $guildId) {
    stats {
      ...StatsPageInfo
    }
  }
}
    ${StatsPageInfoFragmentDoc}`;
export const CreateUserDocument = gql`
    mutation createUser($user: UserInput!) {
  createUser(data: $user) {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;
export const UpdateUserDocument = gql`
    mutation updateUser($userId: ID!, $data: UserInput!) {
  updateUser(id: $userId, data: $data) {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;
export const FindUserDocument = gql`
    query findUser($userId: ID!) {
  findUserByID(id: $userId) {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;
export const FindGuildUsersDocument = gql`
    query findGuildUsers($guildId: ID!) {
  findGuildByID(id: $guildId) {
    users {
      ...UserPageInfo
    }
  }
}
    ${UserPageInfoFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    upsertGuild(variables: UpsertGuildMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpsertGuildMutation> {
      return withWrapper(() => client.request<UpsertGuildMutation>(UpsertGuildDocument, variables, requestHeaders));
    },
    getGuild(variables: GetGuildQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetGuildQuery> {
      return withWrapper(() => client.request<GetGuildQuery>(GetGuildDocument, variables, requestHeaders));
    },
    getGuildSettings(variables: GetGuildSettingsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetGuildSettingsQuery> {
      return withWrapper(() => client.request<GetGuildSettingsQuery>(GetGuildSettingsDocument, variables, requestHeaders));
    },
    writeStatsToUser(variables: WriteStatsToUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<WriteStatsToUserMutation> {
      return withWrapper(() => client.request<WriteStatsToUserMutation>(WriteStatsToUserDocument, variables, requestHeaders));
    },
    getStatsByUser(variables: GetStatsByUserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetStatsByUserQuery> {
      return withWrapper(() => client.request<GetStatsByUserQuery>(GetStatsByUserDocument, variables, requestHeaders));
    },
    getStatsByGuild(variables: GetStatsByGuildQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetStatsByGuildQuery> {
      return withWrapper(() => client.request<GetStatsByGuildQuery>(GetStatsByGuildDocument, variables, requestHeaders));
    },
    createUser(variables: CreateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateUserMutation> {
      return withWrapper(() => client.request<CreateUserMutation>(CreateUserDocument, variables, requestHeaders));
    },
    updateUser(variables: UpdateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateUserMutation> {
      return withWrapper(() => client.request<UpdateUserMutation>(UpdateUserDocument, variables, requestHeaders));
    },
    findUser(variables: FindUserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FindUserQuery> {
      return withWrapper(() => client.request<FindUserQuery>(FindUserDocument, variables, requestHeaders));
    },
    findGuildUsers(variables: FindGuildUsersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FindGuildUsersQuery> {
      return withWrapper(() => client.request<FindGuildUsersQuery>(FindGuildUsersDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;