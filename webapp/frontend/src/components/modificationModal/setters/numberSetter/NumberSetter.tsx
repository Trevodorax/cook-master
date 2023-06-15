import { FC, useState } from "react";

import { NumberInput } from "@/components/numberInput/NumberInput";

import { Props } from "../types";
import { SetterWrapper } from "../setterWrapper/SetterWrapper";

export const NumberSetter: FC<Props> = ({
  initialValue,
  setIsOpen,
  mutateValue,
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <SetterWrapper
      value={parseInt(value)}
      mutateValue={mutateValue}
      setIsOpen={setIsOpen}
    >
      <NumberInput value={value} setValue={setValue} />
    </SetterWrapper>
  );
};
