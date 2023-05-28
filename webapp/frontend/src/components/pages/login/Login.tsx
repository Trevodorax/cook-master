import React, { FormEvent, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import cx from "classnames";

import {
  CreateAccountRequest,
  GenericError,
  LoginRequest,
  useCreateAccountMutation,
  useGetUserInfoMutation,
  useLoginMutation,
  userType,
} from "@/store/services/cookMaster/api";
import { setToken, setUserInfo } from "@/store/user/userSlice";
import { AppDispatch } from "@/store/store";
import { SwitchInput } from "@/components/switchInput/SwitchInput";
import { Button } from "@/components/button/Button";
import { TextInput } from "@/components/textInput/TextInput";
import { getNewAccountInformationsErrors } from "./utils/checkCredentials";
import { UserIcon } from "@/components/svgs";
import { SelectInput } from "@/components/selectInput/SelectInput";

import styles from "./Login.module.scss";

const userTypes: Array<userType> = ["contractor", "client", "admin"];

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [alreadyHasAccount, setAlreadyHasAccount] = useState<boolean>(true);
  const [login, { error: loginError }] = useLoginMutation();
  const [createAccount, { error: createAccountError }] =
    useCreateAccountMutation();
  const [getUserInfo] = useGetUserInfoMutation();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordConfirmationInput, setPasswordConfirmationInput] =
    useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [userTypeInput, setUserTypeInput] = useState<userType>(userTypes[0]);

  const [formSuccessMessage, setFormSuccessMessage] = useState("");

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    let user;
    if (alreadyHasAccount) {
      // login
      const credentials: LoginRequest = {
        email: emailInput,
        password: passwordInput,
      };
      user = await login(credentials).unwrap();
      router.push("/");
    } else {
      // create an account
      if (inputValuesError !== "") {
        return;
      }

      const credentials: CreateAccountRequest = {
        email: emailInput,
        password: passwordInput,
        firstName: firstNameInput,
        lastName: lastNameInput,
        userType: userTypeInput,
      };
      user = await createAccount(credentials).unwrap();
      setAlreadyHasAccount(true);
      setFormSuccessMessage("Account created successfully");
    }
    dispatch(setToken(user.access_token));
    localStorage.setItem("token", user.access_token);

    const userInfo = await getUserInfo();

    if ("data" in userInfo) {
      dispatch(setUserInfo(userInfo.data));
    }
  };

  const inputValuesError = useMemo(() => {
    return getNewAccountInformationsErrors(
      emailInput,
      passwordInput,
      passwordConfirmationInput,
      firstNameInput,
      lastNameInput
    );
  }, [
    emailInput,
    passwordInput,
    passwordConfirmationInput,
    firstNameInput,
    lastNameInput,
  ]);

  const formErrorMessage = useMemo(() => {
    if (inputValuesError !== "" && !alreadyHasAccount) {
      return inputValuesError;
    }

    if (loginError) {
      return (loginError as GenericError).data?.message;
    }

    if (createAccountError) {
      return (createAccountError as GenericError).data?.message;
    }
    return "";
  }, [inputValuesError, loginError, createAccountError, alreadyHasAccount]);

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
        {!alreadyHasAccount && (
          <div className={styles.userType}>
            <p className={styles.userTypeText}>I am a </p>
            <SelectInput
              options={userTypes}
              value={userTypeInput}
              setValue={
                setUserTypeInput as React.Dispatch<React.SetStateAction<string>>
              }
              className={styles.selectInput}
            />
          </div>
        )}
        <TextInput
          type="email"
          value={emailInput}
          setValue={setEmailInput}
          placeholder="Email"
          className={styles.textInput}
        />
        <TextInput
          type="password"
          value={passwordInput}
          setValue={setPasswordInput}
          placeholder="Password"
          className={styles.textInput}
        />
        {!alreadyHasAccount && (
          <>
            <TextInput
              type="password"
              value={passwordConfirmationInput}
              setValue={setPasswordConfirmationInput}
              placeholder="Confirm password"
              className={styles.textInput}
            />
            <TextInput
              type="text"
              value={firstNameInput}
              setValue={setFirstNameInput}
              placeholder="First name"
              icon={<UserIcon />}
              className={styles.textInput}
            />
            <TextInput
              type="text"
              value={lastNameInput}
              setValue={setLastNameInput}
              placeholder="Last name"
              icon={<UserIcon />}
              className={styles.textInput}
            />
          </>
        )}
        <Button type="secondary" isFormSubmit className={styles.submitButton}>
          {alreadyHasAccount ? "Log in" : "Sign in"}
        </Button>
      </form>
      <div className={styles.errorMessage}>{formErrorMessage}</div>
      <div className={styles.successMessage}>{formSuccessMessage}</div>
    </div>
  );
}
