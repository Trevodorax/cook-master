import { FC, useState } from "react";

import { setterType } from "@/components/modificationModal/setters";
import { ModificationModal } from "@/components/modificationModal/ModificationModal";
import { Button } from "@/components/button/Button";
import { PenIcon } from "@/components/svgs";

import styles from "./EditableField.module.scss";

interface Props {
  getOptions?: (search: string) => any[];
  textField?: string;
  options?: string[];
  type: setterType;
  initialValue: any;
  mutateValue: (value: any) => void;
  isEditable?: boolean;
}

export const EditableField: FC<Props> = ({
  type,
  initialValue,
  mutateValue,
  getOptions,
  textField,
  options,
  isEditable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const canUserEdit = isEditable;

  return (
    <div className={styles.container}>
      <ModificationModal
        type={type}
        initialValue={initialValue}
        mutateValue={mutateValue}
        getOptions={getOptions}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        options={options}
        textField={textField}
      />
      {initialValue}
      {canUserEdit && (
        <Button onClick={() => setIsOpen(true)} className={styles.editButton}>
          <PenIcon />
        </Button>
      )}
    </div>
  );
};
