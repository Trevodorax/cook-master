import { useRouter } from "next/router";

import { useDeleteUserMutation } from "@/store/services/cookMaster/api";
import { UserInfo } from "./userInfo/UserInfo";

interface Props {
  userId: string;
}

export const UserPage = ({ userId }: Props) => {
  const router = useRouter();

  const [deleteUser] = useDeleteUserMutation();

  return (
    <div>
      <UserInfo userId={userId} />
      <button
        onClick={() => {
          deleteUser(userId);
          router.push("/dashboard");
        }}
      >
        Delete user
      </button>
    </div>
  );
};
