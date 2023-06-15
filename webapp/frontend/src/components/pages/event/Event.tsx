import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import {
  useGetEventByIdQuery,
  useGetUserFromContractorQuery,
  usePatchEventMutation,
} from "@/store/services/cookMaster/api";
import { EditableField } from "@/components/editableField/EditableField";
import { RootState } from "@/store/store";

import styles from "./Event.module.scss";

interface Props {
  eventId: string;
}

export const Event = ({ eventId }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [patchEvent] = usePatchEventMutation();

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

  console.log("eventAnimator : ", eventAnimator);

  if (isEventLoading) {
    return <div>Loading...</div>;
  }

  if (isEventError || !event) {
    return <div>An error occured.</div>;
  }

  return (
    <div className={styles.container}>
      <h2>
        <EditableField
          type="text"
          initialValue={event.name}
          mutateValue={(value: any) => {
            patchEvent({ id: eventId, data: { name: value } });
          }}
          isEditable={
            event.id === user?.contractorId || user?.userType === "admin"
          }
        />
      </h2>
      <h3>
        <EditableField
          type="text"
          initialValue={event.type}
          mutateValue={(value: any) => {
            patchEvent({ id: eventId, data: { type: value } });
          }}
          isEditable={
            event.id === user?.contractorId || user?.userType === "admin"
          }
        />
      </h3>
      <p>
        <EditableField
          type="text"
          initialValue={event.description}
          mutateValue={(value: any) => {
            patchEvent({ id: eventId, data: { description: value } });
          }}
          isEditable={
            event.id === user?.contractorId || user?.userType === "admin"
          }
        />
      </p>
      <hr />
      <div className={styles.timeInfo}>
        <div>
          <span>Start time :</span>
          <EditableField
            type="date"
            initialValue={event.startTime.toUTCString()}
            mutateValue={(value: any) => {
              patchEvent({ id: eventId, data: { startTime: value } });
            }}
            isEditable={
              event.id === user?.contractorId || user?.userType === "admin"
            }
          />
        </div>
        <div>
          <span>Duration:</span>
          <EditableField
            type="number"
            initialValue={event.durationMin}
            mutateValue={(value: any) => {
              patchEvent({ id: eventId, data: { durationMin: value } });
            }}
            isEditable={
              event.id === user?.contractorId || user?.userType === "admin"
            }
          />
        </div>
      </div>
      <div>
        <EditableField
          type="number"
          initialValue={
            eventAnimator
              ? `${eventAnimator?.user?.firstName} ${eventAnimator?.user?.lastName}`
              : "None"
          }
          mutateValue={(value: any) => {
            patchEvent({ id: eventId, data: { animator: value } });
          }}
          isEditable={true}
        />
      </div>
    </div>
  );
};
