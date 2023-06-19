import { useState } from "react";
import Link from "next/link";

import { useGetAllUsersQuery } from "@/store/services/cookMaster/api";
import { userType } from "@/store/services/cookMaster/types";
import { TextInput } from "@/components/textInput/TextInput";
import { SelectInput } from "@/components/selectInput/SelectInput";

import styles from "./Users.module.scss";

const userTypes: Array<userType> = ["any", "contractor", "client", "admin"];

export const Users = () => {
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState<userType>(userTypes[0]);

  const { data, isLoading } = useGetAllUsersQuery({
    search,
    userType: userType === "any" ? null : userType,
  });

  const SearchZone = (
    <div className={styles.searchZone}>
      <TextInput
        type="text"
        value={search}
        setValue={setSearch}
        placeholder="Search user"
        hideIcon
        className={styles.searchInput}
      />
      <SelectInput
        options={userTypes}
        value={userType}
        setValue={setUserType as React.Dispatch<React.SetStateAction<string>>}
      />
    </div>
  );

  return (
    <div className={styles.container}>
      {SearchZone}
      {isLoading && "Loading..."}
      {data && (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
                <td>
                  <Link href={`/users/${user.id}`}>See this user</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
