import { FC, useEffect, useMemo, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

import styles from "./VideoEvent.module.scss";

interface Props {
  eventId: number;
}

export const VideoEvent: FC<Props> = ({ eventId }) => {
  const token = useSelector((state: RootState) => state.user.token);

  const videoRef = useRef<HTMLVideoElement>(null);
  const peers = {};

  const setVideoStream = (stream: any) => {
    if (videoRef?.current) {
      videoRef.current.srcObject = stream;
      videoRef?.current?.addEventListener("loadedmetadata", () => {
        videoRef?.current?.play();
      });
    }
  };

  const removeVideoStream = () => {
    if (videoRef?.current?.srcObject) {
      videoRef.current.srcObject = null;
    }
  };

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

      let myVideoStream: MediaStream;
      try {
        myVideoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (error) {
        console.error("Could not get user media:", error);
        return; // If we can't get the user media, we should probably stop trying to setup the peer.
      }

      // undefined so peerjs gives me a UUID
      const myPeer = new Peer(undefined as unknown as string, {
        host: "localhost",
        port: 9000,
        path: "/trevodorax",
      });

      myPeer.on("call", (call) => {
        call.answer(myVideoStream);
        call.on("stream", (peerVideoStream) => {
          setVideoStream(peerVideoStream);
        });
      });

      myPeer.on("open", (myPeerId) => {
        socket.emit(
          "join-event",
          JSON.stringify({ token, eventId, peerId: myPeerId })
        );
      });

      myPeer.on("error", (error) => {
        console.log("error", error);
      });

      socket.on("user-connected", (userId) => {
        const call = myPeer.call(userId, myVideoStream);
        call.on("stream", (peerVideoStream) => {
          setVideoStream(peerVideoStream);
        });
        call.on("close", () => {
          removeVideoStream();
        });

        peers[userId] = call;
      });

      socket.on("user-disconnected", (userId) => {
        if (peers[userId]) {
          peers[userId].close();
        }
      });
    };
    fn();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={styles.container}>
      <video ref={videoRef} id="video" className={styles.video} />
    </div>
  );
};
