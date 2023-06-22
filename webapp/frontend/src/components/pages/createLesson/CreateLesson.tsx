import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

import { RootState } from "@/store/store";
import { useCreateLessonMutation } from "@/store/services/cookMaster/api";
import { Lesson } from "@/store/services/cookMaster/types";
import { CreateLessonDto } from "@/store/services/cookMaster/lesson/dto";
import { TextInput } from "@/components/textInput/TextInput";
import { Button } from "@/components/button/Button";

import styles from "./CreateLesson.module.scss";

interface Props {
  courseId: number;
}

export const CreateLesson: FC<Props> = ({ courseId }) => {
  const router = useRouter();
  const contractorId = useSelector(
    (state: RootState) => state.user.userInfo?.contractorId
  );
  const [createLesson] = useCreateLessonMutation();

  const mdParser = new MarkdownIt();

  useEffect(() => {
    if (!contractorId) {
      toast.error("This page is for contractors.");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }
  });

  const [newLesson, setNewLesson] = useState<CreateLessonDto>({
    name: "",
    description: "",
    content: "",
    courseId: courseId,
  });

  const setLessonName = (value: string) =>
    setNewLesson((prev) => ({ ...prev, name: value }));

  const setLessonDescription = (value: string) =>
    setNewLesson((prev) => ({ ...prev, description: value }));

  function handleEditorChange({ text }: { text: string }) {
    setNewLesson((prev) => ({ ...prev, content: text }));
  }

  const handleSubmit = async () => {
    const result = await createLesson(newLesson);

    // need "as" because ts won't let me test this fucking data prop otherwise
    if (!(result as { data: Lesson }).data) {
      toast.error("Could not create lesson.");
      return;
    }

    toast.success("Success creating lesson.");

    setTimeout(() => {
      router.push(`/lesson/${(result as { data: Lesson }).data.id}`); // "as" because I already tested the data prop but ts sucks
    }, 500);
  };

  return (
    <div className={styles.container}>
      <h1>Create a lesson</h1>
      <TextInput
        type="text"
        value={newLesson.name}
        setValue={setLessonName}
        placeholder="My amazing lesson"
        label="Lesson name"
        hideIcon
        className={styles.textInput}
      />
      <TextInput
        type="text"
        value={newLesson.description}
        setValue={setLessonDescription}
        placeholder="Short description of the lesson"
        label="Lesson description"
        hideIcon
        className={styles.textInput}
      />
      <div className={styles.contentInput}>
        <h2>Content</h2>
        <MdEditor
          style={{ height: "500px" }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
        />
      </div>
      <Button onClick={handleSubmit}>Create lesson</Button>
    </div>
  );
};
