import { FC, useEffect, useMemo, useState } from "react";
import cx from "classnames";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

import { useGetMyMessagesWithMutation } from "@/store/services/cookMaster/api";
import { TextInput } from "@/components/textInput/TextInput";
import { Button } from "@/components/button/Button";
import { RootState } from "@/store/store";
import { Message } from "@/store/services/cookMaster/types";

import styles from "./Conversation.module.scss";

interface Props {
  otherUserId: number;
}

export const Conversation: FC<Props> = ({ otherUserId }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const [message, setMessage] = useState("");
  const [getMyMessages] = useGetMyMessagesWithMutation();

  const [messagesWithUpdates, setMessagesWithUpdates] = useState<Message[]>([]);

  const socket = useMemo(() => io("ws://localhost:3333"), []);

  useEffect(() => {
    getMyMessages(otherUserId).then((data) => {
      setMessagesWithUpdates((prevMessages) => [
        ...prevMessages,
        ...((data as { data: any }).data || []),
      ]);
    });

    socket.emit("auth", JSON.stringify({ token }));

    socket.on("message", (message) => {
      console.log("receive", message);
      setMessagesWithUpdates((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      console.log("unmount Conversations");
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    console.log("vomi");
    const payload = JSON.stringify({
      token,
      content: message,
      recipientId: otherUserId,
    });

    socket.emit("message", payload);
    setMessage("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messagesWithUpdates.map((message, index) => (
          <div
            key={index}
            className={cx(styles.message, {
              [styles.fromMe]: message.senderId !== otherUserId,
            })}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className={styles.input}>
        <TextInput
          type="text"
          className={styles.textInput}
          value={message}
          setValue={setMessage}
          onEnter={handleSendMessage}
        />
        <Button
          type="ok"
          className={styles.sendButton}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
