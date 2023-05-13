import React from "react";
import Link from "next/link";

interface Props {
  containerClassname: string;
  itemsClassname: string;
}

export default function Navigation({
  containerClassname,
  itemsClassname,
}: Props) {
  const navigationItems = [
    {
      address: "/",
      displayedName: "Home",
    },
    {
      address: "/login",
      displayedName: "Login",
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
