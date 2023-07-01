import { serializedCookMasterEvent } from "@/store/services/cookMaster/types";

interface CalendarEvent {
  event_id: number | string;
  title: string;
  start: Date;
  end: Date;
  disabled?: boolean;
  color?: string;
  editable?: boolean;
  deletable?: boolean;
  draggable?: boolean;
  allDay?: boolean;
}

export const formatEventForScheduler = (
  event: serializedCookMasterEvent
): CalendarEvent => {
  const startTime = new Date(event.startTime);

  const formattedEvent = {
    event_id: event.id,
    title: event.name,
    start: startTime,
    end: new Date(
      startTime.getTime() + event.durationMin * 60000 // Convert minutes to milliseconds
    ),
  };

  return formattedEvent;
};
