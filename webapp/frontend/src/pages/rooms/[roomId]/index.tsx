import { Room } from "@/components/pages/room/Room";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  let id = router.query.roomId;

  if (!id) {
    return <div>Course not found</div>;
  }

  if (Array.isArray(id)) {
    id = id[0];
  }

  return <Room roomId={Number(id)} />;
}
