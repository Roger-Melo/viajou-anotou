import { redirect } from 'react-router-dom'
import { fakeAuthProvider } from '@/resources/services/auth/fake-auth-provider'

const logoutAction = async () => {
  await fakeAuthProvider.signOut()
  return redirect('/')
}

export { logoutAction }
