import { FC, useEffect, useMemo, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

import styles from "./VideoEvent.module.scss";
import { MediaConnection } from "peerjs";

interface Props {
  eventId: number;
  eventContractorId: number;
}

export const VideoEvent: FC<Props> = ({ eventId, eventContractorId }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const myContractorId = useSelector(
    (state: RootState) => state.user.userInfo?.contractorId
  );
  const isAnimator = eventContractorId === myContractorId;

  const videoRef = useRef<HTMLVideoElement>(null);
  const peers: { [userId: string]: MediaConnection } = {};

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
        process.env.NODE_ENV === "development"
          ? "ws://localhost:3333"
          : "wss://cookmaster.site"
      ),
    []
  );

  useEffect(() => {
    let myVideoStream: MediaStream;
    const fn = async () => {
      // only importing on client side
      const { Peer } = await import("peerjs");

      try {
        myVideoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (error) {
        console.error("Could not get user media:", error);
        return; // If we can't get the user media, we should probably stop trying to setup the peer.
      }

      if (isAnimator) {
        setVideoStream(myVideoStream);
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
          if (!isAnimator) {
            setVideoStream(peerVideoStream);
          }
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
          if (!isAnimator) {
            setVideoStream(peerVideoStream);
          }
        });
        call.on("close", () => {
          if (!isAnimator) {
            removeVideoStream();
          }
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
      // Assuming myVideoStream is your MediaStream object
      const tracks = myVideoStream.getTracks(); // get all tracks from the stream

      tracks.forEach(function (track) {
        track.stop();
      });
    };
  }, []);

  return (
    <div className={styles.container}>
      <video ref={videoRef} id="video" className={styles.video} />
    </div>
  );
};
