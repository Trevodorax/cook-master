import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { RootState } from "@/store/store";
import {
  BookIcon,
  HouseIcon,
  KeyIcon,
  MessageIcon,
  SettingsIcon,
  UserIcon,
} from "@/components/svgs";
import { CookmasterMascot } from "@/components/cookmasterMascot/CookmasterMascot";

import styles from "./Dashboard.module.scss";
import { useTranslation } from "react-i18next";

export const Dashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    if (user === null || user.userType === "any") {
      router.push("/login");
    }
  });

  type dashboardAction = {
    title: string;
    icon: () => JSX.Element;
    link: string;
  };

  const contractorActions: dashboardAction[] = [
    {
      title: t("profile"),
      icon: SettingsIcon,
      link: "/profile",
    },
    {
      title: t("conversations"),
      icon: MessageIcon,
      link: "/chat",
    },
    {
      title: t("courses"),
      icon: BookIcon,
      link: "/courses/my",
    },
  ];

  const adminActions: dashboardAction[] = [
    {
      title: t("profile"),
      icon: SettingsIcon,
      link: "/profile",
    },
    {
      title: t("conversations"),
      icon: MessageIcon,
      link: "/chat",
    },
    {
      title: t("users"),
      icon: UserIcon,
      link: "/users",
    },
    {
      title: t("premises"),
      icon: HouseIcon,
      link: "/premises/browse",
    },
  ];

  const clientActions: dashboardAction[] = [
    {
      title: t("profile"),
      icon: SettingsIcon,
      link: "/profile",
    },
    {
      title: t("conversations"),
      icon: MessageIcon,
      link: "/chat",
    },
    {
      title: t("subscriptions"),
      icon: KeyIcon,
      link: "/subscription/booking",
    },
    {
      title: t("courses"),
      icon: BookIcon,
      link: "/courses/browse",
    },
  ];

  const actions = {
    contractor: contractorActions,
    admin: adminActions,
    client: clientActions,
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.bigTitle}>
        {t("welcome")}, {user?.firstName} {user?.lastName}
      </h1>
      <div>
        <CookmasterMascot
          subscriptionLevel={user?.client?.subscriptionLevel || 0}
          className={styles.mascot}
        />
        <h2 className={styles.mediumTitle}>{t("howCanWeHelpYou")}</h2>
        {user && (
          <div className={styles.actionsContainer}>
            {actions[user.userType as "client" | "contractor" | "admin"].map(
              (action, index) => (
                <Link
                  key={index}
                  href={action.link}
                  className={styles.actionCard}
                >
                  <action.icon />
                  <p className={styles.actionCardTitle}>{action.title}</p>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
