import faunadb, { Client } from 'faunadb'
import { GraphQLClient } from 'graphql-request'

import {
  ConnectionsInput,
  getSdk,
  Sdk,
  StatsInput,
  UpsertGuildInput,
  UserInput,
} from '../../generated/graphql'

const { FAUNA_SERVER_KEY } = process.env

export interface UserData {
  avatar: string
  country: string
  creationDate: number
  id: string
  name: string
  steamId: string
  userName: string
}

export class FaunaClient {
  private client: Client
  private graphql: Sdk

  constructor() {
    const client = new GraphQLClient('https://graphql.fauna.com/graphql', {
      headers: {
        authorization: `Bearer ${process.env.FAUNA_ADMIN_KEY}`,
      },
    })
    this.graphql = getSdk(client)

    this.client = new faunadb.Client({
      secret: FAUNA_SERVER_KEY,
    })
  }

  public async getGuildSettings(guildId: string) {
    const guild = await this.graphql.getGuildSettings({ guildId })
    return guild.findGuildByID
  }

  public async writeGuildSettings(
    guildId: string,
    settings: Omit<UpsertGuildInput, 'id'>,
    userId?: string,
  ) {
    const connections: ConnectionsInput[] = []
    if (userId) {
      connections.push({
        connectToCollection: 'user_guilds',
        connectToId: userId,
        fromIdName: 'guildID',
        indexName: 'guild_user_by_user',
        toCollection: 'users',
        toIdName: 'userID',
      })
      connections.push({
        connectToCollection: 'guild_stats',
        connectToId: userId,
        fromIdName: 'guildID',
        indexName: 'guild_stats_by_stats',
        toCollection: 'stats',
        toIdName: 'statsID',
      })
    }

    const guild = await this.graphql.upsertGuild({
      connections,
      data: settings,
      guildId,
    })
    console.log(guild.upsertGuild)

    return guild.upsertGuild
  }

  public async createOrUpdateUser(data: UserInput) {
    const user = await this.graphql.updateUser({ data, userId: data.id })
    return user.updateUser
  }

  public async findUser(userId: string) {
    const user = await this.graphql.findUser({ userId })
    return user.findUserByID
  }

  public async findGuildUsers(guildId: string) {
    const guildUsers = await this.graphql.findGuildUsers({ guildId })
    return guildUsers.findGuildByID.users.data
  }

  public async getGuildStats(guildId: string) {
    const guildStats = await this.graphql.getStatsByGuild({ guildId })
    return guildStats.findGuildByID.stats.data
  }

  public async getGuild(guildId: string) {
    const guildStats = await this.graphql.getGuild({ guildId })
    return guildStats.findGuildByID
  }

  public async writeToStats(
    userId: string,
    guildId: string | undefined,
    stats: StatsInput,
  ) {
    const connections: ConnectionsInput[] = []
    if (guildId) {
      connections.push({
        connectFromId: guildId,
        connectToCollection: 'user_guilds',
        connectToId: userId,
        fromCollection: 'guilds',
        fromIdName: 'guildID',
        indexName: 'user_guilds_by_user',
        toCollection: 'users',
        toIdName: 'userID',
      })
      connections.push({
        connectFromId: guildId,
        connectToCollection: 'guild_stats',
        connectToId: userId,
        fromCollection: 'guilds',
        fromIdName: 'guildID',
        indexName: 'guild_stats_by_stats',
        toCollection: 'stats',
        toIdName: 'statsID',
      })
    }

    const updatedStats = await this.graphql.writeStatsToUser({
      connections,
      data: stats,
      userId,
    })

    return updatedStats.incrementStats

    /*const currentStats = (await this.graphql.getStatsByUser({ userId }))
      .findStatsByID

    ;(Object.keys(currentStats) as (keyof Omit<
      StatsInput,
      'user' | 'guilds'
    >)[]).reduce((obj, key) => {
      if (typeof currentStats[key] === 'number') {
        obj[key] = currentStats[key] + (stats[key] || 0)
      }
      return obj
    }, stats)

    return await this.graphql.writeStatsToUser({
      data: {
        ...stats,
        guilds: {
          connect: [guildId],
        },
        user: {
          connect: userId,
        },
      },
      userId,
    })*/
  }
}
