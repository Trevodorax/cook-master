import { Room } from "@/store/services/cookMaster/types";
import styles from "./RoomCard.module.scss";
import { FC } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface Props {
  room: Room;
}

export const RoomCard: FC<Props> = ({ room }) => {
  const { t } = useTranslation();

  return (
    <Link className={styles.link} href={`/rooms/${room.id}`}>
      <div className={styles.container}>
        <div className={styles.title}>{`${t("room")} n°${room.id}`}</div>
        <div>
          {t("capacity")}: {room.capacity}
        </div>
      </div>
    </Link>
  );
};
