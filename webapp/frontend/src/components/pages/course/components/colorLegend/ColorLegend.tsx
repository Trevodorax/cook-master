import {
  atClientHomeEventColor,
  inPremiseEventColor,
  otherEventColor,
} from "../../utils/constants";
import styles from "./ColorLegend.module.scss";

export const ColorLegend = () => (
  <div className={styles.colorLegend}>
    <div className={styles.colorItem}>
      <div
        className={`${styles.colorBox}`}
        style={{ backgroundColor: inPremiseEventColor }}
      ></div>
      <div>In premise</div>
    </div>
    <div className={styles.colorItem}>
      <div
        className={`${styles.colorBox}`}
        style={{ backgroundColor: atClientHomeEventColor }}
      ></div>
      <div>At client's home</div>
    </div>
    <div className={styles.colorItem}>
      <div
        className={`${styles.colorBox}`}
        style={{ backgroundColor: otherEventColor }}
      ></div>
      <div>Other</div>
    </div>
  </div>
);
