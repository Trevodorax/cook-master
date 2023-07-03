import {
  ProcessedEvent,
  SchedulerHelpers,
} from "@aldabil/react-scheduler/types";
import { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { formatEventForScheduler } from "./formatEventForScheduler";
import {
  useAddWorkshopToCourseMutation,
  useGetWorkshopsOfCourseQuery,
  usePatchEventMutation,
} from "@/store/services/cookMaster/api";

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

  const event = scheduler.edited;

  // Make your own form/state
  const [formState, setFormState] = useState({
    title: event?.title || "",
    description: event?.description || "",
    isOnline: event?.isOnline || false,
  });

  const createEvent = async () => {
    const startTime = scheduler.state.start.value;
    const endTime = scheduler.state.end.value;

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
    <div>
      <div style={{ padding: "1rem" }}>
        <p>Load your custom form/fields</p>
        <input
          type="text"
          value={formState.title}
          onChange={(e) => handleChange(e.target.value, "title")}
          placeholder="Title"
        />
        <input
          type="text"
          value={formState.description}
          onChange={(e) => handleChange(e.target.value, "description")}
          placeholder="Description"
        />
        <input
          type="checkbox"
          checked={formState.isOnline}
          onChange={(e) => handleChange(e.target.checked, "isOnline")}
        />
      </div>
      <button onClick={scheduler.close}>Cancel</button>
      <button onClick={handleSubmit}>Confirm</button>
    </div>
  );
};
