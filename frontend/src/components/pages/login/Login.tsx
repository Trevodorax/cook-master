import React, { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import cx from "classnames";

import {
  GenericError,
  LoginRequest,
  useLoginMutation,
} from "@/store/services/cookMaster/api";
import { setToken } from "@/store/user/userSlice";
import { AppDispatch } from "@/store/store";
import { SwitchInput } from "@/components/switchInput/SwitchInput";
import { Button } from "@/components/button/Button";
import { TextInput } from "@/components/textInput/TextInput";

import styles from "./Login.module.scss";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const [alreadyHasAccount, setAlreadyHasAccount] = useState<boolean>(true);
  const [login, { error }] = useLoginMutation();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    const credentials: LoginRequest = {
      email: emailInput,
      password: passwordInput,
    };
    const user = await login(credentials).unwrap();
    dispatch(setToken(user.access_token));
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitForm} className={styles.form}>
        <div className={styles.signinSignup}>
          <div
            className={cx(styles.text, {
              [styles.selected]: !alreadyHasAccount,
            })}
          >
            Sign in
          </div>
          <SwitchInput
            isChecked={alreadyHasAccount}
            setIsChecked={setAlreadyHasAccount}
          />
          <div
            className={cx(styles.text, {
              [styles.selected]: alreadyHasAccount,
            })}
          >
            Log in
          </div>
        </div>
        <TextInput
          type="email"
          value={emailInput}
          setValue={setEmailInput}
          placeholder="Email"
        />
        <TextInput
          type="password"
          value={passwordInput}
          setValue={setPasswordInput}
          placeholder="Password"
        />

        <Button type="secondary" isFormSubmit className={styles.submitButton}>
          {alreadyHasAccount ? "Log in" : "Sign in"}
        </Button>
      </form>
      {error && (
        <div className={styles.errorMessage}>
          {(error as GenericError).data.message}
        </div>
      )}
    </div>
  );
}
