import { useState } from 'react'
import styles from './Login.module.scss'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const submitForm = () => {
    console.log('submit', email, password)
  }

  return (
    <div className={styles.container}>
      <form>
        <input type='email' className={styles.input} onChange={handleEmailChange} value={email} />
        <input type='password' className={styles.input} onChange={handlePasswordChange} value={password} />
        <button className={styles.submitButton} onClick={submitForm}>
          Log in
        </button>
      </form>
    </div>
  )
}
