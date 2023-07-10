import { useGetAllPremisesQuery } from "@/store/services/cookMaster/api";
import styles from "./BrowsePremises.module.scss";
import { PremiseCard } from "@/components/premiseCard/PremiseCard";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export const BrowsePremises = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: premisesData } = useGetAllPremisesQuery();

  return (
    <div className={styles.container}>
      <h1>{t("premises")}</h1>
      <hr />
      <div className={styles.premisesList}>
        {premisesData?.map((premise, index) => (
          <PremiseCard key={index} premise={premise} />
        ))}
      </div>
      <div
        className={styles.createButton}
        onClick={() => router.push("/premises/new")}
      >
        +
      </div>
    </div>
  );
};
