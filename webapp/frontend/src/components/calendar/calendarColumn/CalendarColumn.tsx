import { useGetAllEventsQuery } from "@/store/services/cookMaster/api";

import { EventCard } from "./eventCard/EventCard";
import styles from "./CalendarColumn.module.scss";

interface Props {
  date: Date;
}

const heightPerMinute = 2;
const startTime = 8;
const endTime = 20;

export const CalendarColumn = ({ date }: Props) => {
  const { data: events } = useGetAllEventsQuery({
    filters: { day: date.toISOString() },
  });

  const columnHeight: number = (endTime - startTime) * 60 * heightPerMinute;

  return (
    <div className={styles.container} style={{ height: columnHeight }}>
      {events &&
        events.map((event) => {
          const eventCardStyle = {
            height: event.durationMin * heightPerMinute,
          };
          return (
            <EventCard key={event.id} event={event} style={eventCardStyle} />
          );
        })}
    </div>
  );
};
