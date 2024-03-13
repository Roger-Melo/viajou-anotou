import localforage from 'localforage'
import { redirect } from 'react-router-dom'

const deleteCityAction = async ({ params }) => {
  const cities = await localforage.getItem('cities')
  await localforage.setItem('cities', cities ? cities.filter(city => city.id !== params.id) : [])
  return redirect('/app/cidades')
}

export { deleteCityAction }
