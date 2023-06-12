import { FC } from "react";
import {
  UseMutation,
  UseQuery,
} from "@reduxjs/toolkit/dist/query/react/buildHooks";

import { Modal } from "@/components/modal/Modal";

import {
  DateSetter,
  NumberSetter,
  SelectSetter,
  TextSetter,
  setterType,
} from "./setters";
import styles from "./ModificationModal.module.scss";

interface Props {
  useFetchPossibleValues?: UseQuery<any>;
  type: setterType;
  initialValue: any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  useMutation: UseMutation<any>;
}

export const ModificationModal: FC<Props> = ({
  type,
  initialValue,
  useMutation,
  useFetchPossibleValues,
  isOpen,
  setIsOpen,
}) => {
  interface SetterPerType {
    [key: string]: FC<any>;
  }

  const setterPerType: SetterPerType = {
    text: TextSetter,
    number: NumberSetter,
    date: DateSetter,
    select: SelectSetter,
  };

  const Setter = setterPerType[type];

  return (
    <Modal
      modalClassName={styles.container}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {
        <Setter
          initialValue={initialValue}
          setIsOpen={setIsOpen}
          useMutation={useMutation}
          useFetchPossibleValues={useFetchPossibleValues || undefined}
        />
      }
    </Modal>
  );
};
