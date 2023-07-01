import Link from "next/link";
import cx from "classnames";

import { Lesson } from "@/store/services/cookMaster/types";

import styles from "./LessonCard.module.scss";

interface Props {
  lesson: Lesson;
  isLocked: boolean;
}

export const LessonCard = ({ lesson, isLocked }: Props) => {
  return (
    <Link
      className={styles.link}
      href={isLocked ? "#" : `/lesson/${lesson.id}`}
    >
      <div className={cx(styles.container, { [styles.locked]: isLocked })}>
        <div className={styles.title}>{lesson.name}</div>
      </div>
    </Link>
  );
};
