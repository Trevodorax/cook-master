import { UserPage } from "@/components/pages/userPage/UserPage";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  if (!router.query.userId || typeof router.query.userId !== "string") {
    return <div>Invalid user id</div>;
  }

  return <UserPage userId={router.query.userId} />;
}
