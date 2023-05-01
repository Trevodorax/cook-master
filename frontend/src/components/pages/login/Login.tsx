import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { cookMasterAPI } from "@/axios/axiosConfig";
import { setEmail } from "@/store/user/userSlice";
import { AppDispatch, RootState } from "@/store/store";

import styles from "./Login.module.scss";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const userEmail = useSelector((state: RootState) => state.user.email);
  const [fetchedData, setFetchedData] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    cookMasterAPI.get("bookmarks/test").then((response) => {
      setFetchedData(response.data.message);
    });
  }, []);

  useEffect(() => {
    console.log("user email in store", userEmail);
    console.log("user email in useState", emailInput);
  }, [userEmail, emailInput]);

  const handleEmailInputChange = (e: ChangeEvent) => {
    setEmailInput((e.target as HTMLInputElement).value);
  };

  const handlePasswordInputChange = (e: ChangeEvent) => {
    setPasswordInput((e.target as HTMLInputElement).value);
  };

  const submitForm = () => {
    console.log("submit", emailInput, passwordInput);
    dispatch(setEmail(emailInput));
  };

  return (
    <div className={styles.container}>
      <input
        type="email"
        className={styles.input}
        onChange={handleEmailInputChange}
        value={emailInput}
      />
      <input
        type="password"
        className={styles.input}
        onChange={handlePasswordInputChange}
        value={passwordInput}
      />
      <button className={styles.submitButton} onClick={submitForm}>
        Log in
      </button>
      <div>{fetchedData || "Loading..."}</div>
    </div>
  );
}
