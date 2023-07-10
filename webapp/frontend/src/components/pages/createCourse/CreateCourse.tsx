import { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { useCreateCourseMutation } from "@/store/services/cookMaster/api";
import { TextInput } from "@/components/textInput/TextInput";
import { Button } from "@/components/button/Button";
import { CreateCourseDto } from "@/store/services/cookMaster/course/dto";
import { RootState } from "@/store/store";

import styles from "./CreateCourse.module.scss";

export const CreateCourse: FC = () => {
  const router = useRouter();
  const contractorId = useSelector(
    (state: RootState) => state.user.userInfo?.contractorId
  );
  const [createCourse] = useCreateCourseMutation();

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

    if ("data" in result && result.data) {
      toast.success("Success creating course.");
      router.push(`/courses/${result.data.id}`);
    } else {
      toast.error("Could not create course.");
    }
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
        className={styles.input}
      />
      <TextInput
        type="text"
        value={newCourse.description}
        setValue={setCourseDescription}
        placeholder="Short description of the course"
        label="Course description"
        hideIcon
        className={styles.input}
      />
      <Button className={styles.submitButton} onClick={handleSubmit}>
        Create course
      </Button>
    </div>
  );
};
