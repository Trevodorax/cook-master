import { FieldProps, ProcessedEvent } from "@aldabil/react-scheduler/types";
import { useRouter } from "next/router";

import { Button } from "@/components/button/Button";

import styles from "./PlanningEvent.module.scss";
import { useTranslation } from "react-i18next";

export const PlanningEvent = (fields: FieldProps[], event: ProcessedEvent) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Button
        type="primary"
        onClick={() => router.push(`/events/${event.event_id}`)}
      >
        {t("seeEvent")}
      </Button>
      <div>
        <h3>{t("description")}</h3>
        <p>
          {t("description")}: {event.description || t("noDescription")}
        </p>
      </div>
    </div>
  );
};
