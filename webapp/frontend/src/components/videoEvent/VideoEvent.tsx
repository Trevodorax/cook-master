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
        `ws://${
          process.env.NODE_ENV === "development"
            ? "localhost:3333"
            : "cookmaster.site"
        }`
      ),
    []
  );

  useEffect(() => {
    const fn = async () => {
      // only importing on client side
      const { Peer } = await import("peerjs");

      // undefined so peerjs gives me a UUID
      const myPeer = new Peer(undefined as unknown as string, {
        host: "localhost",
        port: 9000,
        path: "/trevodorax",
      });

      myPeer.on("open", (myPeerId) => {
        socket.emit(
          "join-event",
          JSON.stringify({ token, eventId, peerId: myPeerId })
        );
      });
    };
    fn();

    socket.on("user-connected", (userId) => {
      console.log("user connected", userId);
    });
  }, []);

  return <div className={styles.container}></div>;
};
