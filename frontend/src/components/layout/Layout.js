import Header from '@/components/header/Header'
import styles from './Layout.module.scss'

export default function Layout ({ children }) {
  return (
    <div className={styles.container}>
      <Header />
      {children}
    </div>
  )
}
