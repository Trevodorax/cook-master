import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch, RootState } from "../store";
import { resetRedirection } from "./redirectionSlice";

interface Props {
  children: React.ReactNode;
}

export const RedirectionWrapper = ({ children }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const route = useSelector((state: RootState) => state.redirection.route);

  useEffect(() => {
    if (route) {
      router.push(route);
      dispatch(resetRedirection());
    }
  }, [route]);

  return <>{children}</>;
};
