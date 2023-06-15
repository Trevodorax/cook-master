import { FC, useState } from "react";

import { Props } from "../types";
import { SetterWrapper } from "../setterWrapper/SetterWrapper";
import { SelectInput } from "@/components/selectInput/SelectInput";

interface EntitySetterProps extends Props {
  getOptions: (search: string) => any[]; // the function that will fetch the entities ;
  textField: string; // the field that will be searched and displayed in the select input
}

// ! This component is a failed attempt to make a generic setter for entities
// ! Do not use it, or make it work first
export const EntitySetter: FC<EntitySetterProps> = ({
  initialValue,
  setIsOpen,
  mutateValue,
  getOptions,
  textField,
}) => {
  const [value, setValue] = useState<Record<string, any>>(initialValue);

  // mock of getOptions(value)
  const options: Record<string, any> = getOptions(value[textField]) || [
    { [textField]: "No values found" },
  ];

  const optionsAsText = options.map((option: any) => option[textField] || null);

  const setValueFromText = (text: string) => {
    const option = options.find((option: any) => option[textField] === text);
    if (option) {
      setValue(option);
    }
  };

  const mutateValueFromText = (text: string) => {
    const option = options.find((option: any) => option[textField] === text);
    if (option) {
      mutateValue(option.id || null);
    }
  };

  return (
    <SetterWrapper
      value={value[textField]}
      mutateValue={mutateValueFromText}
      setIsOpen={setIsOpen}
    >
      <SelectInput
        value={value[textField]}
        setValue={setValueFromText}
        options={optionsAsText}
      />
    </SetterWrapper>
  );
};
