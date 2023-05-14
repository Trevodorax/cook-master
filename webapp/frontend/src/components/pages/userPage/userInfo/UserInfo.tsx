import { TextInput } from "@/components/textInput/TextInput";
import {
  GenericError,
  useGetUserByIdQuery,
  usePatchUserMutation,
} from "@/store/services/cookMaster/api";
import { useEffect, useState } from "react";

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

  if (isUserLoading) return <div>Loading...</div>;

  if (userError) {
    return (
      <div>
        Error: <pre>{JSON.stringify(userError, null, 4)}</pre>
      </div>
    );
  }

  return (
    <div>
      {isUserLoading && <div>Loading...</div>}
      {userError && (
        <div>
          Error: <pre>{JSON.stringify(userError, null, 4)}</pre>
        </div>
      )}
      {userData && (
        <div>
          <table>
            <tr>
              <td>First name: </td>
              <td>
                <TextInput
                  value={firstName || ""}
                  setValue={setFirstName}
                  type="text"
                  hideIcon
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
                />
              </td>
            </tr>
            <tr>
              <td>User type: </td>
              <td>{userData.userType}</td>
            </tr>
          </table>
          <button onClick={handleSave}>
            {isPatchLoading ? "Loading..." : "Save modifications"}
          </button>
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
