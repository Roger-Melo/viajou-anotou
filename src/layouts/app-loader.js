import localforage from 'localforage'
import { redirect } from 'react-router-dom'
import { fakeAuthProvider } from '@/resources/services/auth/fake-auth-provider'

const appLoader = async () => {
  if (!fakeAuthProvider.isAuthenticated) {
    return redirect('/login')
  }

  const cities = await localforage.getItem('cities')
  return cities ?? []
}

export { appLoader }
