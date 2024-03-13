import {
  createBrowserRouter,
  createRoutesFromElements,
  useRouteError,
  RouterProvider,
  Route,
  Navigate
} from 'react-router-dom'
import { AppLayout } from '@/layouts/app-layout'
import { appLoader } from '@/layouts/app-loader'
import { loginLoader } from '@/pages/login-loader'
import { loginAction } from '@/pages/login-action'
import { logoutAction } from '@/pages/logout-action'
import { editCityLoader } from '@/pages/edit-city-loader'
import { editCityAction } from '@/pages/edit-city-action'
import { deleteCityAction } from '@/pages/delete-city-action'
import { Home } from '@/pages/home'
import { About } from '@/pages/about'
import { Pricing } from '@/pages/pricing'
import { Login } from '@/pages/login'
import { Cities } from '@/pages/cities'
import { TripDetails } from '@/pages/trip-details'
import { EditCity } from '@/pages/edit-city'
import { Countries } from '@/pages/countries'
import { NotFound } from '@/pages/not-found'
import { Header } from '@/ui/header'

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
          <Route path="cidades/:id/delete" action={deleteCityAction} />
          <Route path="paises" element={<Countries />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  )
)

const App = () => <RouterProvider router={router} />

export { App }
