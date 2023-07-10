import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import cx from "classnames";
import { useSelector } from "react-redux";

import {
  useCreateAccountMutation,
  useGetMeMutation,
  useLoginMutation,
} from "@/store/services/cookMaster/api";
import { setToken, setUserInfo } from "@/store/user/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { SwitchInput } from "@/components/switchInput/SwitchInput";
import { Button } from "@/components/button/Button";
import { TextInput } from "@/components/textInput/TextInput";
import { getNewAccountInformationsErrors } from "./utils/checkCredentials";
import { UserIcon } from "@/components/svgs";
import { SelectInput } from "@/components/selectInput/SelectInput";
import { Loader } from "@/components/loader/Loader";
import {
  CreateAccountRequest,
  GenericError,
  LoginRequest,
  userType,
} from "@/store/services/cookMaster/types";

import styles from "./Login.module.scss";
import { useTranslation } from "react-i18next";

const userTypes: Array<userType> = ["client", "contractor", "admin"];

export default function Login() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token);
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user.userInfo);
  const [alreadyHasAccount, setAlreadyHasAccount] = useState<boolean>(true);
  const [login, { error: loginError }] = useLoginMutation();
  const [createAccount, { error: createAccountError }] =
    useCreateAccountMutation();
  const [getMe] = useGetMeMutation();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordConfirmationInput, setPasswordConfirmationInput] =
    useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [userTypeInput, setUserTypeInput] = useState<userType>(userTypes[0]);
  const [isLoading, setIsLoading] = useState(false);

  const [formSuccessMessage, setFormSuccessMessage] = useState("");

  useEffect(() => {
    async function fn() {
      if (token) {
        if (!user) {
          const userInfo = await getMe();

          if ("data" in userInfo) {
            dispatch(setUserInfo(userInfo.data));
          }
        }
        console.log("redirect to dashboard", token);
        router.push("dashboard");
      }
    }

    fn();
  });

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    let user;
    if (alreadyHasAccount) {
      // login
      const credentials: LoginRequest = {
        email: emailInput,
        password: passwordInput,
      };

      setIsLoading(true);
      try {
        user = await login(credentials).unwrap();
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } catch (err) {
        return;
      } finally {
        setIsLoading(false);
      }
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
      setIsLoading(true);
      try {
        user = await createAccount(credentials).unwrap();
        setAlreadyHasAccount(true);
        setFormSuccessMessage("Account created successfully");
      } catch (err) {
        return;
      } finally {
        setIsLoading(false);
      }
    }
    dispatch(setToken(user.access_token));
    localStorage.setItem("token", user.access_token);

    const userInfo = await getMe();

    if ("data" in userInfo) {
      dispatch(setUserInfo(userInfo.data));
      i18n.changeLanguage(userInfo.data.locale);
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
            {userTypeInput === "admin" && (
              <p className={styles.adminWarning}>
                Your admin account won't be effective until another admin
                confirms it.
              </p>
            )}
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
          {isLoading ? (
            <Loader className={styles.buttonLoader} />
          ) : alreadyHasAccount ? (
            "Log in"
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
      <div className={styles.errorMessage}>{formErrorMessage}</div>
      <div className={styles.successMessage}>{formSuccessMessage}</div>
    </div>
  );
}
