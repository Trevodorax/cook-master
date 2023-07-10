import { useTranslation } from "react-i18next";
import {
  atClientHomeEventColor,
  inPremiseEventColor,
  otherEventColor,
} from "../../utils/constants";
import styles from "./ColorLegend.module.scss";

export const ColorLegend = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.colorLegend}>
      <div className={styles.colorItem}>
        <div
          className={`${styles.colorBox}`}
          style={{ backgroundColor: inPremiseEventColor }}
        ></div>
        <div>{t("inPremise")}</div>
      </div>
      <div className={styles.colorItem}>
        <div
          className={`${styles.colorBox}`}
          style={{ backgroundColor: atClientHomeEventColor }}
        ></div>
        <div>{t("atClientHome")}</div>
      </div>
      <div className={styles.colorItem}>
        <div
          className={`${styles.colorBox}`}
          style={{ backgroundColor: otherEventColor }}
        ></div>
        <div>{t("other")}</div>
      </div>
    </div>
  );
};
