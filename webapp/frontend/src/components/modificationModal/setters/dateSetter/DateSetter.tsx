import { FC, useState } from "react";

import { Props } from "../types";
import { SetterWrapper } from "../setterWrapper/SetterWrapper";
import { DateInput } from "@/components/dateInput/DateInput";

export const DateSetter: FC<Props> = ({
  initialValue,
  setIsOpen,
  mutateValue,
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <SetterWrapper
      value={value}
      mutateValue={mutateValue}
      setIsOpen={setIsOpen}
    >
      <DateInput value={value} setValue={setValue} />
    </SetterWrapper>
  );
};
