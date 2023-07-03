import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Scheduler } from "@aldabil/react-scheduler";

import {
  useApplyToCourseMutation,
  useDeleteEventMutation,
  useGetClientsOfCourseQuery,
  useGetCourseByIdQuery,
  useGetLessonsOfCourseQuery,
  useGetMyProgressInCourseQuery,
  useGetWorkshopsOfCourseQuery,
  usePatchCourseMutation,
  usePatchEventMutation,
  useResignFromCourseMutation,
} from "@/store/services/cookMaster/api";
import { EditableField } from "@/components/editableField/EditableField";
import { RootState } from "@/store/store";
import { LessonCard } from "@/components/lessonCard/LessonCard";
import { Button } from "@/components/button/Button";

import { formatEventForScheduler } from "./utils";
import styles from "./Course.module.scss";
import { PlanningEditor } from "./utils/PlanningEditor";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { toast } from "react-hot-toast";

interface Props {
  courseId: string;
}

export const Course: FC<Props> = ({ courseId }) => {
  const user = useSelector((state: RootState) => state.user.userInfo);

  const courseIdNumber = parseInt(courseId);
  if (isNaN(courseIdNumber)) {
    return <div>Invalid course id.</div>;
  }

  const [patchCourse] = usePatchCourseMutation();
  const [applyToCourse] = useApplyToCourseMutation();
  const [resignFromCourse] = useResignFromCourseMutation();
  const [patchEvent] = usePatchEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const { data: courseData } = useGetCourseByIdQuery({
    courseId: courseIdNumber,
  });

  const { data: courseLessons, refetch: refetchLessons } =
    useGetLessonsOfCourseQuery({
      courseId: courseIdNumber,
    });

  const { data: courseWorkshops, refetch: refetchWorkshops } =
    useGetWorkshopsOfCourseQuery({
      courseId: courseIdNumber,
    });

  const { data: clientsInCourse } = useGetClientsOfCourseQuery({
    courseId: courseIdNumber,
  });

  const { data: progressInCourse } =
    useGetMyProgressInCourseQuery(courseIdNumber);

  useEffect(() => {
    refetchLessons();
  }, []);

  if (!courseData) {
    return <div>Could not get course.</div>;
  }

  const isUserInCourse = clientsInCourse?.some(
    (client) => client.id === user?.clientId
  );

  const handleEventDrop = async (droppedOn: Date, event: ProcessedEvent) => {
    const modifiedWorkshop = await patchEvent({
      id: event.event_id.toString(),
      data: {
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
      toast.error("Error moving event");
      return event;
    }
  };

  const handleEventDelete = async (deletedId: number) => {
    const deletedEvent = await deleteEvent(deletedId.toString());
    if ("data" in deletedEvent && deletedEvent.data) {
      refetchWorkshops();
      return deletedEvent.data.id;
    } else {
      toast.error("Error deleting event");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.courseName}>
        <EditableField
          type="text"
          initialValue={<h1>{courseData.name}</h1>}
          mutateValue={(value: string) => {
            patchCourse({
              dto: { courseId: courseIdNumber },
              patchCourseDto: {
                name: value,
              },
            });
          }}
          isEditable={
            user?.contractorId === courseData.contractorId ||
            user?.userType === "admin"
          }
        />
        {user?.userType === "client" && (
          <div>
            {isUserInCourse ? (
              <Button
                type="error"
                onClick={() =>
                  resignFromCourse({ courseId: parseInt(courseId) })
                }
              >
                Remove from favorites
              </Button>
            ) : (
              <Button
                onClick={() => applyToCourse({ courseId: parseInt(courseId) })}
              >
                Add to favorites
              </Button>
            )}
          </div>
        )}
      </div>
      <EditableField
        type="text"
        initialValue={<p>{courseData.description}</p>}
        mutateValue={(value: string) => {
          patchCourse({
            dto: { courseId: courseIdNumber },
            patchCourseDto: {
              description: value,
            },
          });
        }}
        isEditable={
          user?.contractorId === courseData.contractorId ||
          user?.userType === "admin"
        }
      />
      <div className={styles.lessons}>
        <h2>Lessons</h2>
        <div className={styles.lessonList}>
          {courseLessons &&
            courseLessons.map((lesson, index) => (
              <LessonCard
                key={index}
                lesson={lesson}
                isLocked={
                  user?.clientId ? index + 1 > (progressInCourse || 0) : false
                }
              />
            ))}
          {user?.userType === "contractor" &&
            user.contractorId === courseData.contractorId && (
              <Link
                href={`/courses/${courseId}/lesson/new`}
                className={styles.createButton}
              >
                +
              </Link>
            )}
        </div>
      </div>
      <div className={styles.workshops}>
        <h2>Workshops</h2>
        <div className={styles.workshopList}>
          {courseWorkshops && (
            <>
              <Scheduler
                day={{
                  startHour: 7,
                  endHour: 19,
                  step: 30,
                  navigation: true,
                }}
                week={{
                  weekDays: [0, 1, 2, 3, 4, 5, 6],
                  weekStartOn: 1,
                  startHour: 7,
                  endHour: 19,
                  step: 30,
                }}
                hourFormat="24"
                editable={courseData.contractorId === user?.contractor?.id}
                customEditor={(scheduler) => (
                  <PlanningEditor
                    scheduler={scheduler}
                    courseId={courseIdNumber}
                  />
                )}
                viewerExtraComponent={(fields, event) => {
                  return (
                    <div>
                      {event.isOnline && <p>Online</p>}
                      <p>
                        Description: {event.description || "No description"}
                      </p>
                    </div>
                  );
                }}
                events={courseWorkshops?.map((workshop) => {
                  const isEditable =
                    courseData.contractorId === user?.contractor?.id;

                  const formattedWorkshop = formatEventForScheduler(workshop);

                  formattedWorkshop.draggable = isEditable;
                  formattedWorkshop.deletable = isEditable;
                  formattedWorkshop.editable = isEditable;

                  return formattedWorkshop;
                })}
                onEventDrop={handleEventDrop}
                onDelete={handleEventDelete}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
