import { useState } from 'react'
import { useQuery } from 'react-query'

import { cookMasterAPI } from '@/axios/axiosConfig'

import styles from './Login.module.scss'

export default function Login () {
  const { data: fetchedData, error, isError, isLoading } = useQuery('cookMaster', () => cookMasterAPI.get(''))

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

  if (isError) return <div>Error: {error.message}</div>

  return (
    <div className={styles.container}>
      <input type='email' className={styles.input} onChange={handleEmailChange} value={email} />
      <input type='password' className={styles.input} onChange={handlePasswordChange} value={password} />
      <button className={styles.submitButton} onClick={submitForm}>
        Log in
      </button>
      <div>
        {isLoading && 'Loading...'}
        {isError && `Error: ${error.message}`}
        {fetchedData && fetchedData.data.quote}
      </div>
    </div>
  )
}
