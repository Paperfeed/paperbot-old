import faunadb, {
  Abort,
  Client,
  Collection,
  Create,
  Exists,
  Get,
  If,
  Let,
  Ref,
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
}
