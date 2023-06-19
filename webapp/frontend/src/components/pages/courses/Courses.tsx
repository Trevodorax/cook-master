import Link from "next/link";
import { useSelector } from "react-redux";

import { useGetMyCoursesContractorQuery } from "@/store/services/cookMaster/api";
import { RootState } from "@/store/store";
import { CourseCard } from "@/components/courseCard/CourseCard";

import styles from "./Courses.module.scss";

export const Courses = () => {
  const userType = useSelector(
    (state: RootState) => state.user.userInfo?.userType
  );
  const { data: contractorCourses } = useGetMyCoursesContractorQuery(
    undefined,
    {
      skip: userType !== "contractor",
    }
  );

  return (
    <div className={styles.container}>
      <Link href="/course/new">Create a course</Link>
      <h2>My courses</h2>
      <div className={styles.courseList}>
        {contractorCourses &&
          contractorCourses.map((course) => <CourseCard course={course} />)}
      </div>
    </div>
  );
};
