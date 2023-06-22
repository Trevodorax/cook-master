import { FC, useEffect } from "react";

import {
  useApplyToCourseMutation,
  useGetClientsOfCourseQuery,
  useGetCourseByIdQuery,
  useGetLessonsOfCourseQuery,
  usePatchCourseMutation,
  useResignFromCourseMutation,
} from "@/store/services/cookMaster/api";
import { EditableField } from "@/components/editableField/EditableField";

import styles from "./Course.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import { LessonCard } from "@/components/lessonCard/LessonCard";
import Link from "next/link";
import { Button } from "@/components/button/Button";

interface Props {
  courseId: string;
}

export const Course: FC<Props> = ({ courseId }) => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  });

  const courseIdNumber = parseInt(courseId);
  if (isNaN(courseIdNumber)) {
    return <div>Invalid course id.</div>;
  }

  const [patchCourse] = usePatchCourseMutation();
  const [applyToCourse] = useApplyToCourseMutation();
  const [resignFromCourse] = useResignFromCourseMutation();

  const { data: courseData } = useGetCourseByIdQuery({
    courseId: courseIdNumber,
  });
  const { data: courseLessons } = useGetLessonsOfCourseQuery({
    courseId: courseIdNumber,
  });

  const { data: clientsInCourse } = useGetClientsOfCourseQuery({
    courseId: courseIdNumber,
  });

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
          {user?.userType === "contractor" &&
            user.contractorId === courseData.contractorId && (
              <Link
                href={`/courses/${courseId}/lesson/new`}
                className={styles.createButton}
              >
                +
              </Link>
            )}
          {courseLessons &&
            courseLessons.map((lesson, index) => (
              <LessonCard key={index} lesson={lesson} />
            ))}
        </div>
      </div>
    </div>
  );
};
