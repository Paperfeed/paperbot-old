import faunadb, {
  Abort,
  Add,
  Client,
  Collection,
  ContainsPath,
  Create,
  Exists,
  Expr,
  Get,
  If,
  Let,
  Ref,
  Select,
  Update,
  values,
  Var,
} from 'faunadb'

import { FaunaError } from './FaunaError'
import Document = values.Document

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

  constructor() {
    this.client = new faunadb.Client({
      secret: FAUNA_SERVER_KEY,
    })
  }

  public async getChannelSettings(channelId: string) {
    try {
      const ref = Ref(Collection('channels'), channelId)

      return await this.client.query(
        Let(
          { channelExists: Exists(ref) },
          If(Var('channelExists'), Get(ref), Abort('User does not exist')),
        ),
      )
    } catch (error) {
      throw new FaunaError(error)
    }
  }

  public async writeChannelSettings(
    channelId: string,
    settings: { guild?: string; prefix?: string },
  ) {
    try {
      const ref = Ref(Collection('channels'), channelId)
    } catch (error) {
      throw new FaunaError(error)
    }
  }

  public async createOrUpdateUser(
    userData: UserData,
  ): Promise<Document<UserData>> {
    try {
      const ref = Ref(Collection('users'), userData.id)
      const data = {
        data: userData,
      }

      return await this.client.query(
        If(Exists(ref), Update(ref, data), Create(ref, data)),
      )
    } catch (error) {
      throw new FaunaError(error)
    }
  }

  public async retrieveUser(id: string): Promise<Document<UserData>> {
    try {
      const ref = Ref(Collection('users'), id)
      return await this.client.query(
        Let(
          { userExists: Exists(ref) },
          If(Var('userExists'), Get(ref), Abort('User does not exist')),
        ),
      )
    } catch (error) {
      throw new FaunaError(error)
    }
  }

  public async writeToStats(
    userId: string,
    stats: Record<string, string | number>,
  ) {
    const ref = Ref(Collection('stats'), userId)

    const dbStats = Object.keys(stats).reduce((obj, key) => {
      if (typeof stats[key] === 'number') {
        obj[key] = If(
          ContainsPath(['data', key], Get(ref)),
          Add(Select(['data', key], Get(ref)), stats[key]),
          stats[key],
        )
      } else {
        obj[key] = stats[key]
      }

      return obj
    }, {} as Record<string, Expr | string | number>)

    return await this.client
      .query(
        If(
          Exists(ref),
          Update(ref, {
            data: dbStats,
          }),
          Create(ref, { data: stats }),
        ),
      )
      .catch(e => console.error('Something went wrong writing stats', stats, e))
  }
}
