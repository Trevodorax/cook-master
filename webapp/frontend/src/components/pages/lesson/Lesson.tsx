import { FC, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import cx from "classnames";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import {
  useGetLessonByIdQuery,
  useGetLessonOfCourseAtIndexQuery,
  usePatchLessonMutation,
  useRequestNextCourseAccessMutation,
} from "@/store/services/cookMaster/api";
import { EditableField } from "@/components/editableField/EditableField";
import { RootState } from "@/store/store";
import { Button } from "@/components/button/Button";
import {
  LeftTriangleIcon,
  RightTriangleIcon,
  UnlockIcon,
} from "@/components/svgs";

import styles from "./Lesson.module.scss";

interface Props {
  lessonId: string;
}

export const Lesson: FC<Props> = ({ lessonId }) => {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  });

  const lessonIdNumber = parseInt(lessonId);
  if (isNaN(lessonIdNumber)) {
    return <div>Invalid lesson id.</div>;
  }

  const [patchLesson] = usePatchLessonMutation();
  const [requestNextCourseAccess] = useRequestNextCourseAccessMutation();
  const { data: lessonData } = useGetLessonByIdQuery({
    lessonId: lessonIdNumber,
  });

  const { data: previousLesson } = useGetLessonOfCourseAtIndexQuery({
    courseId: lessonData?.courseId || 0,
    lessonIndex: (lessonData?.index || 1) - 1,
  });

  const { data: nextLesson, refetch: refetchNextLesson } =
    useGetLessonOfCourseAtIndexQuery({
      courseId: lessonData?.courseId || 0,
      lessonIndex: (lessonData?.index || 1) + 1,
    });

  if (!lessonData) {
    return <div>Could not get lesson.</div>;
  }

  const handleNextLessonClick = async () => {
    console.log(nextLesson);
    if (nextLesson?.id) {
      router.push(`${nextLesson?.id}`);
      return;
    }

    if (nextLesson === -1) {
      const response = await requestNextCourseAccess({
        courseId: lessonData.courseId || 0,
      });
      if (response.data > 0) {
        toast.success("Unlocked next lesson");
        refetchNextLesson();
      }
    }
  };

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
        isEditable={user?.userType === "admin"}
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
        isEditable={user?.userType === "admin"}
      />
      <hr className={styles.separator} />
      <div className={styles.content}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lessonData.content}
        </ReactMarkdown>
      </div>
      <div className={styles.footer}>
        <Button
          className={cx(styles.navigationButton, {
            [styles.hidden]: !previousLesson,
          })}
          onClick={() => router.push(`${previousLesson?.id}`)}
        >
          <LeftTriangleIcon />
        </Button>
        <Button
          className={cx(styles.navigationButton, {
            [styles.hidden]: !nextLesson,
          })}
          onClick={handleNextLessonClick}
        >
          {nextLesson === -1 ? <UnlockIcon /> : <RightTriangleIcon />}
        </Button>
      </div>
    </div>
  );
};
