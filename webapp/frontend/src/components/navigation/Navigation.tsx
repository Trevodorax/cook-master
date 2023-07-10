import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTranslation } from "react-i18next";

interface Props {
  containerClassname: string;
  itemsClassname: string;
}

export default function Navigation({
  containerClassname,
  itemsClassname,
}: Props) {
  const { t } = useTranslation();

  const token = useSelector((state: RootState) => state.user.token);
  const navigationItems = [
    {
      address: "/",
      displayedName: t("home"),
    },
    {
      address: token ? "/logout" : "/login",
      displayedName: token ? t("logout") : t("login"),
    },
    {
      address: "/dashboard",
      displayedName: t("dashboard"),
    },
  ];

  return (
    <div className={containerClassname}>
      {navigationItems.map((route, index) => {
        return (
          <Link href={route.address} key={index}>
            <div className={itemsClassname}>{route.displayedName}</div>
          </Link>
        );
      })}
    </div>
  );
}
