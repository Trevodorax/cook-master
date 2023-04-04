import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/home/Home'
import { Login } from '@/pages/login/Login'
import { NoMatch } from '@/pages/noMatch/NoMatch'

export const routes = [{
  path: '/',
  element: <Layout />,
  children: [
    {
      index: true,
      element: <Home />,
      displayedName: 'Home'
    },
    {
      path: '/login',
      element: <Login />,
      displayedName: 'Login'
    },
    {
      path: '*',
      element: <NoMatch />
    }
  ]
}]
