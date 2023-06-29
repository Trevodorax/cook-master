import { FC, useEffect } from "react";
import { useRouter } from "next/router";

import { SubscriptionLevelIcon } from "@/components/svgs";
import { EditableField } from "@/components/editableField/EditableField";
import {
  useGetMeMutation,
  usePatchMeMutation,
} from "@/store/services/cookMaster/api";

import styles from "./Settings.module.scss";

export const Settings: FC = () => {
  const router = useRouter();
  const [patchMe] = usePatchMeMutation();
  const [getMe, { data: userData }] = useGetMeMutation();

  // the deadline is near, this really is a disgusting pattern, but I have no time to find better
  const patch = (value: any) => {
    patchMe(value);
    getMe();
  };

  useEffect(() => {
    getMe();
  }, []);

  const subscriptionLevelString =
    userData?.client?.subscriptionLevel === 0
      ? "free"
      : userData?.client?.subscriptionLevel === 1
      ? "standard"
      : "expert";

  return (
    <div className={styles.container}>
      {userData?.userType === "client" && (
        <div
          title={subscriptionLevelString + " plan"}
          onClick={() => router.push("subscription/booking")}
          className={styles.subscriptionLevel}
        >
          <SubscriptionLevelIcon
            subscriptionLevel={userData.client?.subscriptionLevel || 0}
          />
        </div>
      )}
      <EditableField
        type="image"
        initialValue={userData?.profilePicture}
        mutateValue={(value) => {
          patch({ data: { profilePicture: value } });
        }}
        isEditable={true}
      />
      <EditableField
        type="text"
        initialValue={<p>{userData?.firstName}</p>}
        mutateValue={(value) => {
          patch({ data: { firstName: value } });
        }}
        isEditable={true}
      />
      <EditableField
        type="text"
        initialValue={<p>{userData?.lastName}</p>}
        mutateValue={(value) => {
          patch({ data: { lastName: value } });
        }}
        isEditable={true}
      />
      <p>
        {userData?.userType === "contractor"
          ? "👨‍🍳"
          : userData?.userType === "client"
          ? "👨‍🎓"
          : "👁️"}
      </p>
    </div>
  );
};
