import { useNavigate, useLoaderData, useSearchParams, NavLink, Outlet, Form } from 'react-router-dom'
import { useMap, useMapEvents, MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Logo } from '@/ui/logo'

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

export { AppLayout }
