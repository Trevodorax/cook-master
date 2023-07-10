import { FC } from "react";
import cx from "classnames";

import styles from "./Loader.module.scss";

interface Props {
  className?: string;
}

export const Loader: FC<Props> = ({ className = "" }) => {
  return <div className={cx(styles.loader, className)}></div>;
};
