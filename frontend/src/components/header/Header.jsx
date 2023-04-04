import { Navigation } from '@/components/navigation/Navigation'

import styles from './Header.module.scss'

export const Header = () => {
  return (
    <header className={styles.container}>
      <h1>Cook Masters</h1>
      <Navigation />
    </header>
  )
}
