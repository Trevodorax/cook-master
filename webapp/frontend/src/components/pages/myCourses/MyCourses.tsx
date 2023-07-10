import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  useGetMyCoursesClientQuery,
  useGetMyCoursesContractorQuery,
} from "@/store/services/cookMaster/api";
import { RootState } from "@/store/store";
import { CourseCard } from "@/components/courseCard/CourseCard";
import { Button } from "@/components/button/Button";

import styles from "./MyCourses.module.scss";

export const MyCourses = () => {
  const router = useRouter();
  const userType = useSelector(
    (state: RootState) => state.user.userInfo?.userType
  );
  const { data: contractorCourses } = useGetMyCoursesContractorQuery(
    undefined,
    {
      skip: userType !== "contractor",
    }
  );

  const { data: clientCourses } = useGetMyCoursesClientQuery(undefined, {
    skip: userType !== "client",
  });

  const myCourses =
    userType === "contractor"
      ? contractorCourses
      : userType === "client"
      ? clientCourses
      : [];

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>My courses</h2>
        {userType === "client" && (
          <div>
            <Button
              type="secondary"
              onClick={() => router.push("/courses/browse")}
            >
              Find courses
            </Button>
          </div>
        )}
      </div>

      <div className={styles.courseList}>
        {userType === "contractor" && (
          <Link href="/courses/new" className={styles.createButton}>
            +
          </Link>
        )}
        {myCourses &&
          myCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
      </div>
    </div>
  );
};
