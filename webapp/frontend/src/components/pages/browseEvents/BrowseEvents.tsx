import { ChangeEvent, useState } from "react";

import { useGetAllEventsQuery } from "@/store/services/cookMaster/api";
import { TextInput } from "@/components/textInput/TextInput";

import styles from "./BrowseEvents.module.scss";
import Link from "next/link";
import { EventCard } from "@/components/eventCard/EventCard";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/router";

export const BrowseEvents = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({ day: "", term: "" });

  const { data: events } = useGetAllEventsQuery({ filters: filters });

  const handleDayChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, day: e.target.value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <TextInput
          type="text"
          value={filters.term}
          setValue={(value) => {
            setFilters((prev) => ({ ...prev, term: value }));
          }}
          label="Search"
          hideIcon
        />
        <div className={styles.dateInput}>
          <label>Event date</label>
          <input
            className={styles.input}
            type="date"
            value={filters.day}
            onChange={handleDayChange}
          />
        </div>
        <Button
          type="secondary"
          className={styles.myEventsButton}
          onClick={() => router.push("/events/my")}
        >
          See my events
        </Button>
      </div>
      <hr className={styles.separator} />
      <div className={styles.events}>
        {events &&
          events.map((event, index) => (
            <EventCard className={styles.eventCard} key={index} event={event} />
          ))}
      </div>
    </div>
  );
};
