import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Scheduler } from "@aldabil/react-scheduler";
import { toast } from "react-hot-toast";

import {
  useAddWorkshopToCourseMutation,
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
  const [addWorkshopToCourse] = useAddWorkshopToCourseMutation();
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
                onDelete={async (deletedId) => {
                  const deletedEvent = await deleteEvent(deletedId.toString());
                  if ("data" in deletedEvent && deletedEvent.data) {
                    refetchWorkshops();
                    return deletedEvent.data.id;
                  } else {
                    toast.error("Error deleting event");
                  }
                }}
                onConfirm={async (event, action) => {
                  switch (action) {
                    case "create":
                      const createdWorkshop = await addWorkshopToCourse({
                        courseId: courseIdNumber,
                        workshop: {
                          name: event.title,
                          type: "workshop",
                          startTime: event.start,
                          durationMin: Math.floor(
                            (event.end.getTime() - event.start.getTime()) /
                              (1000 * 60)
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

                    case "edit":
                      const modifiedWorkshop = await patchEvent({
                        id: event.event_id.toString(),
                        data: {
                          name: event.title,
                          startTime: event.start,
                          durationMin: Math.floor(
                            (event.end.getTime() - event.start.getTime()) /
                              (1000 * 60)
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
                  }
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
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
