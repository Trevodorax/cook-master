import Navigation from '@/components/navigation/Navigation'

import styles from './Header.module.scss'

export default function Header () {
  return (
    <header className={styles.container}>
      <h1>Cook Masters</h1>
      <Navigation />
    </header>
  )
}
