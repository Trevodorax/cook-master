import { useRouter } from "next/router";

import { Event } from "@/components/pages/event/Event";

export default function Index() {
  const router = useRouter();

  let id = router.query.eventId;

  if (!id) {
    return <div>Event not found</div>;
  }

  if (Array.isArray(id)) {
    id = id[0];
  }

  return <Event eventId={id} />;
}
