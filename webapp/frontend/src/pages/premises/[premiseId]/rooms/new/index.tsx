import { useRouter } from "next/router";

import { CreateRoom } from "@/components/pages/createRoom/CreateRoom";

export default function Index() {
  const router = useRouter();

  let id = router.query.premiseId;

  if (!id) {
    return <div>Course not found</div>;
  }

  if (Array.isArray(id)) {
    id = id[0];
  }

  return <CreateRoom premiseId={Number(id)} />;
}
