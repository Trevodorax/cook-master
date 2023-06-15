import { FC, ReactNode, isValidElement, useState } from "react";

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
  initialValue: ReactNode;
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

  const primitiveInitialValue = getPrimitiveValue(initialValue);

  return (
    <div className={styles.container}>
      <ModificationModal
        type={type}
        initialValue={primitiveInitialValue}
        mutateValue={mutateValue}
        getOptions={getOptions}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        options={options}
        textField={textField}
      />
      {initialValue}
      {isEditable && (
        <Button onClick={() => setIsOpen(true)} className={styles.editButton}>
          <PenIcon />
        </Button>
      )}
    </div>
  );
};

function getPrimitiveValue(children: ReactNode) {
  if (typeof children === "string" || typeof children === "number") {
    return children;
  }
  if (isValidElement(children) && children.props.children) {
    return getPrimitiveValue(children.props.children);
  }
  return undefined;
}
