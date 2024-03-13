import { Link } from 'react-router-dom'
import { Header } from '@/ui/header'

const Component = () =>
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

Component.displayName = 'Home'

export { Component }
