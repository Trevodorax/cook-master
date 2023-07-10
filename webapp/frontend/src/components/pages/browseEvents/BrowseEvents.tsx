import { ChangeEvent, useState } from "react";

import { useGetAllEventsQuery } from "@/store/services/cookMaster/api";
import { TextInput } from "@/components/textInput/TextInput";

import styles from "./BrowseEvents.module.scss";
import { EventCard } from "@/components/eventCard/EventCard";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export const BrowseEvents = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [filters, setFilters] = useState({ day: "", term: "" });

  const { data: events } = useGetAllEventsQuery({ filters: filters });

  const handleDayChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, day: e.target.value }));
  };

  return (
    <div className={styles.container}>
      <h1>Browse events</h1>
      <div className={styles.filters}>
        <TextInput
          type="text"
          value={filters.term}
          setValue={(value) => {
            setFilters((prev) => ({ ...prev, term: value }));
          }}
          label={t("search")}
          hideIcon
        />
        <div className={styles.dateInput}>
          <label>{t("eventDate")}</label>
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
          {t("seeMyEvents")}
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
