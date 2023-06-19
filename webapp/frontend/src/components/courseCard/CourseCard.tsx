import Link from "next/link";

import { Course } from "@/store/services/cookMaster/types";

import styles from "./CourseCard.module.scss";

interface Props {
  course: Course;
}

export const CourseCard = ({ course }: Props) => {
  return (
    <Link className={styles.link} href={`/course/${course.id}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{course.name}</div>
        </div>
        <div className={styles.body}>
          <div className={styles.description}>{course.description}</div>
        </div>
      </div>
    </Link>
  );
};
