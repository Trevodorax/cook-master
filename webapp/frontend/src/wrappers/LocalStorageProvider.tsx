import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch } from "@/store/store";
import { setToken, setUserInfo } from "@/store/user/userSlice";
import { useGetMeMutation } from "@/store/services/cookMaster/api";

interface Props {
  children: ReactNode;
}

export const LocalStorageProvider = ({ children }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [getMe] = useGetMeMutation();

  const getSessionAndUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    dispatch(setToken(token));

    const userInfo = await getMe();
    if ("data" in userInfo) {
      dispatch(setUserInfo(userInfo.data || null));
    }
  };

  useEffect(() => {
    getSessionAndUser();
  }, []);

  return <>{children}</>;
};
