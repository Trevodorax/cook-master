import { Room } from "@/store/services/cookMaster/types";
import styles from "./RoomCard.module.scss";
import { FC } from "react";
import Link from "next/link";

interface Props {
  room: Room;
}

export const RoomCard: FC<Props> = ({ room }) => {
  return (
    <Link className={styles.link} href={`/rooms/${room.id}`}>
      <div className={styles.container}>
        <div className={styles.title}>{`Room n°${room.id}`}</div>
        <div>Capacity: {room.capacity}</div>
      </div>
    </Link>
  );
};
