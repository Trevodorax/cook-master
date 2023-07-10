import { FC } from "react";
import { Scheduler } from "@aldabil/react-scheduler";

import styles from "./RoomPlanning.module.scss";
import { PlanningEvent } from "./components/planningEvent/PlanningEvent";
import { formatEventForScheduler } from "./components/utils/formatEventForScheduler";
import { useGetEventsFromRoomQuery } from "@/store/services/cookMaster/api";

interface Props {
  roomId: number;
  coloredEventId?: number;
}

export const RoomPlanning: FC<Props> = ({ roomId, coloredEventId = "" }) => {
  const { data: events } = useGetEventsFromRoomQuery(roomId);
  return (
    <div className={styles.container}>
      {events && (
        <Scheduler
          day={{
            startHour: 9,
            endHour: 17,
            step: 30,
            navigation: true,
          }}
          week={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 1,
            startHour: 9,
            endHour: 17,
            step: 30,
          }}
          hourFormat="24"
          editable={false}
          customEditor={(scheduler) => {
            setTimeout(scheduler.close, 0);
            return <div />;
          }}
          viewerExtraComponent={PlanningEvent}
          events={events
            ?.map((event) => {
              // make sure at home events are visible only for one client and the contractor
              const formattedWorkshop = formatEventForScheduler(event);

              formattedWorkshop.deletable = false;
              formattedWorkshop.editable = false;
              formattedWorkshop.draggable = false;

              if (event.id === coloredEventId) {
                formattedWorkshop.color = "#BB0000";
              }

              return formattedWorkshop;
            })
            .filter((event) => event !== null)}
        />
      )}
    </div>
  );
};
