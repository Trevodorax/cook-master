import styles from "./Calendar.module.scss";
import { CalendarColumn } from "./calendarColumn/CalendarColumn";

interface Props {
  startDate: Date;
  nbDays: number;
}

export const Calendar = ({ startDate, nbDays }: Props) => {
  // create an array of nbDays length from the startDate
  const dates = Array.from(
    { length: nbDays },
    (_, index) =>
      new Date(new Date(startDate).setDate(startDate.getDate() + index))
  );

  return (
    <div className={styles.container}>
      {dates.map((date, index) => (
        <CalendarColumn key={index} date={date} />
      ))}
    </div>
  );
};
