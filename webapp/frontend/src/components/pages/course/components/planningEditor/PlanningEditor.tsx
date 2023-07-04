import {
  ProcessedEvent,
  SchedulerHelpers,
} from "@aldabil/react-scheduler/types";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";
import cx from "classnames";

import {
  useAddWorkshopToCourseMutation,
  useGetAllPremisesQuery,
  useGetClientsOfCourseQuery,
  useGetWorkshopsOfCourseQuery,
  usePatchEventMutation,
} from "@/store/services/cookMaster/api";
import { TextInput } from "@/components/textInput/TextInput";
import { SwitchInput } from "@/components/switchInput/SwitchInput";
import { Button } from "@/components/button/Button";
import { SelectInput } from "@/components/selectInput/SelectInput";
import { Client, Premise, Room } from "@/store/services/cookMaster/types";

import { formatEventForScheduler } from "../../utils/formatEventForScheduler";
import styles from "./PlanningEditor.module.scss";

interface Props {
  scheduler: SchedulerHelpers;
  courseId: number;
}

export const PlanningEditor: FC<Props> = ({ scheduler, courseId }) => {
  const [addWorkshopToCourse] = useAddWorkshopToCourseMutation();
  const [patchEvent] = usePatchEventMutation();
  const { refetch: refetchWorkshops } = useGetWorkshopsOfCourseQuery({
    courseId,
  });
  const { data: premises } = useGetAllPremisesQuery();
  const { data: participants } = useGetClientsOfCourseQuery({
    courseId,
  });

  const event = scheduler.edited;

  const [formState, setFormState] = useState({
    title: event?.title || "",
    description: event?.description || "",
    isOnline: event?.isOnline || false,
  });

  const [selectedPremise, setSelectedPremise] = useState<Premise | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [place, setPlace] = useState(
    event?.atHomeClientId
      ? "At a client's home"
      : event?.roomId
      ? "In a collective room"
      : "Select"
  );

  const createEvent = async () => {
    const startTime = scheduler.state.start.value;
    const endTime = scheduler.state.end.value;

    if (!formState.isOnline && !selectedClient && !selectedRoom) {
      toast.error("Please fill in all the required informations.");
      return event;
    }

    const createdWorkshop = await addWorkshopToCourse({
      courseId: courseId,
      workshop: {
        name: formState.title,
        description: formState.description,
        isOnline: formState.isOnline,
        type: "workshop",
        startTime: scheduler.state.start.value,
        durationMin: Math.floor(
          (endTime.getTime() - startTime.getTime()) / (1000 * 60)
        ),
        roomId: selectedRoom?.id || null,
        atHomeClientId: selectedClient?.id || null,
      },
    });

    refetchWorkshops();

    if ("data" in createdWorkshop && createdWorkshop.data) {
      return formatEventForScheduler(createdWorkshop.data);
    } else {
      toast.error("Error creating event");
      return event;
    }
  };

  const editEvent = async (event: ProcessedEvent) => {
    if (!formState.isOnline && !selectedClient && !selectedRoom) {
      toast.error("Please fill in all the required informations.");
      return event;
    }

    const modifiedWorkshop = await patchEvent({
      id: event.event_id.toString(),
      data: {
        name: formState.title,
        description: formState.description,
        isOnline: formState.isOnline,
        startTime: event.start,
        durationMin: Math.floor(
          (event.end.getTime() - event.start.getTime()) / (1000 * 60)
        ),
        roomId: selectedRoom?.id || null,
        atHomeClientId: selectedClient?.id || null,
      },
    });

    refetchWorkshops();

    if ("data" in modifiedWorkshop && modifiedWorkshop.data) {
      return formatEventForScheduler(modifiedWorkshop.data);
    } else {
      toast.error("Error editing event");
      return event;
    }
  };

  const handleChange = (value: any, name: string) => {
    setFormState((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      scheduler.loading(true);

      let resultEvent;

      if (event) {
        resultEvent = await editEvent(event);
      } else {
        resultEvent = await createEvent();
      }

      if (resultEvent) {
        scheduler.onConfirm(resultEvent, event ? "edit" : "create");
      }

      scheduler.close();
    } finally {
      scheduler.loading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.fields}>
        <h2>{event ? "Editing" : "Creating"} workshop</h2>
        <h3>General informations</h3>
        <TextInput
          type="text"
          value={formState.title}
          setValue={(value) => handleChange(value, "title")}
          label="Title"
          hideIcon
        />
        <TextInput
          type="text"
          value={formState.description}
          setValue={(value) => handleChange(value, "description")}
          label="Description"
          hideIcon
        />
        <h3>Where will it happen ?</h3>
        <div className={styles.isOnlineSection}>
          <p>Online</p>
          <SwitchInput
            isChecked={formState.isOnline}
            setIsChecked={(isChecked) => handleChange(isChecked, "isOnline")}
          />
        </div>
        {!formState.isOnline && (
          <div>
            <SelectInput
              className={styles.placeSelector}
              options={["Select", "In a collective room", "At a client's home"]}
              value={place}
              setValue={setPlace}
            />

            {place === "In a collective room" && (
              <div>
                <div>
                  <h4>Choose a premise</h4>
                  <div className={styles.cardsList}>
                    {premises?.map((premise, index) => {
                      const isCurrentlySelected =
                        selectedPremise?.id === premise.id;
                      return (
                        <div
                          key={index}
                          className={cx(styles.card, {
                            [styles.selected]: isCurrentlySelected,
                          })}
                          onClick={() =>
                            setSelectedPremise(
                              isCurrentlySelected ? null : premise
                            )
                          }
                        >
                          <p className={styles.bigText}>
                            {`${premise.address.streetNumber} ${premise.address.streetName} (${premise.address.city})`}
                          </p>
                          <p className={styles.smallText}>
                            {premise.address.country}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {selectedPremise && (
                  <div>
                    <h4>Choose a room</h4>
                    <div className={styles.cardsList}>
                      {selectedPremise?.rooms?.map((room, index) => {
                        const isCurrentlySelected =
                          selectedRoom?.id === room.id;

                        return (
                          <div
                            key={index}
                            className={cx(styles.card, {
                              [styles.selected]: isCurrentlySelected,
                            })}
                            onClick={() =>
                              setSelectedRoom(isCurrentlySelected ? null : room)
                            }
                          >
                            <p className={styles.bigText}>
                              {`Room n°${room.id}`}
                            </p>
                            <p className={styles.smallText}>{room.capacity}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {place === "At a client's home" && (
              <div>
                <h4>Choose a client</h4>
                <div className={styles.cardsList}>
                  {participants?.map((client, index) => {
                    const isCurrentlySelected =
                      selectedClient?.id === client.id;
                    return (
                      <div
                        key={index}
                        className={cx(styles.card, {
                          [styles.selected]: isCurrentlySelected,
                        })}
                        onClick={() =>
                          setSelectedClient(isCurrentlySelected ? null : client)
                        }
                      >
                        <p className={styles.bigText}>
                          {`${client.user?.firstName} ${client.user?.lastName}`}
                        </p>
                        <p className={styles.smallText}>Client address</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <hr />
      <div className={styles.actions}>
        <Button
          className={styles.actionButton}
          type="secondary"
          onClick={scheduler.close}
        >
          Cancel
        </Button>
        <Button
          className={styles.actionButton}
          type="primary"
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};
