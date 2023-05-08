import React, { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import cx from "classnames";

import {
  CreateAccountRequest,
  GenericError,
  LoginRequest,
  useCreateAccountMutation,
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
  const router = useRouter();

  const [alreadyHasAccount, setAlreadyHasAccount] = useState<boolean>(true);
  const [login, { error: loginError }] = useLoginMutation();
  const [createAccount, { error: createAccountError }] =
    useCreateAccountMutation();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    let user;
    if (alreadyHasAccount) {
      const credentials: LoginRequest = {
        email: emailInput,
        password: passwordInput,
      };
      user = await login(credentials).unwrap();
      router.back();
    } else {
      const credentials: CreateAccountRequest = {
        email: emailInput,
        password: passwordInput,
      };
      user = await createAccount(credentials).unwrap();
      setAlreadyHasAccount(true);
    }
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
      <div className={styles.errorMessage}>
        {loginError &&
          alreadyHasAccount &&
          (loginError as GenericError).data.message}
        {createAccountError &&
          !alreadyHasAccount &&
          (createAccountError as GenericError).data.message}
      </div>
    </div>
  );
}
