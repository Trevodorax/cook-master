import { useEffect, useState } from "react";

import { Button } from "@/components/button/Button";
import { TextInput } from "@/components/textInput/TextInput";
import {
  GenericError,
  useConfirmAdminMutation,
  useGetUserByIdQuery,
  usePatchUserMutation,
} from "@/store/services/cookMaster/api";

import styles from "./UserInfo.module.scss";

interface Props {
  userId: string;
}

export const UserInfo = ({ userId }: Props) => {
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserByIdQuery(userId);

  const [patchUser, { isLoading: isPatchLoading, error: patchError }] =
    usePatchUserMutation();

  const [confirmAdmin] = useConfirmAdminMutation();

  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [email, setEmail] = useState(userData?.email || "");

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setEmail(userData.email);
    }
  }, [userData]);

  const handleSave = () => {
    patchUser({
      id: userId,
      data: {
        firstName,
        lastName,
        email,
      },
    });
  };

  const handleConfirmAdmin = async () => {
    confirmAdmin({ id: userId });
  };

  if (isUserLoading) return <div>Loading...</div>;

  if (userError) {
    return (
      <div>
        Error: <pre>{JSON.stringify(userError, null, 4)}</pre>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isUserLoading && <div>Loading...</div>}
      {userError && (
        <div>
          Error: <pre>{JSON.stringify(userError, null, 4)}</pre>
        </div>
      )}
      {userData && (
        <div>
          <table>
            <tbody>
              <tr>
                <td>First name: </td>
                <td>
                  <TextInput
                    value={firstName || ""}
                    setValue={setFirstName}
                    type="text"
                    hideIcon
                    className={styles.textField}
                  />
                </td>
              </tr>
              <tr>
                <td>Last name: </td>
                <td>
                  <TextInput
                    value={lastName || ""}
                    setValue={setLastName}
                    type="text"
                    hideIcon
                    className={styles.textField}
                  />
                </td>
              </tr>
              <tr>
                <td>Email: </td>
                <td>
                  <TextInput
                    value={email || ""}
                    setValue={setEmail}
                    type="text"
                    hideIcon
                    className={styles.textField}
                  />
                </td>
              </tr>
              <tr className={styles.userType}>
                <td>User type: </td>
                <td>
                  {userData.admin?.isConfirmed && "Confirmed "}
                  {userData.userType}
                  {userData.admin && !userData.admin.isConfirmed && (
                    <>
                      <span className={styles.unconfirmedAdmin}>
                        (Not Confirmed)
                      </span>
                      <Button
                        className={styles.confirmAdminButton}
                        onClick={handleConfirmAdmin}
                        type="primary"
                      >
                        Confirm admin
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <Button onClick={handleSave} type="ok">
            {isPatchLoading ? "Loading..." : "Save modifications"}
          </Button>
          {patchError && (
            <div>
              <div>{(patchError as GenericError).data?.message || "Error"}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
