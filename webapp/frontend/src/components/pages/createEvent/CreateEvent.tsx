import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { useCreateEventMutation } from "@/store/services/cookMaster/api";
import { Button } from "@/components/button/Button";
import { TextInput } from "@/components/textInput/TextInput";
import { RootState } from "@/store/store";

import styles from "./CreateEvent.module.scss";

export const CreateEvent = () => {
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [createEvent] = useCreateEventMutation();

  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [durationMin, setDurationMin] = useState(0);

  const eventData = {
    type,
    name,
    description,
    startTime,
    durationMin,
    animator: user?.contractorId ?? undefined,
  };

  const handleCreateEvent = async () => {
    try {
      await createEvent(eventData);
      setType("");
      setName("");
      setDescription("");
      setStartTime(new Date());
      setDurationMin(0);
      toast.success("Created event successfully");
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create an event</h2>
      <div className={styles.form}>
        <TextInput
          type="text"
          value={type}
          setValue={setType}
          hideIcon
          label="Event type"
          placeholder="ex: Cooking workshop"
          className={styles.field}
        />
        <TextInput
          type="text"
          value={name}
          setValue={setName}
          hideIcon
          label="Event name"
          placeholder="ex: Let's cook pizza !"
          className={styles.field}
        />
        <TextInput
          type="text"
          value={description}
          setValue={setDescription}
          hideIcon
          label="Event description"
          placeholder="ex: This is an event where you'll learn how to make pasta"
          className={styles.field}
        />
        <div className={styles.field}>
          <label className={styles.label}>Event date and time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={startTime.toISOString().substring(0, 16)}
            onChange={(event) => setStartTime(new Date(event.target.value))}
          />
        </div>
        <TextInput
          type="text"
          value={durationMin.toString()}
          setValue={(value) => setDurationMin(Number(value))}
          hideIcon
          label="Event duration"
          className={styles.field}
        />
        <Button onClick={handleCreateEvent} className={styles.submitButton}>
          Create
        </Button>
      </div>
    </div>
  );
};
