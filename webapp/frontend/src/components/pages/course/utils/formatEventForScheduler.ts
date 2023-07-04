import { SerializedCookMasterEvent } from "@/store/services/cookMaster/types";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import {
  atClientHomeEventColor,
  inPremiseEventColor,
  otherEventColor,
} from "./constants";

export const formatEventForScheduler = (
  event: SerializedCookMasterEvent
): ProcessedEvent => {
  const startTime = new Date(event.startTime);
  const workshopType = event.roomId
    ? "inPremise"
    : event.atHomeClientId
    ? "atClientHome"
    : "other";

  const color =
    workshopType === "atClientHome"
      ? atClientHomeEventColor
      : workshopType === "inPremise"
      ? inPremiseEventColor
      : otherEventColor;

  const formattedEvent = {
    event_id: event.id,
    title: event.name,
    description: event.description,
    isOnline: event.isOnline,
    start: startTime,
    end: new Date(
      startTime.getTime() + event.durationMin * 60000 // Convert minutes to milliseconds
    ),
    roomId: event.roomId,
    atHomeClientId: event.atHomeClientId,
    color,
  };

  return formattedEvent;
};
