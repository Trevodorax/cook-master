export interface Props {
  initialValue: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateValue: (value: any) => void;
}

export type setterType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "entity"
  | "image";
