import { useSelector } from "react-redux";
import Link from "next/link";

import { RootState } from "@/store/store";
import { EventCard } from "@/components/eventCard/EventCard";
import {
  useGetMyEventsClientQuery,
  useGetMyEventsContractorQuery,
} from "@/store/services/cookMaster/api";

import styles from "./MyEvents.module.scss";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const MyEvents = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const userType = useSelector(
    (state: RootState) => state.user.userInfo?.userType
  );

  useEffect(() => {
    if (!userType) {
      router.push("/login");
    }
  });

  const { data: contractorEvents } = useGetMyEventsContractorQuery(undefined, {
    skip: userType !== "contractor",
  });

  const { data: clientEvents } = useGetMyEventsClientQuery(undefined, {
    skip: userType !== "client",
  });

  const events = userType === "contractor" ? contractorEvents : clientEvents;

  return (
    <div className={styles.container}>
      <h1>{t("myEvents")}</h1>
      <div className={styles.events}>
        {userType === "contractor" && (
          <Link href="/events/new" className={styles.createButton}>
            +
          </Link>
        )}
        {events &&
          events.map((event, index) => <EventCard key={index} event={event} />)}
      </div>
    </div>
  );
};
