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

export const Dashboard = () => {
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
      title: "Profile",
      icon: SettingsIcon,
      link: "/profile",
    },
    {
      title: "Conversations",
      icon: MessageIcon,
      link: "/chat",
    },
    {
      title: "Courses",
      icon: BookIcon,
      link: "/courses/my",
    },
  ];

  const adminActions: dashboardAction[] = [
    {
      title: "Profile",
      icon: SettingsIcon,
      link: "/profile",
    },
    {
      title: "Conversations",
      icon: MessageIcon,
      link: "/chat",
    },
    {
      title: "Users",
      icon: UserIcon,
      link: "/users",
    },
    {
      title: "Premises",
      icon: HouseIcon,
      link: "/premises/browse",
    },
  ];

  const clientActions: dashboardAction[] = [
    {
      title: "Profile",
      icon: SettingsIcon,
      link: "/profile",
    },
    {
      title: "Conversations",
      icon: MessageIcon,
      link: "/chat",
    },
    {
      title: "Subscriptions",
      icon: KeyIcon,
      link: "/subscription/booking",
    },
    {
      title: "Courses",
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
        Welcome, {user?.firstName} {user?.lastName}
      </h1>
      <div>
        <CookmasterMascot
          subscriptionLevel={user?.client?.subscriptionLevel || 0}
          className={styles.mascot}
        />
        <h2 className={styles.mediumTitle}>What can we help you with ?</h2>
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
