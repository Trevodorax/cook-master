import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { toast } from "react-hot-toast";

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
import { PlanningEditor } from "./components/planningEditor/PlanningEditor";
import styles from "./Course.module.scss";
import { PlanningEvent } from "./components/planningEvent/PlanningEvent";
import { ColorLegend } from "./components/colorLegend/ColorLegend";
import { useTranslation } from "react-i18next";

interface Props {
  courseId: string;
}

export const Course: FC<Props> = ({ courseId }) => {
  const { t } = useTranslation();
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

  const { data: progressInCourse, refetch: refetchProgressInCourse } =
    useGetMyProgressInCourseQuery(courseIdNumber);

  useEffect(() => {
    refetchLessons();
  }, []);

  const canUserEdit =
    !!user?.admin || user?.contractorId === courseData?.contractorId;

  if (!courseData) {
    return <div>Could not get course.</div>;
  }

  const isUserInCourse = clientsInCourse?.some(
    (client) => client.id === user?.clientId
  );

  const handleEventDrop = async (droppedOn: Date, event: ProcessedEvent) => {
    if (!canUserEdit) {
      return event;
    }

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
    if (!canUserEdit) {
      return;
    }

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
                {t("removeFromFavorites")}
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  await applyToCourse({
                    courseId: parseInt(courseId),
                  }).unwrap();
                  refetchProgressInCourse();
                }}
              >
                {t("addToFavorites")}
              </Button>
            )}
          </div>
        )}
      </div>
      <div className={styles.description}>
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
      </div>
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
        <ColorLegend />
        <div className={styles.schedule}>
          {courseWorkshops && (
            <>
              <Scheduler
                day={{
                  startHour: 0,
                  endHour: 24,
                  step: 30,
                  navigation: true,
                }}
                week={{
                  weekDays: [0, 1, 2, 3, 4, 5, 6],
                  weekStartOn: 1,
                  startHour: 0,
                  endHour: 24,
                  step: 30,
                }}
                hourFormat="24"
                editable={courseData.contractorId === user?.contractor?.id}
                customEditor={(scheduler) => (
                  <PlanningEditor
                    scheduler={scheduler}
                    courseId={courseIdNumber}
                    canUserEdit={canUserEdit}
                  />
                )}
                viewerExtraComponent={PlanningEvent}
                events={courseWorkshops
                  ?.map((workshop) => {
                    // make sure at home events are visible only for one client and the contractor
                    if (
                      workshop?.atHomeClientId &&
                      workshop.atHomeClientId !== user?.clientId &&
                      courseData.contractorId !== user?.contractorId
                    ) {
                      return null as unknown as ProcessedEvent;
                    }

                    const formattedWorkshop = formatEventForScheduler(workshop);

                    formattedWorkshop.draggable = canUserEdit;
                    formattedWorkshop.deletable = canUserEdit;
                    formattedWorkshop.editable = canUserEdit;

                    return formattedWorkshop;
                  })
                  .filter((event) => event !== null)}
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
