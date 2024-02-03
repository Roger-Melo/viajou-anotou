import localforage from 'localforage'
import { useMapEvents, useMap, MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
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
      <nav className="nav">
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

const Login = () =>
  <>
    <Header />
    <main className="main-login">
      <section>
        <form className="form-login">
          <div className="row">
            <label>
              Email
              <input type="email" defaultValue="oi@joaquim.com" />
            </label>
          </div>
          <div className="row">
            <label>
              Senha
              <input type="password" defaultValue="abc123" />
            </label>
          </div>
          <button>Login</button>
        </form>
      </section>
    </main>
  </>

const citiesLoader = async () => {
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
    click: e => navigate(`cidades/${id}/form?latitude=${e.latlng.lat}&longitude=${e.latlng.lng}`)
  })
}

const curitibaPosition = { latitude: '-25.437370980404776', longitude: '-49.27058902123733' }

const AppLayout = () => {
  const cities = useLoaderData()
  const [searchParams] = useSearchParams()
  const latitude = searchParams.get('latitude')
  const longitude = searchParams.get('longitude')
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
    </main>
  )
}

const Cities = () => {
  const cities = useOutletContext()
  return cities.length === 0
    ? <p className="initial-message">Clique no mapa para adicionar uma cidade</p>
    : (
      <ul className="cities">
        {cities.map(({ id, position, name }) =>
          <li key={id}>
            <Link to={`${id}?latitude=${position.latitude}&longitude=${position.longitude}`}>
              <h3>{name}</h3>
              <button>&times;</button>
            </Link>
          </li>
        )}
      </ul>
    )
}

const Countries = () => {
  const cities = useOutletContext()
  const groupedByCountry = Object.groupBy(cities, ({ country }) => country)
  const countries = Object.keys(groupedByCountry)
  return (
    <ul className="countries">
      {countries.map(country => <li key={country}>{country}</li>)}
    </ul>
  )
}

const TripDetails = () => {
  const params = useParams()
  const navigate = useNavigate()
  const cities = useOutletContext()
  const city = cities.find(city => params.id === String(city.id))
  const handleClickBack = () => navigate('/app/cidades')
  return (
    <div className="city-details">
      <div className="row">
        <h5>Nome da cidade</h5>
        <h3>{city.name}</h3>
      </div>
      <div className="row">
        <h5>Suas anotações</h5>
        <p>{city.notes}</p>
      </div>
      <button className="btn-back" onClick={handleClickBack}>&larr; Voltar</button>
    </div>
  )
}

const cityLoader = async ({ request, params }) => {
  const url = new URL(request.url)
  const latitude = url.searchParams.get('latitude')
  const longitude = url.searchParams.get('longitude')
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt-BR`)
  const info = await response.json()
  return { name: info.city, id: params.id }
}

const formAction = async ({ request, params }) => {
  const url = new URL(request.url)
  const [latitude, longitude] = ['latitude', 'longitude'].map(item => url.searchParams.get(item))
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt-BR`)
  const info = await response.json()
  const formData = await request.formData()
  const city = { ...Object.fromEntries(formData), position: { latitude, longitude }, id: params.id, country: info.countryName }
  const cities = await localforage.getItem('cities')
  await localforage.setItem('cities', cities ? [...cities, city] : [city])
  return redirect(`/app/cidades/${params.id}`)
}

const FormAddCity = () => {
  const city = useLoaderData()
  const navigate = useNavigate()
  const handleClickBack = () => navigate('/app/cidades')
  return (
    <Form method="post" className="form-add-city">
      <label>
        <span>Nome da cidade</span>
        <input key={city.id} defaultValue={city.name} name="name" required />
      </label>
      <label>
        <span>Quando você foi para {city.name}?</span>
        <input name="date" required type="date" />
      </label>
      <label>
        <span>Suas anotações sobre a cidade</span>
        <textarea name="notes" required></textarea>
      </label>
      <div className="buttons">
        <button onClick={handleClickBack} type="button">&larr; Voltar</button>
        <button type="submit">Adicionar</button>
      </div>
    </Form>
  )
}

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="sobre" element={<About />} />
        <Route path="preco" element={<Pricing />} />
        <Route path="login" element={<Login />} />
        <Route path="app" element={<AppLayout />} loader={citiesLoader}>
          <Route index element={<Navigate to="cidades" replace />} />
          <Route path="cidades" element={<Cities />} />
          <Route path="cidades/:id" element={<TripDetails />} />
          <Route path="cidades/:id/form" element={<FormAddCity />} loader={cityLoader} action={formAction} />
          <Route path="paises" element={<Countries />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export { App }