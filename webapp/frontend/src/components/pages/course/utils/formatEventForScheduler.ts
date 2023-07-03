import { SerializedCookMasterEvent } from "@/store/services/cookMaster/types";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";

export const formatEventForScheduler = (
  event: SerializedCookMasterEvent
): ProcessedEvent => {
  const startTime = new Date(event.startTime);

  const formattedEvent = {
    event_id: event.id,
    title: event.name,
    description: event.description,
    isOnline: event.isOnline,
    start: startTime,
    end: new Date(
      startTime.getTime() + event.durationMin * 60000 // Convert minutes to milliseconds
    ),
  };

  return formattedEvent;
};
