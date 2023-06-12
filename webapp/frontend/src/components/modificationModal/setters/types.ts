import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";

export interface Props {
  initialValue: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  useMutation: UseMutation<any>;
}

export type setterType = "text" | "number" | "date" | "select" | "entity";
