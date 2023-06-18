import { FC } from "react";
import cx from "classnames";

import { NoIcon, YesIcon } from "@/components/svgs";
import { CookMasterSubscription } from "@/components/pages/subscriptionBooking/utils/subscriptionTypes";

import styles from "./SubscriptionCard.module.scss";

interface Props {
  isSelected: boolean;
  onClick: () => void;
  subscription: CookMasterSubscription;
}

export const SubscriptionCard: FC<Props> = ({
  isSelected,
  subscription,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cx(styles.container, { [styles.selected]: isSelected })}
    >
      <h3 className={styles.title}>{subscription.displayedName}</h3>
      <table className={styles.benefits}>
        <tbody>
          {Object.entries(subscription.benefits).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value ? <YesIcon /> : <NoIcon />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
