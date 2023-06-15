import { EventCard } from "@/components/eventCard/EventCard";
import { useGetMyEventsQuery } from "@/store/services/cookMaster/api";

import styles from "./Events.module.scss";
import Link from "next/link";

export const Events = () => {
  const { data } = useGetMyEventsQuery();
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
