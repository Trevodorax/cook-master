import Link from "next/link";

import { Lesson } from "@/store/services/cookMaster/types";

import styles from "./LessonCard.module.scss";

interface Props {
  lesson: Lesson;
}

export const LessonCard = ({ lesson }: Props) => {
  return (
    <Link className={styles.link} href={`/lesson/${lesson.id}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{lesson.name}</div>
        </div>
        <div className={styles.body}>
          <div className={styles.description}>{lesson.description}</div>
        </div>
      </div>
    </Link>
  );
};
