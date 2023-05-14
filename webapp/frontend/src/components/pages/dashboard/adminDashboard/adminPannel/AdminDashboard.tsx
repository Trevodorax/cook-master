import { useGetAllUsersQuery } from "@/store/services/cookMaster/api";

import styles from "./AdminDashboard.module.scss";
import Link from "next/link";
import { Button } from "@/components/button/Button";

export const AdminDashboard = () => {
  const { data, error, isLoading } = useGetAllUsersQuery();

  return (
    <div className={styles.container}>
      {error && `Error: ${JSON.stringify(error)}`}
      {isLoading && "Loading..."}
      {data && (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <Link href={`/user/${user.id}`} className={styles.aze}>
                    See this user
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
