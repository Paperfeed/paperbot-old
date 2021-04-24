import { fetchAsync, UrlBuildParams } from '../utils'
import { SteamAuth } from './SteamAuth'
import {
  AppDetails,
  AppDetailsResponse,
  GetAppListResponse,
  GetOwnedGamesResponse,
  OwnedGame,
  ResolveVanityUrlResponse,
  SteamGame,
  UserSummary,
  UserSummaryResponse,
} from './types'

// Get apps details
// https://store.steampowered.com/api/appdetails?appids=594330
// https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI#Known_methods
//

// Get all available apps
// https://api.steampowered.com/ISteamApps/GetAppList/v2/

// Get currently logged in users' information
// https://store.steampowered.com/dynamicstore/userdata/

const STEAM_API_HOST = 'https://api.steampowered.com'
const STEAM_STORE_API_HOST = 'https://store.steampowered.com'
const { STEAM_API_KEY } = process.env

export class SteamAPI {
  private static _instance: SteamAPI
  public Auth: SteamAuth

  constructor() {
    this.Auth = new SteamAuth()
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  async getAllGames(): Promise<SteamGame[]> {
    const data = await fetchAsync<GetAppListResponse>(
      STEAM_API_HOST + '/ISteamApps/GetAppList/v2/',
    )
    return data ? data.applist.apps : null
  }

  async getSteamId(username: string): Promise<string> {
    // https://partner.steamgames.com/doc/webapi/ISteamUser#ResolveVanityURL
    const data = await fetchAsync<ResolveVanityUrlResponse>(
      this.STEAM_BUILD_API_REQUEST(
        STEAM_API_HOST,
        '/ISteamUser/ResolveVanityURL/v0001/',
        {
          vanityurl: username,
        },
      ),
    )

    if (data && data.response.success === 1) {
      return data.response.steamid
    } else {
      return null
    }
  }

  async getUserSummary(steamId: string): Promise<UserSummary> {
    const data = await fetchAsync<UserSummaryResponse>(
      this.STEAM_BUILD_API_REQUEST(
        STEAM_API_HOST,
        '/ISteamUser/GetPlayerSummaries/v0002/',
        {
          steamids: steamId,
        },
      ),
    )

    if (data && data.response.players.length) {
      return data.response.players[0]
    } else {
      return null
    }
  }

  async getUserGames(
    userId: string,
    withAppInfo = 1,
    freeGames = 1,
  ): Promise<OwnedGame[]> {
    const data = await fetchAsync<GetOwnedGamesResponse>(
      this.STEAM_BUILD_API_REQUEST(
        STEAM_API_HOST,
        '/IPlayerService/GetOwnedGames/v0001/',
        {
          format: 'json',
          include_appinfo: withAppInfo,
          include_played_free_games: freeGames,
          steamid: userId,
        },
      ),
    )

    if (data && data.response.games.length) {
      return data.response.games
    } else {
      return null
    }
  }

  async getGameInfo(appid: string, filters = ''): Promise<Partial<AppDetails>> {
    const data = await fetchAsync<AppDetailsResponse>(
      this.STEAM_BUILD_API_REQUEST(STEAM_STORE_API_HOST, '/api/appdetails', {
        appids: appid,
        filters: filters,
      }),
    ).catch(() => null)

    if (data && data[appid].success) {
      return data[appid].data
    } else if (data[appid].success === false) {
      // No info on this AppId return invalid
      return { type: 'invalid' }
    } else {
      return null
    }
  }

  // Builds the object containing the necessary SteamAPI information
  private STEAM_BUILD_API_REQUEST(
    host: string,
    path: string,
    keys: Record<string, string | number>,
  ): string {
    const url = `${host}${path}?${UrlBuildParams({
      key: STEAM_API_KEY,
      ...keys,
    })}`

    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching: ', url)
    }

    return url
  }
}
