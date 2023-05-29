import styles from "./Events.module.scss";
import { Calendar } from "@/components/calendar/Calendar";
import { useState } from "react";

export const Events = () => {
  const [nbDays, setNbDays] = useState(7);

  return (
    <div className={styles.container}>
      <Calendar startDate={new Date()} nbDays={nbDays} />
    </div>
  );
};
