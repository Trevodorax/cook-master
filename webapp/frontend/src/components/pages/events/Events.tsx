import Link from "next/link";

import { EventCard } from "@/components/eventCard/EventCard";
import { useGetAllEventsQuery } from "@/store/services/cookMaster/api";

import styles from "./Events.module.scss";

export const Events = () => {
  const { data } = useGetAllEventsQuery({ filters: {} });
  return (
    <div className={styles.container}>
      <Link href="/events/new" className={styles.createButton}>
        +
      </Link>
      {data &&
        data.map((event, index) => <EventCard key={index} event={event} />)}
    </div>
  );
};
