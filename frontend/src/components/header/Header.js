import Navigation from '@/components/navigation/Navigation'

import styles from './Header.module.scss'

function Header() {
  return (
    <header className={styles.container}>
      <h1>Cook Masters</h1>
      <Navigation />
    </header>
  )
}

export default Header;