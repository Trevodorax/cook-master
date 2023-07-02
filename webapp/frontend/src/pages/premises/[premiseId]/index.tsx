import { Premise } from "@/components/pages/premise/Premise";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  let id = router.query.premiseId;

  if (!id) {
    return <div>Course not found</div>;
  }

  if (Array.isArray(id)) {
    id = id[0];
  }

  return <Premise premiseId={Number(id)} />;
}
