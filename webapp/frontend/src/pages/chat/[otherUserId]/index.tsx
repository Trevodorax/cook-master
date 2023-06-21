import { Conversation } from "@/components/pages/conversation/Conversation";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  let id = router.query.otherUserId;

  if (!id) {
    return <div>Other user not found</div>;
  }

  if (Array.isArray(id)) {
    id = id[0];
  }

  const idNumber = parseInt(id);
  if (isNaN(idNumber)) {
    return <div>Invalid other user id</div>;
  }

  return <Conversation otherUserId={idNumber} />;
}
