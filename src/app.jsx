import localforage from 'localforage'
import {
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
  useNavigate,
  useLoaderData,
  useOutletContext,
  useRouteError,
  RouterProvider,
  Route,
  Link,
  Navigate,
  Form
} from 'react-router-dom'
import { AppLayout } from '@/layouts/app-layout'
import { appLoader } from '@/layouts/app-loader'
import { loginLoader } from '@/pages/login-loader'
import { loginAction } from '@/pages/login-action'
import { logoutAction } from '@/pages/logout-action'
import { Home } from '@/pages/home'
import { About } from '@/pages/about'
import { Pricing } from '@/pages/pricing'
import { Login } from '@/pages/login'
import { Cities } from '@/pages/cities'
import { TripDetails } from '@/pages/trip-details'
import { Header } from '@/ui/header'
import { CountryFlag } from '@/ui/country-flag'

const NotFound = () =>
  <>
    <Header />
    <main className="main-not-found">
      <section>
        <div>
          <h1>Página não encontrada</h1>
          <p>Volte para a <Link to="/">página inicial</Link></p>
        </div>
      </section>
    </main>
  </>

const Countries = () => {
  const cities = useOutletContext()
  const countries = cities.reduce((acc, city) => {
    const duplicatedCountry = acc.some(accItem => accItem.name === city.country.name)
    return duplicatedCountry ? acc : [...acc, city.country]
  }, [])

  return (
    <ul className="countries">
      {countries.map(country =>
        <li key={country.name}>
          <CountryFlag country={country} width={24} height={18} className="mr-05 mb--3px" />
          {country.name}
        </li>
      )}
    </ul>
  )
}

const fetchCityInDb = id =>
  localforage.getItem('cities').then(cities => cities?.find(city => city.id === id))

const fetchCityInfo = async request => {
  const url = new URL(request.url)
  const [latitude, longitude] = ['latitude', 'longitude'].map(item => url.searchParams.get(item))
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt-BR`)
  const { city, countryName, countryCode } = await response.json()
  return {
    id: request.url.split('/')[5],
    name: city,
    country: { name: countryName, code: countryCode.toLowerCase() },
    position: { latitude, longitude }
  }
}

const cityLoader = async ({ request, params }) => {
  const cityInDb = await fetchCityInDb(params.id)
  if (cityInDb) {
    return cityInDb
  }

  return fetchCityInfo(request)
}

const formAction = async ({ request, params }) => {
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

const EditCity = () => {
  const city = useLoaderData()
  const navigate = useNavigate()
  const handleClickBack = () => navigate('/app/cidades')
  return (
    <Form method="post" className="form-edit-city">
      <label>
        <span>Nome da cidade</span>
        <input key={city.id} defaultValue={city.name} name="name" required />
        <CountryFlag country={city.country} className="pa r1 t-3-5" />
      </label>
      <label>
        <span>Quando você foi para {city.name}?</span>
        <input name="date" required type="date" defaultValue={city.date || ''} />
      </label>
      <label>
        <span>Suas anotações sobre a cidade</span>
        <textarea name="notes" required defaultValue={city.notes || ''}></textarea>
      </label>
      <div className="buttons">
        <button onClick={handleClickBack} className="btn-back" type="button">&larr; Voltar</button>
        <button className="btn-save" type="submit">Salvar</button>
      </div>
    </Form>
  )
}

const deleteAction = async ({ params }) => {
  const cities = await localforage.getItem('cities')
  await localforage.setItem('cities', cities ? cities.filter(city => city.id !== params.id) : [])
  return redirect('/app/cidades')
}

const ErrorMessage = () => {
  const error = useRouteError()
  return (
    <>
      <Header />
      <main className="main-not-found">
        <section>
          <div>
            <h1>Opa!</h1>
            <p>Desculpe, um erro inesperado aconteceu:</p>
            <p><i>{error.message}</i></p>
          </div>
        </section>
      </main>
    </>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route errorElement={<ErrorMessage />}>
        <Route index element={<Home />} />
        <Route path="sobre" element={<About />} />
        <Route path="preco" element={<Pricing />} />
        <Route path="login" element={<Login />} loader={loginLoader} action={loginAction} />
        <Route path="logout" action={logoutAction} />
        <Route path="app" element={<AppLayout />} loader={appLoader}>
          <Route index element={<Navigate to="cidades" replace />} />
          <Route path="cidades" element={<Cities />} />
          <Route path="cidades/:id" element={<TripDetails />} />
          <Route path="cidades/:id/edit" element={<EditCity />} loader={cityLoader} action={formAction} />
          <Route path="cidades/:id/delete" action={deleteAction} />
          <Route path="paises" element={<Countries />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  )
)

const App = () => <RouterProvider router={router} />

export { App }
