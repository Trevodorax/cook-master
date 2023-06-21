import Link from "next/link";
import cx from "classnames";

import { User } from "@/store/services/cookMaster/types";

import styles from "./UserCard.module.scss";

interface Props {
  user: User;
  className?: string;
}

export const UserCard = ({ user, className = "" }: Props) => {
  return (
    <Link className={styles.link} href={`/chat/${user.id}`}>
      <div className={cx(styles.container, className)}>
        {`${user.firstName} ${user.lastName}`}
      </div>
    </Link>
  );
};
