import { useState } from "react";

import { useGetAllCoursesQuery } from "@/store/services/cookMaster/api";
import { TextInput } from "@/components/textInput/TextInput";

import styles from "./BrowseCourses.module.scss";
import { CourseCard } from "@/components/courseCard/CourseCard";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/router";

export const BrowseCourses = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({ day: "", term: "" });

  const { data: courses } = useGetAllCoursesQuery({ filters: filters });

  return (
    <div className={styles.container}>
      <h1>Browse courses</h1>
      <div className={styles.filters}>
        <TextInput
          type="text"
          value={filters.term}
          setValue={(value) => {
            setFilters((prev) => ({ ...prev, term: value }));
          }}
          label="Search"
          hideIcon
        />
        <Button
          type="secondary"
          className={styles.myCoursesButton}
          onClick={() => router.push("/courses/my")}
        >
          See my courses
        </Button>
      </div>
      <hr className={styles.separator} />
      <div className={styles.courses}>
        {courses &&
          courses.map((course, index) => (
            <CourseCard
              className={styles.courseCard}
              key={index}
              course={course}
            />
          ))}
      </div>
    </div>
  );
};
