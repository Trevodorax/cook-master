import Navigation from '@/components/navigation/Navigation'
import { MainLogo } from '../svgs/MainLogo'

import styles from './Header.module.scss'

export default function Header () {
  return (
    <header className={styles.container}>
      <div className={styles.mainLogo}>
        <MainLogo />
      </div>
      <h1>Cook Master</h1>
      <Navigation />
    </header>
  )
}
