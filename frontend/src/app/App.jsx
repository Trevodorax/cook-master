import { useRoutes } from 'react-router-dom'

import { routes } from '@/router/routes'

import styles from './App.module.scss'

export const App = () => {
  const routesElement = useRoutes(routes)

  return (
    <div className={styles.container}>
      {routesElement}
    </div>
  )
}
