import { FC } from "react";
import cx from "classnames";
import styles from "./Map.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  longitude: number | null;
  latitude: number | null;
  noAddress: boolean;
  className?: string;
}

export const Map: FC<Props> = ({
  longitude,
  latitude,
  noAddress,
  className = "",
}) => {
  const { t } = useTranslation();
  return (
    <div className={cx(styles.container, className)}>
      {noAddress ? (
        <h3>{t("noAddress")}</h3>
      ) : (
        <img
          width="100%"
          height="100%"
          src={
            longitude && longitude
              ? `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:${longitude},${latitude}&zoom=14&marker=lonlat:${longitude},${latitude};color:%23ff0000;size:medium&apiKey=ea8a087753e7459db01961339e904bd6`
              : "https://t4.ftcdn.net/jpg/03/28/89/61/360_F_328896165_i0TWGgJTtDWyIjKhYKcAUoA0rKiXYyx6.jpg"
          }
          alt="Address"
        />
      )}
    </div>
  );
};
