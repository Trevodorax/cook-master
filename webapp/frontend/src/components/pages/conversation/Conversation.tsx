import { FC, useEffect, useMemo, useRef, useState } from "react";
import cx from "classnames";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

import { useGetMyMessagesWithMutation } from "@/store/services/cookMaster/api";
import { TextInput } from "@/components/textInput/TextInput";
import { Button } from "@/components/button/Button";
import { RootState } from "@/store/store";
import { Message } from "@/store/services/cookMaster/types";

import styles from "./Conversation.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  otherUserId: number;
}

export const Conversation: FC<Props> = ({ otherUserId }) => {
  const { t } = useTranslation();
  const token = useSelector((state: RootState) => state.user.token);
  const myId = useSelector((state: RootState) => state.user.userInfo?.id);

  const [message, setMessage] = useState("");
  const [getMyMessages] = useGetMyMessagesWithMutation();

  const [messagesWithUpdates, setMessagesWithUpdates] = useState<Message[]>([]);

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
    getMyMessages(otherUserId).then((data) => {
      setMessagesWithUpdates((prevMessages) => [
        ...prevMessages,
        ...((data as { data: any }).data || []),
      ]);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    });

    socket.emit("auth", JSON.stringify({ token }));

    socket.on("message", (message: Message) => {
      if (message.senderId !== otherUserId && message.senderId !== myId) {
        return;
      }

      setMessagesWithUpdates((prevMessages) => [...prevMessages, message]);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleSendMessage = () => {
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
        <div ref={messagesEndRef} />
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
          {t("send")}
        </Button>
      </div>
    </div>
  );
};
