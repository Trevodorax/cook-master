import { FC } from "react";
import Link from "next/link";

import { Premise } from "@/store/services/cookMaster/types";

import styles from "./PremiseCard.module.scss";

interface Props {
  premise: Premise;
}

export const PremiseCard: FC<Props> = ({ premise }) => {
  return (
    <Link className={styles.link} href={`/premises/${premise.id}`}>
      <div className={styles.container}>
        <div className={styles.title}>{`Premise n° ${premise.id}`}</div>
        <div>{`City: ${premise.address.city} (${premise.address.country})`}</div>
      </div>
    </Link>
  );
};
