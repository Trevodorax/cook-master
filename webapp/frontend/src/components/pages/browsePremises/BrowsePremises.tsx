import { useGetAllPremisesQuery } from "@/store/services/cookMaster/api";
import styles from "./BrowsePremises.module.scss";
import { PremiseCard } from "@/components/premiseCard/PremiseCard";
import { useRouter } from "next/router";

export const BrowsePremises = () => {
  const router = useRouter();

  const { data: premisesData } = useGetAllPremisesQuery();

  return (
    <div className={styles.container}>
      <h1>Premises</h1>
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
