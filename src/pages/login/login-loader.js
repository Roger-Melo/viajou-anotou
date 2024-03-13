import { redirect } from 'react-router-dom'
import { fakeAuthProvider } from '@/resources/services/auth/fake-auth-provider'

const loginLoader = async () => {
  if (!fakeAuthProvider.isAuthenticated) {
    return null
  }

  return redirect('/app')
}

export { loginLoader }
