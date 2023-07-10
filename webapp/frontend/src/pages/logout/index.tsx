import { setToken } from "@/store/user/userSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToken(null));
    localStorage.removeItem("token");
    router.push("/login");
  });
}
