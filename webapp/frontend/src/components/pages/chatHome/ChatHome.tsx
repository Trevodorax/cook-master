import { useState } from "react";

import { TextInput } from "@/components/textInput/TextInput";
import { UserIcon } from "@/components/svgs";
import {
  useGetAllUsersQuery,
  useGetMyConversationsQuery,
} from "@/store/services/cookMaster/api";
import { UserCard } from "@/components/userCard/UserCard";

import styles from "./ChatHome.module.scss";
import { useTranslation } from "react-i18next";

export const ChatHome = () => {
  const { t } = useTranslation();
  const [userSearch, setUserSearch] = useState("");
  const { data: conversations } = useGetMyConversationsQuery();
  const { data: foundUsers } = useGetAllUsersQuery({
    search: userSearch,
    userType: null,
  });

  return (
    <div className={styles.container}>
      <h1>Chat</h1>
      <div className={styles.conversationsZone}>
        <h2>{t("myConversations")}</h2>
        <div className={styles.conversations}>
          {conversations?.map((user, index) => (
            <UserCard className={styles.userCard} key={index} user={user} />
          ))}
        </div>
      </div>
      <div className={styles.searchUserZone}>
        <h2>{t("startNewConversation")}</h2>
        <div className={styles.searchZone}>
          <TextInput
            type="text"
            value={userSearch}
            setValue={setUserSearch}
            icon={<UserIcon />}
            placeholder="Search user"
          />
        </div>
        <div className={styles.userResults}>
          {foundUsers?.map((user, index) => (
            <UserCard key={index} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};
