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
import { useTranslation } from "react-i18next";

interface Props {
  scheduler: SchedulerHelpers;
  courseId: number;
  canUserEdit: boolean;
}

export const PlanningEditor: FC<Props> = ({
  scheduler,
  courseId,
  canUserEdit,
}) => {
  const { t } = useTranslation();
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

  // dealing with timezone issues, this is broken outside of my timezone but fuck it the deadline is near
  const initialEventEndDate = scheduler.state.end.value;
  initialEventEndDate.setHours(initialEventEndDate.getHours() + 2);

  const [formState, setFormState] = useState({
    title: event?.title || "",
    description: event?.description || "",
    isOnline: event?.isOnline || false,
    endTime: initialEventEndDate.toISOString().slice(0, 16),
  });

  const [selectedPremise, setSelectedPremise] = useState<Premise | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [place, setPlace] = useState(
    event?.atHomeClientId
      ? t("atClientHome")
      : event?.roomId
      ? t("inPremise")
      : t("select")
  );

  if (!canUserEdit) {
    setTimeout(scheduler.close, 0);
  }

  const createEvent = async () => {
    if (!canUserEdit) {
      return event;
    }

    const startTime = scheduler.state.start.value;

    if (!formState.isOnline && !selectedClient && !selectedRoom) {
      toast.error(t("errorIncompleteInformation"));
      return event;
    }

    const createdWorkshop = await addWorkshopToCourse({
      courseId: courseId,
      workshop: {
        name: formState.title,
        description: formState.description,
        isOnline: formState.isOnline,
        type: "workshop",
        startTime: startTime,
        durationMin: 30,
        roomId: selectedRoom?.id || null,
        atHomeClientId: selectedClient?.id || null,
      },
    });

    refetchWorkshops();

    if ("data" in createdWorkshop && createdWorkshop.data) {
      return formatEventForScheduler(createdWorkshop.data);
    } else {
      toast.error(t("errorCreatingEvent"));
      return event;
    }
  };

  const editEvent = async (event: ProcessedEvent) => {
    if (!canUserEdit) {
      return event;
    }

    if (!formState.isOnline && !selectedClient && !selectedRoom) {
      toast.error(t("errorIncompleteInformation"));
      return event;
    }

    const startTime = event.start.getTime();
    const endTime = new Date(formState.endTime || "").getTime();

    if (endTime < startTime) {
      toast.error(t("errorEndBeforeStart"));
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
          (new Date(formState.endTime || event.end).getTime() -
            event.start.getTime()) /
            (1000 * 60)
        ),
        roomId: selectedRoom?.id || null,
        atHomeClientId: selectedClient?.id || null,
      },
    });

    refetchWorkshops();

    if ("data" in modifiedWorkshop && modifiedWorkshop.data) {
      return formatEventForScheduler(modifiedWorkshop.data);
    } else {
      toast.error(t("errorEditEvent"));
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
        <h2>{event ? t("editing") : t("creating")} workshop</h2>
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
        {event && (
          <div className={styles.endTimeZone}>
            <label>End time</label>
            <input
              type={"datetime-local"}
              value={formState.endTime}
              onChange={(event) => handleChange(event.target.value, "endTime")}
              className={styles.endTimeInput}
            />
          </div>
        )}
        <h3>{t("whereWillItHappen")}</h3>
        <div className={styles.isOnlineSection}>
          <p>{t("online")}</p>
          <SwitchInput
            isChecked={formState.isOnline}
            setIsChecked={(isChecked) => handleChange(isChecked, "isOnline")}
          />
        </div>
        {!formState.isOnline && (
          <div>
            <SelectInput
              className={styles.placeSelector}
              options={[t("select"), t("inPremise"), t("atClientHome")]}
              value={place}
              setValue={setPlace}
            />

            {place === t("inPremise") && (
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
                    <h4>{t("chooseARoom")}</h4>
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
                              {`${t("room")} n°${room.id}`}
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
            {place === t("atClientHome") && (
              <div>
                <h4>{t("chooseClient")}</h4>
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
          {t("cancel")}
        </Button>
        <Button
          className={styles.actionButton}
          type="primary"
          onClick={handleSubmit}
        >
          {t("confirm")}
        </Button>
      </div>
    </div>
  );
};
