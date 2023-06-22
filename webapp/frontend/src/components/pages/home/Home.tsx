import React from "react";
import { useRouter } from "next/router";

import { Button } from "@/components/button/Button";

import styles from "./Home.module.scss";
import { WhiteBoardIcon } from "@/components/svgs/WhiteBoardIcon";
import { BookIcon } from "@/components/svgs";
import { PanIcon } from "@/components/svgs/PanIcon";

export default function Home() {
  const router = useRouter();

  const landingPageActions = [
    {
      verb: "Participate",
      title: "to cooking workshops",
      buttonText: "See events",
      description: "Learn how to cook from professionnals and experts",
      icon: <WhiteBoardIcon />,
    },
    {
      verb: "Read",
      title: "cooking lessons",
      buttonText: "Discover lessons",
      description: "Create a set of recipes and choose who can see them.",
      icon: <BookIcon />,
    },
    {
      verb: "Cook",
      title: "in our kitchens",
      buttonText: "Come in our kitchens",
      description:
        "Use profesionnal material to improve your skills and create beatuful recipes",
      icon: <PanIcon />,
    },
  ];

  return (
    <div className={styles.container}>
      <h1>
        Welcome to cook master in {process.env.NODE_ENV} with continuous
        deployment!
      </h1>
      <div className={styles.actions}>
        {landingPageActions.map((action, index) => (
          <div key={index} className={styles.action}>
            {action.icon}
            <h3>
              <span className={styles.verb}>{action.verb}</span>
              {action.title}
            </h3>
            <Button
              className={styles.actionButton}
              type="primary"
              onClick={() => router.push("/dashboard")}
            >
              {action.buttonText}
            </Button>
            <div className={styles.description}>{action.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
