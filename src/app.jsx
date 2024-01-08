import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  NavLink,
  Link
} from 'react-router-dom'

const Home = () =>
  <>
    <header>
      <nav className="nav">
        <Link to="/">
          <img className="logo" src="logo-viajou-anotou-light.png" alt="Logo ViajouAnotou" />
        </Link>
        <ul>
          <li><NavLink to="/">Início</NavLink></li>
        </ul>
      </nav>
    </header>
    <main className="main-home">
      <section>
        <h1>Você viaja o mundo.<br />E o ViajouAnotou mantém suas aventuras anotadas.</h1>
        <h2>Um mapa mundial que rastreia por onde você passou. Nunca esqueça suas experiências e mostre aos seus amigos o quê você fez pelo mundo.</h2>
        <Link to="/sobre" className="cta">Começar agora</Link>
      </section>
    </main>
  </>

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
    </Route>
  )
)

const App = () => <RouterProvider router={router} />

export { App }
