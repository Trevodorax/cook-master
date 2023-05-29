import { CookMasterEvent } from "@/store/services/cookMaster/types";
import styles from "./EventCard.module.scss";

interface Props {
  event: CookMasterEvent;
  style: {
    height: number;
  };
}

export const EventCard = ({ event, style }: Props) => {
  return (
    <div className={styles.container} style={style}>
      <div className={styles.title}>{event.name}</div>
    </div>
  );
};
