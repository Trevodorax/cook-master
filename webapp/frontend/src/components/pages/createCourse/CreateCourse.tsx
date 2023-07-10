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
import { useTranslation } from "react-i18next";

export const CreateCourse: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
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
      toast.success(t("successCreatingCourse"));
      router.push(`/courses/${result.data.id}`);
    } else {
      toast.error(t("errorCreatingCourse"));
    }
  };

  return (
    <div className={styles.container}>
      <h1>{t("createACourse")}</h1>
      <TextInput
        type="text"
        value={newCourse.name}
        setValue={setCourseName}
        placeholder={t("courseNamePlaceholder")}
        label={t("courseNameLabel")}
        hideIcon
        className={styles.input}
      />
      <TextInput
        type="text"
        value={newCourse.description}
        setValue={setCourseDescription}
        placeholder={t("courseDescriptionPlaceholder")}
        label={t("courseDescriptionLabel")}
        hideIcon
        className={styles.input}
      />
      <Button className={styles.submitButton} onClick={handleSubmit}>
        {t("createCourse")}
      </Button>
    </div>
  );
};
