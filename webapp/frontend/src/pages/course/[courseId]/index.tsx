import { useRouter } from "next/router";

import { Course } from "@/components/pages/course/Course";

export default function Index() {
  const router = useRouter();

  let id = router.query.courseId;

  if (!id) {
    return <div>Course not found</div>;
  }

  if (Array.isArray(id)) {
    id = id[0];
  }

  return <Course courseId={id} />;
}
