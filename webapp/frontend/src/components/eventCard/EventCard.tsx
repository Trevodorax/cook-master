import Link from "next/link";

import { CookMasterEvent } from "@/store/services/cookMaster/types";

import styles from "./EventCard.module.scss";

interface Props {
  event: CookMasterEvent;
}

export const EventCard = ({ event }: Props) => {
  return (
    <Link className={styles.link} href={`/events/${event.id}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{event.name}</div>
          <div className={styles.type}>{event.type}</div>
          <div className={styles.animator}>
            {event.animator?.user?.firstName}
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.description}>{event.description}</div>
        </div>
      </div>
    </Link>
  );
};
