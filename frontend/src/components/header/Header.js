import { useState } from 'react'
import cx from 'classnames'

import Navigation from '@/components/navigation/Navigation'
import { MainLogo } from '../svgs/MainLogo'

import styles from './Header.module.scss'
import { BurgerIcon } from '../svgs/BurgerIcon'

export default function Header () {
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false)

  const toggleBurgerMenu = () => {
    setIsBurgerMenuOpen((isOpen) => !isOpen)
  }

  return (
    <header className={styles.container}>
      <div className={styles.mainLogo}>
        <MainLogo />
      </div>
      <h1 className={styles.title}>Cook Master</h1>
      <div
        className={cx(styles.burgerIcon, {
          [styles.open]: isBurgerMenuOpen
        })}
        onClick={toggleBurgerMenu}
      >
        <BurgerIcon />
      </div>
      <Navigation
        containerClassname={cx(styles.navigationContainer, {
          [styles.open]: isBurgerMenuOpen
        })}
        itemsClassname={styles.navigationItem}
      />
    </header>
  )
}
