import localforage from 'localforage'
import { useMap, useMapEvents, MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import {
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
  useNavigate,
  useLocation,
  useParams,
  useLoaderData,
  useOutletContext,
  useSearchParams,
  useRouteError,
  useActionData,
  RouterProvider,
  Route,
  NavLink,
  Link,
  Outlet,
  Navigate,
  Form
} from 'react-router-dom'

const links = [
  { path: '/', text: 'Início' },
  { path: '/sobre', text: 'Sobre' },
  { path: '/preco', text: 'Preço' },
  { path: '/login', text: 'Login' }
]

const Logo = ({ version = 'dark' }) =>
  <Link to="/">
    <img className="logo" src={`/logo-viajou-anotou-${version}.png`} alt="Logo ViajouAnotou" />
  </Link>

const Header = () => {
  const location = useLocation()
  const isNotHomepage = location.pathname !== '/'
  return (
    <header>
      <nav className="nav pa">
        <Logo version={isNotHomepage ? 'dark' : 'light'} />
        <ul>
          {links.map(link => {
            const linkShouldBeGray = isNotHomepage && location.pathname !== link.path
            const isLogin = link.path === '/login'
            return (
              <li key={link.text}>
                <NavLink
                  to={link.path}
                  style={linkShouldBeGray && !isLogin ? { color: '#C2C2C2' } : isLogin ? { color: 'white' } : null}
                  className={isLogin ? 'cta' : ''}
                >
                  {link.text}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

const Home = () =>
  <>
    <Header />
    <main className="main-home">
      <section>
        <h1>Você viaja o mundo.<br />E o ViajouAnotou mantém suas aventuras anotadas.</h1>
        <h2>Um mapa mundial que rastreia por onde você passou. Nunca esqueça suas experiências e mostre aos seus amigos o quê você fez pelo mundo.</h2>
        <Link to="/app" className="cta">Começar agora</Link>
      </section>
    </main>
  </>

const About = () =>
  <>
    <Header />
    <main className="main-about">
      <section>
        <div>
          <h1>Sobre o ViajouAnotou.</h1>
          <p>O ViajouAnotou nasceu do desejo dos amigos Paulo e Roberto de compartilharem de forma rápida suas aventuras pelo mundo.</p>
          <p>Aos poucos, esse desejo virou realidade em forma de software entre amigos e familiares. Hoje, você também pode ser parte dessa comunidade.</p>
        </div>
        <img src="/sobre-viajou-anotou.jpg" alt="Paulo e Roberto" />
      </section>
    </main>
  </>

const Pricing = () =>
  <>
    <Header />
    <main className="main-pricing">
      <section>
        <div>
          <h1>Preço simples.<br />Só R$ 47/mês.</h1>
          <p>Comece hoje mesmo a anotar suas aventuras e mostre aos seus amigos o quê você fez pelo mundo.</p>
        </div>
        <img src="/preco-viajou-anotou.jpg" alt="Avenida Paulista" />
      </section>
    </main>
  </>

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

const Login = () => {
  const actionData = useActionData()
  return (
    <>
      <Header />
      <main className="main-login">
        <section>
          <Form method="post" className="form-login" replace>
            <div className="row">
              <label>
                Email
                <input name="email" type="email" defaultValue="oi@joaquim.com" required />
              </label>
            </div>
            <button>Login</button>
            {actionData && actionData.error ? <p style={{ color: 'red' }}>{actionData.error}</p> : null}
          </Form>
        </section>
      </main>
    </>
  )
}

const appLoader = async () => {
  if (!fakeAuthProvider.isAuthenticated) {
    return redirect('/login')
  }

  const cities = await localforage.getItem('cities')
  return cities ?? []
}

const ChangeCenter = ({ position }) => {
  const map = useMap()
  map.setView(position)
  return null
}

const ChangeToClickedCity = () => {
  const navigate = useNavigate()
  const id = crypto.randomUUID()
  useMapEvents({
    click: e => navigate(`cidades/${id}/edit?latitude=${e.latlng.lat}&longitude=${e.latlng.lng}`)
  })
}

const curitibaPosition = { latitude: '-25.437370980404776', longitude: '-49.27058902123733' }

const Map = ({ cities }) => {
  const [searchParams] = useSearchParams()
  const [latitude, longitude] = ['latitude', 'longitude'].map(item => searchParams.get(item))
  return (
    <div className="map">
      <MapContainer className="map-container" center={[curitibaPosition.latitude, curitibaPosition.longitude]} zoom={11} scrollWheelZoom={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {cities.map(({ id, position, name }) =>
          <Marker key={id} position={[position.latitude, position.longitude]}>
            <Popup>{name}</Popup>
          </Marker>
        )}
        {latitude && longitude && <ChangeCenter position={[latitude, longitude]} />}
        <ChangeToClickedCity />
      </MapContainer>
    </div>
  )
}

const logoutAction = async () => {
  await fakeAuthProvider.signOut()
  return redirect('/')
}

const AppLayout = () => {
  const cities = useLoaderData()
  return (
    <main className="main-app-layout">
      <div className="sidebar">
        <header>
          <Logo />
        </header>
        <nav className="nav-app-layout">
          <ul>
            <li><NavLink to="cidades">Cidades</NavLink></li>
            <li><NavLink to="paises">Países</NavLink></li>
          </ul>
        </nav>
        <Outlet context={cities} />
      </div>
      <Map cities={cities} />
      <Form method="post" action="/logout">
        <button className="btn-logout">Logout</button>
      </Form>
    </main>
  )
}

const CountryFlag = ({ country, className, width = 20, height = 15 }) => {
  const src = `https://flagcdn.com/${width}x${height}/${country.code}.png`
  return <img className={className} src={src} alt={country.name} />
}

const Cities = () => {
  const cities = useOutletContext()
  return cities.length === 0
    ? <p className="initial-message">Clique no mapa para adicionar uma cidade</p>
    : (
      <ul className="cities">
        {cities.map(({ id, position, name, country }) =>
          <li key={id}>
            <Link to={`${id}?latitude=${position.latitude}&longitude=${position.longitude}`}>
              <CountryFlag country={country} />
              <h3>{name}</h3>
            </Link>
          </li>
        )}
      </ul>
    )
}

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

const TripDetails = () => {
  const params = useParams()
  const navigate = useNavigate()
  const cities = useOutletContext()
  const city = cities.find(city => params.id === String(city.id))
  const handleClickBack = () => navigate('/app/cidades')

  const deleteTrip = e => {
    const wantToDelete = confirm('Por favor, confirme que você quer deletar essa viagem.')
    if (!wantToDelete) {
      e.preventDefault()
    }
  }

  return (
    <div className="city-details">
      <div className="row">
        <h5>Nome da cidade</h5>
        <h3>
          <CountryFlag country={city.country} />
          {city.name}
        </h3>
      </div>
      <div className="row">
        <h5>Quando você foi para {city.name}?</h5>
        <p>{city.date}</p>
      </div>
      <div className="row">
        <h5>Suas anotações</h5>
        <p>{city.notes}</p>
      </div>
      <div className="buttons">
        <button className="btn-back" onClick={handleClickBack}>&larr; Voltar</button>
        <Form action="edit">
          <button className="btn-edit" type="submit">&there4; Editar</button>
        </Form>
        <Form method="post" action="delete" onSubmit={deleteTrip}>
          <button className="btn-delete" type="submit">&times; Deletar</button>
        </Form>
      </div>
    </div>
  )
}

const fetchCity = id =>
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
  const cityInStorage = await fetchCity(params.id)
  if (cityInStorage) {
    return cityInStorage
  }

  return fetchCityInfo(request)
}

const formAction = async ({ request, params }) => {
  const formData = Object.fromEntries(await request.formData())
  const cities = await localforage.getItem('cities')
  const cityDetailsRoute = `/app/cidades/${params.id}`
  const cityInStorage = await fetchCity(params.id)
  if (cityInStorage) {
    const city = { ...cityInStorage, ...formData }
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

const fakeAuthProvider = {
  isAuthenticated: false,
  email: null,
  signIn: async function (email) {
    await new Promise(resolve => setTimeout(resolve, 500))
    this.isAuthenticated = true
    this.email = email
  },
  signOut: async function () {
    await new Promise(resolve => setTimeout(resolve, 500))
    this.isAuthenticated = false
    this.email = null
  }
}

const loginAction = async ({ request }) => {
  const { email } = Object.fromEntries(await request.formData())

  if (email.length < 4) {
    return { error: 'O email não pode ter menos de 4 caracteres' }
  }

  try {
    await fakeAuthProvider.signIn(email)
  } catch (error) {
    return { error: 'Não foi possível fazer login. Por favor, tente novamente' }
  }

  return redirect('/app')
}

const loginLoader = async () => {
  if (!fakeAuthProvider.isAuthenticated) {
    return null
  }

  return redirect('/app')
}

const App = () => {
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

  return <RouterProvider router={router} />
}

export { App }
