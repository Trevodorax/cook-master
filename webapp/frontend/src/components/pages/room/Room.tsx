import { FC } from "react";
import styles from "./Room.module.scss";
import {
  useDeleteRoomByIdMutation,
  useGetRoomByIdQuery,
  usePatchRoomByIdMutation,
} from "@/store/services/cookMaster/api";
import { EditableField } from "@/components/editableField/EditableField";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/router";
import { RoomPlanning } from "@/components/roomPlanning/RoomPlanning";
import { useTranslation } from "react-i18next";

interface Props {
  roomId: number;
}

export const Room: FC<Props> = ({ roomId }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: roomData } = useGetRoomByIdQuery(roomId);
  const [patchRoomById] = usePatchRoomByIdMutation();
  const [deleteRoomById] = useDeleteRoomByIdMutation();

  const handleDelete = async () => {
    await deleteRoomById(roomId);
    router.back();
  };

  return (
    <div className={styles.container}>
      <h1>Room {roomId}</h1>
      <div className={styles.actions}>
        <Button type="error" onClick={handleDelete}>
          {t("delete")}
        </Button>
      </div>
      <hr />
      <div className={styles.capacity}>
        <p className={styles.fieldName}>{t("capacity")} :</p>
        <EditableField
          type="number"
          initialValue={roomData?.capacity}
          mutateValue={(value) =>
            patchRoomById({ roomId: roomId, capacity: value })
          }
          isEditable
        />
      </div>
      <RoomPlanning roomId={roomId} />
    </div>
  );
};
