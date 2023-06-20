import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import {
  useApplyToEventMutation,
  useGetEventByIdQuery,
  useGetUserFromContractorQuery,
  useGetClientsFromEventQuery,
  usePatchEventMutation,
  useResignFromEventMutation,
} from "@/store/services/cookMaster/api";
import { EditableField } from "@/components/editableField/EditableField";
import { RootState } from "@/store/store";
import { Button } from "@/components/button/Button";

import styles from "./Event.module.scss";

interface Props {
  eventId: string;
}

export const Event = ({ eventId }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [patchEvent] = usePatchEventMutation();
  const [applyToEvent] = useApplyToEventMutation();
  const [resignFromEvent] = useResignFromEventMutation();

  if (!user) {
    router.push("/login");
  }

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
      <EditableField
        type="text"
        initialValue={<h2>{event.name}</h2>}
        mutateValue={(value: any) => {
          patchEvent({ id: eventId, data: { name: value } });
        }}
        isEditable={
          event.contractorId === user?.contractorId ||
          user?.userType === "admin"
        }
      />
      {/* button to apply or resign as client */}
      {user?.userType === "client" && (
        <div>
          {isUserInEvent ? (
            <Button
              type="error"
              onClick={() => resignFromEvent({ eventId: parseInt(eventId) })}
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

      <EditableField
        type="text"
        initialValue={<h3>{event.type}</h3>}
        mutateValue={(value: any) => {
          patchEvent({ id: eventId, data: { type: value } });
        }}
        isEditable={
          event.contractorId === user?.contractorId ||
          user?.userType === "admin"
        }
      />
      <EditableField
        type="text"
        initialValue={<p>{event.description}</p>}
        mutateValue={(value: any) => {
          patchEvent({ id: eventId, data: { description: value } });
        }}
        isEditable={
          event.contractorId === user?.contractorId ||
          user?.userType === "admin"
        }
      />
      <hr />
      <div className={styles.timeInfo}>
        <div>
          <span>Start time :</span>
          <EditableField
            type="date"
            initialValue={<p>{new Date(event.startTime).toUTCString()}</p>}
            mutateValue={(value: any) => {
              patchEvent({ id: eventId, data: { startTime: value } });
            }}
            isEditable={
              event.contractorId === user?.contractorId ||
              user?.userType === "admin"
            }
          />
        </div>
        <div>
          <span>Duration:</span>
          <EditableField
            type="number"
            initialValue={
              <div>
                <p>{event.durationMin}</p>
              </div>
            }
            mutateValue={(value: any) => {
              patchEvent({ id: eventId, data: { durationMin: value } });
            }}
            isEditable={
              event.contractorId === user?.contractorId ||
              user?.userType === "admin"
            }
          />
        </div>
      </div>
      <div>
        <EditableField
          type="number"
          initialValue={
            <p>
              {eventAnimator
                ? `${eventAnimator?.user?.firstName} ${eventAnimator?.user?.lastName}`
                : "None"}
            </p>
          }
          mutateValue={(value: any) => {
            patchEvent({ id: eventId, data: { animator: value } });
          }}
          isEditable={user?.userType === "admin"}
        />
      </div>
      {/* list of clients participating in the event */}
      <h3>Participants</h3>
      {(!clientsInEvent || clientsInEvent.length === 0) && (
        <div>No participants yet.</div>
      )}
      {clientsInEvent && (
        <ul>
          {clientsInEvent.map((client, index) => (
            <li key={index}>{client.id}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
