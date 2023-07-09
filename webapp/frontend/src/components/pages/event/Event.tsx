import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import cx from "classnames";

import {
  useApplyToEventMutation,
  useGetEventByIdQuery,
  useGetUserFromContractorQuery,
  useGetClientsFromEventQuery,
  usePatchEventMutation,
  useResignFromEventMutation,
  useGetClientByIdQuery,
} from "@/store/services/cookMaster/api";
import { EditableField } from "@/components/editableField/EditableField";
import { RootState } from "@/store/store";
import { Button } from "@/components/button/Button";

import styles from "./Event.module.scss";
import { RoomPlanning } from "@/components/roomPlanning/RoomPlanning";
import { Map } from "@/components/map/Map";
import { VideoEvent } from "@/components/videoEvent/VideoEvent";

interface Props {
  eventId: string;
}

export const Event = ({ eventId }: Props) => {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [patchEvent] = usePatchEventMutation();
  const [applyToEvent] = useApplyToEventMutation();
  const [resignFromEvent] = useResignFromEventMutation();

  if (!eventId) {
    return <div>Event not found</div>;
  }

  const {
    data: event,
    isLoading: isEventLoading,
    isError: isEventError,
  } = useGetEventByIdQuery(eventId);
  const { data: eventAnimator } = useGetUserFromContractorQuery(
    event?.contractorId || 0
  );

  const { data: clientsInEvent } = useGetClientsFromEventQuery(eventId);

  const { data: atHomeClient } = useGetClientByIdQuery(
    event?.atHomeClientId || 0,
    {
      skip: !event?.atHomeClientId,
    }
  );

  const isUserInEvent = clientsInEvent?.some(
    (client) => client.id === user?.clientId
  );

  if (isEventLoading) {
    return <div>Loading...</div>;
  }

  if (isEventError || !event) {
    return <div>An error occured.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainPart}>
        <div className={styles.title}>
          <EditableField
            type="text"
            initialValue={<h1>{event.name}</h1>}
            mutateValue={(value: any) => {
              patchEvent({ id: eventId, data: { name: value } });
            }}
            isEditable={
              event.contractorId === user?.contractorId ||
              user?.userType === "admin"
            }
          />
          <div className={styles.type}>
            <EditableField
              type="text"
              initialValue={<h2>({event.type})</h2>}
              mutateValue={(value: any) => {
                patchEvent({ id: eventId, data: { type: value } });
              }}
              isEditable={
                event.contractorId === user?.contractorId ||
                user?.userType === "admin"
              }
            />
          </div>
        </div>
        <EditableField
          type="text"
          initialValue={
            <div className={styles.description}>{event.description}</div>
          }
          mutateValue={(value: any) => {
            patchEvent({ id: eventId, data: { description: value } });
          }}
          isEditable={
            event.contractorId === user?.contractorId ||
            user?.userType === "admin"
          }
        />
        {eventAnimator && (
          <>
            <h2>Animated by</h2>
            <div className={styles.user}>
              <img
                src={eventAnimator.user.profilePicture}
                className={styles.profilePicture}
              />
              <h3 className={styles.name}>
                {`${eventAnimator?.user?.firstName} ${eventAnimator?.user?.lastName}`}
              </h3>
            </div>
          </>
        )}
        <div className={styles.middlePart}>
          <h2 className={styles.title}>
            {event?.roomId
              ? `Events in room ${event?.roomId}`
              : event?.atHomeClientId
              ? `Address of ${atHomeClient?.user?.firstName} ${atHomeClient?.user?.lastName}`
              : event?.isOnline
              ? `Video class starting in : ${getTimeDifference(
                  event?.startTime
                )}`
              : "This is an event"}
          </h2>
          {atHomeClient?.Address && (
            <div>
              <h3>
                {`${atHomeClient.Address.streetNumber} ${atHomeClient.Address.streetName}`}
              </h3>
              <p>{`${atHomeClient.Address.postalCode} ${atHomeClient.Address.city} - ${atHomeClient.Address.country}`}</p>
            </div>
          )}
          <div className={styles.middleBlock}>
            {event?.roomId && (
              <RoomPlanning roomId={event.roomId} coloredEventId={event.id} />
            )}
            {atHomeClient && (
              <Map
                longitude={atHomeClient.Address?.longitude || null}
                latitude={atHomeClient.Address?.latitude || null}
                noAddress={!atHomeClient.Address}
              />
            )}
            {event.isOnline && (
              <VideoEvent
                eventId={event.id}
                eventContractorId={event.contractorId || -1}
              />
            )}
          </div>
        </div>
      </div>
      <div className={styles.sideBar}>
        <div className={styles.header}>
          <h2>Participants</h2>
          {user?.userType === "client" && (
            <div>
              {isUserInEvent ? (
                <Button
                  type="error"
                  onClick={() =>
                    resignFromEvent({ eventId: parseInt(eventId) })
                  }
                  className={styles.actionButton}
                >
                  Leave
                </Button>
              ) : (
                <Button
                  onClick={() => applyToEvent({ eventId: parseInt(eventId) })}
                >
                  Join
                </Button>
              )}
            </div>
          )}
        </div>
        {(!clientsInEvent || clientsInEvent.length === 0) && (
          <div>No participants yet.</div>
        )}
        {clientsInEvent && (
          <div className={styles.participantsList}>
            {clientsInEvent.map((client, index) => (
              <div key={index} className={cx(styles.user, styles.small)}>
                <img
                  src={client?.user?.profilePicture}
                  className={styles.profilePicture}
                />
                <h3 className={styles.name}>
                  {`${client?.user?.firstName} ${client?.user?.lastName}`}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function getTimeDifference(eventStartTime?: string) {
  if (eventStartTime) {
    const differenceMilliseconds =
      new Date(eventStartTime).getTime() - new Date().getTime();

    const differenceMinutes = Math.floor(
      (differenceMilliseconds / (1000 * 60)) % 60
    );
    const differenceHours = Math.floor(
      (differenceMilliseconds / (1000 * 60 * 60)) % 24
    );
    const differenceDays = Math.floor(
      differenceMilliseconds / (1000 * 60 * 60 * 24)
    );

    return `${differenceDays} days, ${differenceHours} hours, ${differenceMinutes} minutes`;
  } else {
    return "Event start time is not defined.";
  }
}
