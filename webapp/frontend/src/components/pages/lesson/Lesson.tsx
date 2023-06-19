import { FC } from "react";

import {
  useGetLessonByIdQuery,
  usePatchLessonMutation,
} from "@/store/services/cookMaster/api";
import { EditableField } from "@/components/editableField/EditableField";

import styles from "./Lesson.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";

interface Props {
  lessonId: string;
}

export const Lesson: FC<Props> = ({ lessonId }) => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user.userInfo);
  if (!user) {
    router.push("/login");
  }

  const lessonIdNumber = parseInt(lessonId);
  if (isNaN(lessonIdNumber)) {
    return <div>Invalid lesson id.</div>;
  }

  const [patchLesson] = usePatchLessonMutation();
  const { data: lessonData } = useGetLessonByIdQuery({
    lessonId: lessonIdNumber,
  });

  if (!lessonData) {
    return <div>Could not get lesson.</div>;
  }

  return (
    <div className={styles.container}>
      <EditableField
        type="text"
        initialValue={<h1>{lessonData.name}</h1>}
        mutateValue={(value: string) => {
          patchLesson({
            dto: { lessonId: lessonIdNumber },
            patchLessonDto: {
              name: value,
            },
          });
        }}
        isEditable={
          user?.contractorId === lessonData.contractorId ||
          user?.userType === "admin"
        }
      />
      <EditableField
        type="text"
        initialValue={<p>{lessonData.description}</p>}
        mutateValue={(value: string) => {
          patchLesson({
            dto: { lessonId: lessonIdNumber },
            patchLessonDto: {
              description: value,
            },
          });
        }}
        isEditable={
          user?.contractorId === lessonData.contractorId ||
          user?.userType === "admin"
        }
      />
    </div>
  );
};
