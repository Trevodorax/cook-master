import { useRouter } from "next/router";

import { CreateLesson } from "@/components/pages/createLesson/CreateLesson";

export default function Index() {
  const router = useRouter();

  let id = router.query.courseId;

  if (!id) {
    return <div>Course not found</div>;
  }

  if (Array.isArray(id)) {
    id = id[0];
  }

  const idNumber = parseInt(id);

  if (isNaN(idNumber)) {
    return <div>Invalid id.</div>;
  }

  return <CreateLesson courseId={idNumber} />;
}
