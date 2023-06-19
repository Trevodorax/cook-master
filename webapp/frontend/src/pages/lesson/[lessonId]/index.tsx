import { useRouter } from "next/router";

import { Lesson } from "@/components/pages/lesson/Lesson";

export default function Index() {
  const router = useRouter();

  let id = router.query.lessonId;

  if (!id) {
    return <div>Course not found</div>;
  }

  if (Array.isArray(id)) {
    id = id[0];
  }

  return <Lesson lessonId={id} />;
}
