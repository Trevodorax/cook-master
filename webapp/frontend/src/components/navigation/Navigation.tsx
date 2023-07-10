import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Props {
  containerClassname: string;
  itemsClassname: string;
}

export default function Navigation({
  containerClassname,
  itemsClassname,
}: Props) {
  const token = useSelector((state: RootState) => state.user.token);
  const navigationItems = [
    {
      address: "/",
      displayedName: "Home",
    },
    {
      address: token ? "/logout" : "/login",
      displayedName: token ? "Log out" : "Log in",
    },
    {
      address: "/dashboard",
      displayedName: "Dashboard",
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
