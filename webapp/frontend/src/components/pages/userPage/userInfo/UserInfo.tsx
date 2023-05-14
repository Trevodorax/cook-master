import { SelectInput } from "@/components/selectInput/SelectInput";
import { TextInput } from "@/components/textInput/TextInput";
import { useGetUserByIdQuery } from "@/store/services/cookMaster/api";
import { useState } from "react";

interface Props {
  userId: string;
}

export const UserInfo = ({ userId }: Props) => {
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserByIdQuery(userId);

  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [userType, setUserType] = useState(userData?.userType || "");

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
              <td>
                <SelectInput
                  options={["client", "contractor", "admin"]}
                  value={userType}
                  setValue={setUserType}
                />
              </td>
            </tr>
          </table>
        </div>
      )}
    </div>
  );
};
