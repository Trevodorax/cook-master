import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { RootState } from "@/store/store";
import {
  BookIcon,
  CalendarIcon,
  KeyIcon,
  MessageIcon,
  UserIcon,
} from "@/components/svgs";

import styles from "./Dashboard.module.scss";
import { userType } from "@/store/services/cookMaster/types";
import { ReactNode } from "react";

export const Dashboard = () => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user.userInfo);

  if (user === null || user.userType === "any") {
    router.push("/login");
    return <div>Not connected</div>;
  }

  type dashboardAction = {
    title: string;
    icon: () => JSX.Element;
    link: string;
  };

  const contractorActions: dashboardAction[] = [
    {
      title: "Events",
      icon: CalendarIcon,
      link: "/events/my",
    },
    {
      title: "My profile",
      icon: UserIcon,
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
      link: "/course",
    },
  ];

  const adminActions: dashboardAction[] = [
    {
      title: "Users",
      icon: UserIcon,
      link: "/users",
    },
  ];

  const clientActions: dashboardAction[] = [
    {
      title: "Events",
      icon: CalendarIcon,
      link: "/events/browse",
    },
    {
      title: "Subscriptions",
      icon: KeyIcon,
      link: "/subscription/booking",
    },
  ];

  const actions: Record<userType, dashboardAction[]> = {
    contractor: contractorActions,
    admin: adminActions,
    client: clientActions,
  };

  return (
    <div className={styles.container}>
      <h2>
        Welcome, {user.firstName} {user.lastName}
      </h2>
      <div className={styles.actionsContainer}>
        {actions[user.userType].map((action, index) => (
          <Link key={index} href={action.link} className={styles.actionCard}>
            <action.icon />
            <p className={styles.actionCardTitle}>{action.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
