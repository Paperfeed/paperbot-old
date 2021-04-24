import { FastifyRequest } from 'fastify'
import openid, { RelyingParty } from 'openid'

import { SteamAPI } from './SteamAPI'
import { UserSummary } from './types'

const { STEAM_AUTH_REALM, STEAM_AUTH_RETURNURL } = process.env

export class SteamAuth {
  private realm: string
  private returnUrl: string
  private relyingParty: RelyingParty

  constructor() {
    if (!STEAM_AUTH_REALM || !STEAM_AUTH_RETURNURL) {
      throw new Error('Missing realm or returnURL. These are required.')
    }

    this.realm = STEAM_AUTH_REALM
    this.returnUrl = STEAM_AUTH_RETURNURL
    this.relyingParty = new openid.RelyingParty(
      STEAM_AUTH_RETURNURL,
      STEAM_AUTH_REALM,
      true,
      true,
      [],
    )
  }

  async getRedirectUrl(queryString?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.relyingParty.authenticate(
        'https://steamcommunity.com/openid',
        false,
        (error, authUrl) => {
          if (error) return reject('Authentication failed: ' + error)
          if (!authUrl) return reject('Authentication failed.')

          resolve(authUrl)
        },
        queryString,
      )
    })
  }

  async fetchIdentifier(steamOpenId: string): Promise<UserSummary> {
    return new Promise(async (resolve, reject) => {
      const steamId = steamOpenId.replace(
        'https://steamcommunity.com/openid/id/',
        '',
      )

      try {
        const user = await SteamAPI.Instance.getUserSummary(steamId)

        if (!user) {
          reject('No user found for the given SteamID')
        }

        resolve(user)
      } catch (error) {
        reject('Steam server error: ' + error.message)
      }
    })
  }

  async authenticate(request: FastifyRequest): Promise<UserSummary> {
    return new Promise((resolve, reject) => {
      this.relyingParty.verifyAssertion(request, async (error, result) => {
        if (error) return reject(error.message)

        if (!result || !result.authenticated) {
          return reject('Failed to authenticate user.')
        }

        if (
          !/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(
            result.claimedIdentifier,
          )
        ) {
          return reject('Claimed identity is not valid.')
        }

        try {
          const user = await this.fetchIdentifier(result.claimedIdentifier)
          return resolve(user)
        } catch (error) {
          reject(error)
        }
      })
    })
  }
}
