import { FC } from "react";
import Link from "next/link";

import { Premise } from "@/store/services/cookMaster/types";

import styles from "./PremiseCard.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  premise: Premise;
}

export const PremiseCard: FC<Props> = ({ premise }) => {
  const { t } = useTranslation();
  return (
    <Link className={styles.link} href={`/premises/${premise.id}`}>
      <div className={styles.container}>
        <div className={styles.title}>{`${t("premise")} n° ${premise.id}`}</div>
        <div>{`${t("city")}: ${premise.address.city} (${
          premise.address.country
        })`}</div>
      </div>
    </Link>
  );
};
