import { FC, useState } from "react";

import { NumberInput } from "@/components/numberInput/NumberInput";
import { useCreateRoomInPremiseMutation } from "@/store/services/cookMaster/api";

import styles from "./CreateRoom.module.scss";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

interface Props {
  premiseId: number;
}

export const CreateRoom: FC<Props> = ({ premiseId }) => {
  const router = useRouter();

  const [capacity, setCapacity] = useState(0);

  const [createRoom] = useCreateRoomInPremiseMutation();

  const handleCreate = async () => {
    const response = await createRoom({ premiseId, capacity });

    if ("data" in response) {
      router.push(`/premises/${premiseId}`);
    } else {
      toast.error("Error creating room");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create premise</h1>
      <hr />
      <div className={styles.form}>
        <NumberInput
          value={capacity.toString()}
          setValue={(value) => setCapacity(Number(value))}
          label="Capacity"
        />
        <Button className={styles.createButton} onClick={handleCreate}>
          Create room
        </Button>
      </div>
    </div>
  );
};
