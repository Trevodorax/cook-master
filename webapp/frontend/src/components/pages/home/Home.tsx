import React from "react";
import styles from "./Home.module.scss";
import { useGetMeMutation } from "@/store/services/cookMaster/api";

export default function Home() {
  const [getMe, { data, isLoading }] = useGetMeMutation();

  const fetchUserInfo = () => {
    getMe();
  };

  return (
    <div className={styles.container}>
      <h2>Home</h2>
      <button onClick={fetchUserInfo}>Get user info</button>
      <div>
        {isLoading && "Loading..."}
        {data && <pre>{JSON.stringify(data, null, 4)}</pre>}
      </div>
    </div>
  );
}
