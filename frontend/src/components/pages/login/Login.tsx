import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {
  GenericError,
  LoginRequest,
  useLoginMutation,
} from "@/store/services/cookMaster/api";
import { setToken } from "@/store/user/userSlice";
import { AppDispatch, RootState } from "@/store/store";

import styles from "./Login.module.scss";
import { SwitchInput } from "@/components/switchInput/SwitchInput";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const [alreadyHasAccount, setAlreadyHasAccount] = useState<boolean>(true);
  const [login, { error }] = useLoginMutation();

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

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    const credentials: LoginRequest = {
      email: emailInput,
      password: passwordInput,
    };
    const user = await login(credentials).unwrap();
    dispatch(setToken(user.access_token));
  };

  if (error) {
    console.log("ERROR: ", error);
  }

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorMessage}>
          {(error as GenericError).data.message}
        </div>
      )}
      <form onSubmit={submitForm} className={styles.form}>
        <SwitchInput
          isChecked={alreadyHasAccount}
          setIsChecked={setAlreadyHasAccount}
        />
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
        <button type="submit" className={styles.submitButton}>
          Log in
        </button>
      </form>
    </div>
  );
}
