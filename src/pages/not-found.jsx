import { Link } from 'react-router-dom'
import { Header } from '@/ui/header'

const Component = () =>
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

Component.displayName = 'NotFound'

export { Component }
