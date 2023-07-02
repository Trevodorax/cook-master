import { FC } from "react";
import { useRouter } from "next/router";

import { Button } from "@/components/button/Button";
import {
  useDeletePremiseMutation,
  useGetPremiseByIdQuery,
} from "@/store/services/cookMaster/api";

import styles from "./Premise.module.scss";
import { RoomCard } from "@/components/roomCard/RoomCard";

interface Props {
  premiseId: number;
}

export const Premise: FC<Props> = ({ premiseId }) => {
  const router = useRouter();

  const { data: premiseData } = useGetPremiseByIdQuery(
    { premiseId },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [deletePremise] = useDeletePremiseMutation();

  const handleDelete = async () => {
    await deletePremise({ premiseId: premiseId });

    router.push("/premises/browse");
  };

  return (
    <div className={styles.container}>
      <h1>Premise {premiseData?.id}</h1>
      <p>{`City: ${premiseData?.address.city} (${premiseData?.address.country})`}</p>
      <div className={styles.actions}>
        <Button type="error" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      <hr />
      <h2>Rooms</h2>
      <div className={styles.roomsList}>
        {premiseData?.rooms.map((room, index) => (
          <RoomCard key={index} room={room} />
        ))}
        <div
          className={styles.createButton}
          onClick={() => router.push(`/premises/${premiseId}/rooms/new`)}
        >
          +
        </div>
      </div>
    </div>
  );
};
