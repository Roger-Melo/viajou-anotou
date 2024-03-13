import { useActionData, Form } from 'react-router-dom'
import { Header } from '@/ui/header'

const Component = () => {
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

Component.displayName = 'Login'

export { Component }
