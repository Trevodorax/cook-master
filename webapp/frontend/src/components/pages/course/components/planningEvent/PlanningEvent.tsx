import { FieldProps, ProcessedEvent } from "@aldabil/react-scheduler/types";
import { useRouter } from "next/router";

import {
  useGetClientByIdQuery,
  useGetClientsFromEventQuery,
  useGetPremiseByIdQuery,
  useGetRoomByIdQuery,
} from "@/store/services/cookMaster/api";
import { Button } from "@/components/button/Button";

import styles from "./PlanningEvent.module.scss";

export const PlanningEvent = (fields: FieldProps[], event: ProcessedEvent) => {
  const router = useRouter();
  const workshopType = event.roomId
    ? "inPremise"
    : event.atHomeClientId
    ? "atClientHome"
    : "other";

  const { data: room } = useGetRoomByIdQuery(event?.roomId, {
    skip: workshopType !== "inPremise",
  });

  const { data: premise } = useGetPremiseByIdQuery(
    { premiseId: room?.premiseId || -1 },
    { skip: !room }
  );

  const { data: participants } = useGetClientsFromEventQuery(
    event.event_id.toString(),
    { skip: workshopType === "atClientHome" }
  );

  const { data: atHomeClient } = useGetClientByIdQuery(event.atHomeClientId, {
    skip: workshopType !== "atClientHome",
  });

  return (
    <div className={styles.container}>
      <div>
        <h3>Description</h3>
        <p>Description: {event.description || "No description"}</p>
      </div>
      {workshopType === "inPremise" && (
        <div className={styles.inPremiseFields}>
          <div>
            <h3>Address</h3>
            <p>
              {`${premise?.address.streetNumber} ${premise?.address.streetName}`}
            </p>
            <p>{`${premise?.address.city}, ${premise?.address.country}`}</p>
          </div>
          <div>
            <h3>Spots</h3>
            <p>
              Spots {`${participants?.length} / ${room?.capacity}`} (
              {(room?.capacity || 0) - (participants?.length || 0)} left)
            </p>
          </div>
        </div>
      )}
      {workshopType === "atClientHome" && (
        <div>
          <div>
            <h3>Client</h3>
            <p>{`${atHomeClient?.user?.firstName} ${atHomeClient?.user?.lastName}`}</p>
          </div>
          <div>
            <h3>Address</h3>
            {atHomeClient?.Address ? (
              <>
                <p>
                  {`${atHomeClient?.Address?.streetNumber} ${atHomeClient?.Address?.streetName}`}
                </p>
                <p>{`${atHomeClient?.Address?.city}, ${atHomeClient?.Address?.country}`}</p>
              </>
            ) : (
              <p>Client has no address</p>
            )}
          </div>
        </div>
      )}
      {event.isOnline && (
        <div>
          <h3>Online</h3>
          <Button
            type="ok"
            onClick={() => router.push(`/onlineEvents/${event?.event_id}`)}
            className={styles.joinButton}
          >
            Join
          </Button>
        </div>
      )}
    </div>
  );
};
