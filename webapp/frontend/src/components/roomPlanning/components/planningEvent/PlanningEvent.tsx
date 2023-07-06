import { FieldProps, ProcessedEvent } from "@aldabil/react-scheduler/types";
import { useRouter } from "next/router";

import { Button } from "@/components/button/Button";

import styles from "./PlanningEvent.module.scss";

export const PlanningEvent = (fields: FieldProps[], event: ProcessedEvent) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Button
        type="primary"
        onClick={() => router.push(`/events/${event.event_id}`)}
      >
        See event
      </Button>
      <div>
        <h3>Description</h3>
        <p>Description: {event.description || "No description"}</p>
      </div>
    </div>
  );
};
