import localforage from 'localforage'
import { redirect } from 'react-router-dom'
import { fetchCityInDb } from '@/resources/utils/fetch-city-in-db'
import { fetchCityInfo } from '@/resources/utils/fetch-city-info'

const editCityAction = async ({ request, params }) => {
  const formData = Object.fromEntries(await request.formData())
  const cities = await localforage.getItem('cities')
  const cityDetailsRoute = `/app/cidades/${params.id}`
  const cityInDb = await fetchCityInDb(params.id)
  if (cityInDb) {
    const city = { ...cityInDb, ...formData }
    await localforage.setItem('cities', [...cities.filter(city => city.id !== params.id), city])
    return redirect(cityDetailsRoute)
  }

  const cityInfo = await fetchCityInfo(request)
  const city = { ...cityInfo, ...formData }
  await localforage.setItem('cities', cities ? [...cities, city] : [city])
  return redirect(cityDetailsRoute)
}

export { editCityAction }
