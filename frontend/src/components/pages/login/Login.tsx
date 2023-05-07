import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {
  LoginRequest,
  useGetTestQuery,
  useLoginMutation,
} from "@/store/services/cookMaster/api";
import { setToken } from "@/store/user/userSlice";
import { AppDispatch, RootState } from "@/store/store";

import styles from "./Login.module.scss";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const { data: fetchedData, isLoading: isTestLoading } = useGetTestQuery();
  const [login] = useLoginMutation();

  const userEmail = useSelector((state: RootState) => state.user.email);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

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

  const submitForm = async () => {
    console.log("submit", emailInput, passwordInput);
    const credentials: LoginRequest = {
      email: emailInput,
      password: passwordInput,
    };

    try {
      const user = await login(credentials).unwrap();
      dispatch(setToken(user.access_token));
    } catch (err) {
      console.log("Login error", err);
    }
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
      <div>
        {fetchedData
          ? fetchedData.message
          : isTestLoading
          ? "Loading..."
          : "Couldn't fetch test string"}
      </div>
    </div>
  );
}
