import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  return <div>{router.query.eventId}</div>;
}
