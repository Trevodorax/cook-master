import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Index() {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    } else {
      router.push(`/dashboard/${userInfo.userType}`);
    }
  }, []);
}
