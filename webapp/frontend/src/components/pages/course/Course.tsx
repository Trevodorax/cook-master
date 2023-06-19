import { FC } from "react";

import {
  useGetCourseByIdQuery,
  useGetLessonsOfCourseQuery,
  usePatchCourseMutation,
} from "@/store/services/cookMaster/api";
import { EditableField } from "@/components/editableField/EditableField";

import styles from "./Course.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import { LessonCard } from "@/components/lessonCard/LessonCard";
import Link from "next/link";

interface Props {
  courseId: string;
}

export const Course: FC<Props> = ({ courseId }) => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user.userInfo);
  if (!user) {
    router.push("/login");
  }

  const courseIdNumber = parseInt(courseId);
  if (isNaN(courseIdNumber)) {
    return <div>Invalid course id.</div>;
  }

  const [patchCourse] = usePatchCourseMutation();
  const { data: courseData } = useGetCourseByIdQuery({
    courseId: courseIdNumber,
  });
  const { data: courseLessons } = useGetLessonsOfCourseQuery({
    courseId: courseIdNumber,
  });

  if (!courseData) {
    return <div>Could not get course.</div>;
  }

  return (
    <div className={styles.container}>
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
        <Link href={`/course/${courseId}/lesson/new`}>Add a lesson</Link>
        <div className={styles.lessonList}>
          {!courseLessons && <div>Loading...</div>}
          {courseLessons &&
            courseLessons.map((lesson, index) => (
              <LessonCard key={index} lesson={lesson} />
            ))}
        </div>
      </div>
    </div>
  );
};
