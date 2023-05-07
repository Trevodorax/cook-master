import React, { useState } from "react";
import styles from "./Home.module.scss";
import {
  useGetUserInfoMutation,
  UserInfo,
} from "@/store/services/cookMaster/api";

export default function Home() {
  const [getUserInfo, { data, error, isLoading }] = useGetUserInfoMutation();

  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
    } catch (err) {
      console.log("Get user info error: ", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Home</h2>
      <button onClick={fetchUserInfo}>Get user info</button>
      <div>
        {error && `Error: ${JSON.stringify(error)}`}
        {isLoading && "Loading..."}
        {data &&
          Object.entries(data).map((info, index) => (
            <div key={index}>{info}</div>
          ))}
      </div>
    </div>
  );
}
