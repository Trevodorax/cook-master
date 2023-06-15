import { FC } from "react";

import { Modal } from "@/components/modal/Modal";

import {
  DateSetter,
  NumberSetter,
  SelectSetter,
  TextSetter,
  setterType,
  EntitySetter,
} from "./setters";
import styles from "./ModificationModal.module.scss";

interface Props {
  getOptions?: (search: string) => any[];
  textField?: string;
  options?: string[];
  type: setterType;
  initialValue: any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateValue: (value: any) => void;
}

export const ModificationModal: FC<Props> = ({
  type,
  initialValue,
  mutateValue,
  getOptions,
  isOpen,
  setIsOpen,
  options,
  textField,
}) => {
  interface SetterPerType {
    [key: string]: FC<any>;
  }

  const setterPerType: SetterPerType = {
    text: TextSetter,
    number: NumberSetter,
    date: DateSetter,
    select: SelectSetter,
    entity: EntitySetter,
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
          mutateValue={mutateValue}
          getOptions={getOptions}
          options={options}
          textField={textField}
        />
      }
    </Modal>
  );
};
