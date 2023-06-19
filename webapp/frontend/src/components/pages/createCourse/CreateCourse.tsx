import { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import { useCreateCourseMutation } from "@/store/services/cookMaster/api";
import { TextInput } from "@/components/textInput/TextInput";
import { Button } from "@/components/button/Button";
import { CreateCourseDto } from "@/store/services/cookMaster/course/dto";
import { RootState } from "@/store/store";

import styles from "./CreateCourse.module.scss";
import { useRouter } from "next/router";
import { Course } from "@/store/services/cookMaster/types";

export const CreateCourse: FC = () => {
  const router = useRouter();
  const contractorId = useSelector(
    (state: RootState) => state.user.userInfo?.contractorId
  );
  const [createCourse] = useCreateCourseMutation();

  if (!contractorId) {
    toast.error("This page is for contractors.");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }

  const [newCourse, setNewCourse] = useState<CreateCourseDto>({
    name: "",
    description: "",
    contractorId: contractorId || 0,
  });

  const setCourseName = (value: string) =>
    setNewCourse((prev) => ({ ...prev, name: value }));

  const setCourseDescription = (value: string) =>
    setNewCourse((prev) => ({ ...prev, description: value }));

  const handleSubmit = async () => {
    const result = await createCourse(newCourse);

    // need "as" because ts won't let me test this fucking data prop otherwise
    if (!(result as { data: Course }).data) {
      toast.error("Could not create course.");
      return;
    }

    toast.success("Success creating course.");

    setTimeout(() => {
      router.push(`/course/${(result as { data: Course }).data.id}`); // "as" because I already tested the data prop but ts sucks
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <h1>Create a course</h1>
      <TextInput
        type="text"
        value={newCourse.name}
        setValue={setCourseName}
        placeholder="My amazing course"
        label="Course name"
        hideIcon
      />
      <TextInput
        type="text"
        value={newCourse.description}
        setValue={setCourseDescription}
        placeholder="Short description of the course"
        label="Course description"
        hideIcon
      />
      <Button onClick={handleSubmit}>Create course</Button>
    </div>
  );
};
