import { FC } from "react";
import cx from "classnames";

import { FollowingEye } from "@/components/followingEye/FollowingEye";
import { SubscriptionLevelIcon } from "../svgs";

import styles from "./CookmasterMascot.module.scss";

interface Props {
  className?: string;
  subscriptionLevel: number;
}

export const CookmasterMascot: FC<Props> = ({
  className,
  subscriptionLevel,
}) => {
  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.hat}>
        <SubscriptionLevelIcon subscriptionLevel={subscriptionLevel} />
      </div>
      <div className={styles.eyes}>
        <div className={styles.eye1}>
          <FollowingEye size={60} />
        </div>
        <div className={styles.eye2}>
          <FollowingEye size={60} />
        </div>
      </div>
    </div>
  );
};
