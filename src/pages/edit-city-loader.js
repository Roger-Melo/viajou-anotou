import { fetchCityInDb } from '@/resources/utils/fetch-city-in-db'
import { fetchCityInfo } from '@/resources/utils/fetch-city-info'

const editCityLoader = async ({ request, params }) => {
  const cityInDb = await fetchCityInDb(params.id)
  if (cityInDb) {
    return cityInDb
  }

  return fetchCityInfo(request)
}

export { editCityLoader }
