import { FC, useState } from "react";
import { Props } from "../types";
import { SetterWrapper } from "../setterWrapper/SetterWrapper";
import { SelectInput } from "@/components/selectInput/SelectInput";

interface SelectSetterProps extends Props {
  options: string[];
}

export const SelectSetter: FC<SelectSetterProps> = ({
  initialValue,
  setIsOpen,
  mutateValue,
  options,
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <SetterWrapper
      value={value}
      mutateValue={mutateValue}
      setIsOpen={setIsOpen}
    >
      <SelectInput value={value} setValue={setValue} options={options} />
    </SetterWrapper>
  );
};
