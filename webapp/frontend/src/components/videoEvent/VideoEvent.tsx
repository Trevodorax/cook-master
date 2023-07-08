import { FC, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

import styles from "./VideoEvent.module.scss";

interface Props {
  eventId: number;
}

export const VideoEvent: FC<Props> = ({ eventId }) => {
  const token = useSelector((state: RootState) => state.user.token);

  const socket = useMemo(
    () =>
      io(
        `wss://${
          process.env.NODE_ENV === "development"
            ? "localhost:3333"
            : "cookmaster.site"
        }`
      ),
    []
  );

  useEffect(() => {
    socket.emit("join-event", JSON.stringify({ token, eventId }));
    socket.on("user-connected", (userId) => {
      console.log("user connected", userId);
    });
  }, []);

  return <div className={styles.container}></div>;
};
