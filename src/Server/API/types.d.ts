interface SteamGame {
  appid: number
  name: string
}

export interface GetAppListResponse {
  applist: {
    apps: SteamGame[]
  }
}

export interface ResolveVanityUrlResponse {
  response: {
    steamid: string
    success: number
  }
}

export interface GetOwnedGamesResponse {
  response: {
    game_count: number
    games: OwnedGame[]
  }
}

export interface OwnedGame {
  appid: string
  img_icon_url: string
  img_logo_url: string
  name: string
  playtime_forever: number
  playtime_linux_forever: number
  playtime_mac_forever: number
  playtime_windows_forever: number
}

export interface UserSummaryResponse {
  response: { players: UserSummary[] }
}

export interface UserSummary {
  avatar: string
  avatarfull: string
  avatarmedium: string
  communityvisibilitystate: number
  lastlogoff: number
  loccountrycode: string
  locstatecode: string
  personaname: string
  personastate: number
  personastateflags: number
  primaryclanid: string
  profilestate: number
  profileurl: string
  realname: string
  steamid: string
  timecreated: number
}

export interface AppDetailsResponse {
  [key: string]: {
    data: AppDetails
    success: boolean
  }
}
export interface AppDetails {
  about_the_game: string
  achievements: {
    highlighted: {
      name: string
      path: string
    }[]
    release_date: {
      coming_soon: false
      date: string
    }
    support_info: {
      email: string
      url: string
    }
    total: number
  }
  background: string
  categories: {
    description: string
    id: number
  }[]
  content_descriptors: {
    ids: number[]
    notes: string[] | null
  }
  demos: { appid: string; description: string }[]
  detailed_description: string
  developers: string[]
  dlc: number[]
  genres: { description: string; id: number }[]
  header_image: string
  is_free: boolean
  linux_requirements: RequirementDetails | []
  mac_requirements: RequirementDetails | []
  metacritic: {
    score: number
    url: string
  }
  movies: {
    highlight: boolean
    id: number
    mp4: {
      480: string
      max: string
    }
    name: string
    thumbnail: string
    webm: {
      480: string
      max: string
    }
  }[]
  name: string
  package_groups: PackageGroup[]
  packages: number[]
  pc_requirements: RequirementDetails
  platforms: {
    linux: boolean
    mac: boolean
    windows: boolean
  }
  price_overview: PriceOverview
  publishers: string[]
  recommendations: {
    total: number
  }
  required_age: number
  screenshots: {
    id: number
    path_full: string
    path_thumbnail: string
  }[]
  short_description: string
  steam_appid: number
  supported_languages: string
  type: string
  website: string
}

interface RequirementDetails {
  mininum: string
}

interface PriceOverview {
  currency: string
  discount_percent: number
  final: number
  final_formatted: string
  initial: number
  initial_formatted: string
}

interface PackageGroup {
  description: string
  display_type: number
  is_recurring_subcription: boolean
  name: string
  save_text: string
  selection_text: string
  subs: {
    can_get_free_license: boolean
    is_free_license: boolean
    option_description: string
    option_text: string
    packageid: number
    percent_savings: number
    percent_savings_text: string
    price_in_cents_with_discount: number
  }[]
  title: string
}
