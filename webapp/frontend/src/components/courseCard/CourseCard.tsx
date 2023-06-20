import Link from "next/link";
import cx from "classnames";

import { Course } from "@/store/services/cookMaster/types";

import styles from "./CourseCard.module.scss";

interface Props {
  course: Course;
  className?: string;
}

export const CourseCard = ({ course, className = "" }: Props) => {
  return (
    <Link className={styles.link} href={`/courses/${course.id}`}>
      <div className={cx(styles.container, className)}>
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
