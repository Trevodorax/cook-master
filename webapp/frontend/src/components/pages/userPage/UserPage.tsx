import { useRouter } from "next/router";

import { useDeleteUserMutation } from "@/store/services/cookMaster/api";
import { UserInfo } from "./userInfo/UserInfo";
import { Button } from "@/components/button/Button";

import styles from "./UserPage.module.scss";

interface Props {
  userId: string;
}

export const UserPage = ({ userId }: Props) => {
  const router = useRouter();

  const [deleteUser] = useDeleteUserMutation();

  return (
    <div className={styles.container}>
      <UserInfo userId={userId} />
      <Button
        type="error"
        onClick={() => {
          deleteUser(userId);
          router.push("/dashboard");
        }}
        className={styles.button}
      >
        Delete user
      </Button>
    </div>
  );
};
