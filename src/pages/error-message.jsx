import { useRouteError } from 'react-router-dom'
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

export { ErrorMessage }
