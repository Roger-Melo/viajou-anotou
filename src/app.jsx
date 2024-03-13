import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate } from 'react-router-dom'
import { appLoader } from '@/layouts/app-loader'
import { loginLoader } from '@/pages/login/login-loader'
import { loginAction } from '@/pages/login/login-action'
import { logoutAction } from '@/pages/logout-action'
import { editCityLoader } from '@/pages/edit-city/edit-city-loader'
import { editCityAction } from '@/pages/edit-city/edit-city-action'
import { deleteCityAction } from '@/pages/delete-city-action'
import { ErrorMessage } from '@/pages/error-message'

const Home = () => import('@/pages/home')
const About = () => import('@/pages/about')
const Pricing = () => import('@/pages/pricing')
const Login = () => import('@/pages/login')
const AppLayout = () => import('@/layouts/app-layout')
const Cities = () => import('@/pages/cities')
const TripDetails = () => import('@/pages/trip-details')
const EditCity = () => import('@/pages/edit-city')
const Countries = () => import('@/pages/countries')
const NotFound = () => import('@/pages/not-found')

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route errorElement={<ErrorMessage />}>
        <Route index lazy={Home} />
        <Route path="sobre" lazy={About} />
        <Route path="preco" lazy={Pricing} />
        <Route path="login" lazy={Login} loader={loginLoader} action={loginAction} />
        <Route path="logout" action={logoutAction} />
        <Route path="app" lazy={AppLayout} loader={appLoader}>
          <Route index element={<Navigate to="cidades" replace />} />
          <Route path="cidades" lazy={Cities} />
          <Route path="cidades/:id" lazy={TripDetails} />
          <Route path="cidades/:id/edit" lazy={EditCity} loader={editCityLoader} action={editCityAction} />
          <Route path="cidades/:id/delete" action={deleteCityAction} />
          <Route path="paises" lazy={Countries} />
        </Route>
        <Route path="*" lazy={NotFound} />
      </Route>
    </Route>
  )
)

const App = () => <RouterProvider router={router} />

export { App }
