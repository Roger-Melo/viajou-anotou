import localforage from 'localforage'
import {
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
  useOutletContext,
  useRouteError,
  RouterProvider,
  Route,
  Link,
  Navigate
} from 'react-router-dom'
import { AppLayout } from '@/layouts/app-layout'
import { appLoader } from '@/layouts/app-loader'
import { loginLoader } from '@/pages/login-loader'
import { loginAction } from '@/pages/login-action'
import { logoutAction } from '@/pages/logout-action'
import { editCityLoader } from '@/pages/edit-city-loader'
import { editCityAction } from '@/pages/edit-city-action'
import { Home } from '@/pages/home'
import { About } from '@/pages/about'
import { Pricing } from '@/pages/pricing'
import { Login } from '@/pages/login'
import { Cities } from '@/pages/cities'
import { TripDetails } from '@/pages/trip-details'
import { EditCity } from '@/pages/edit-city'
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
          <Route path="cidades/:id/edit" element={<EditCity />} loader={editCityLoader} action={editCityAction} />
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
