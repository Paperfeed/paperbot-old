import countryData from './steam_countries.json'

interface CountryData {
  [key: string]: {
    coordinates: string
    coordinates_accuracy_level: 'country'
    name: string
    states: States
  }
}

interface States {
  [key: string]: {
    cities: Cities
    coordinates: string
    coordinates_accuracy_level: 'state'
  }
}

interface Cities {
  [key: string]: {
    coordinates: string
    coordinates_accuracy_level: 'city'
    name: string
  }
}

export const getLocationData = (
  locCountyCode: string | undefined,
  locStateCode: string | undefined,
  locCityId: string | undefined,
) => {
  let state, city
  const country = ((countryData as unknown) as CountryData)[locCountyCode]

  if (country) {
    state = country.states[locStateCode]
  }

  if (state) {
    city = state.cities[locCityId]
  }

  if (!city) {
  }

  return {
    city: city?.name,
    country: country?.name,
    state: state?.name,
  }
}
