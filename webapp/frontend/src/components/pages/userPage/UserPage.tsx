import { useRouter } from "next/router";

import { useDeleteUserMutation } from "@/store/services/cookMaster/api";
import { UserInfo } from "./userInfo/UserInfo";
import { Button } from "@/components/button/Button";

import styles from "./UserPage.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  userId: string;
}

export const UserPage = ({ userId }: Props) => {
  const { t } = useTranslation();
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
        {t("deleteUser")}
      </Button>
    </div>
  );
};
