import React, { useRef, useEffect, FC } from "react";
import styles from "./FollowingEye.module.scss";

interface Props {
  size: number;
}

export const FollowingEye: FC<Props> = ({ size }) => {
  const eyeBallRef = useRef<SVGCircleElement>(null);
  const pupilRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const eyeBall = eyeBallRef.current;
    const pupil = pupilRef.current;

    if (!eyeBall || !pupil) return;

    // some internet math code for the pupil position
    const eyeArea = eyeBall.getBoundingClientRect();
    const pupilArea = pupil.getBoundingClientRect();
    const R = eyeArea.width / 2;
    const r = pupilArea.width / 2;
    const centerX = eyeArea.left + R;
    const centerY = eyeArea.top + R;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      const theta = Math.atan2(y, x);
      const angle = (theta * 180) / Math.PI + 360;

      if (pupil.style) {
        pupil.style.transform = `translateX(${R - r}px) rotate(${angle}deg)`;
        pupil.style.transformOrigin = `${r}px center`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <svg style={{ height: size }} className={styles.eye}>
      <circle
        ref={eyeBallRef}
        cx={size / 2}
        cy={size / 2}
        r={size / 2}
        fill="white"
        className={styles.eyeball}
      />
      <circle
        ref={pupilRef}
        cx={size / 2}
        cy={size / 2}
        r={size / 4}
        fill="#0D0D20"
        className={styles.pupil}
      />
    </svg>
  );
};
