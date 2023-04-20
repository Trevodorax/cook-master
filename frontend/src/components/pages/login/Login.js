import styles from './Login.module.scss'

export default function Login () {
  const callAPI = async () => {
    try {
      const res = await fetch(`http://localhost:8081/users`);
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <button onClick={callAPI}>Make API call</button>
    </div>
  )
}
