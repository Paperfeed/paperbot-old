import faunadb, { Client } from 'faunadb'

import { UserSummary } from '../API/types'
import { FaunaError } from './FaunaError'

const { FAUNA_SERVER_KEY } = process.env
const { Collection, Create, Get, Ref } = faunadb.query

interface CreateUserData {
  id: string
  name: string
  steamData: UserSummary
  steamId: string
}

export class FaunaClient {
  private client: Client

  constructor() {
    this.client = new faunadb.Client({
      secret: FAUNA_SERVER_KEY,
    })
  }

  public async createUser({ id, name, steamData, steamId }: CreateUserData) {
    try {
      return await this.client.query(
        Create(Collection('users'), {
          data: { id, name, steamData, steamId },
        }),
      )
    } catch (error) {
      throw new FaunaError(error)
    }
  }

  public async retrieveUser(id: string) {
    try {
      return await this.client.query(Get(Ref(Collection('users'), id)))
    } catch (error) {
      throw new FaunaError(error)
    }
  }
}
