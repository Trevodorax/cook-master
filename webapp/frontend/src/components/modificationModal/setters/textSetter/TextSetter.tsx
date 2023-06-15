import { FC, useState } from "react";

import { Props } from "../types";
import { SetterWrapper } from "../setterWrapper/SetterWrapper";
import { TextInput } from "@/components/textInput/TextInput";

export const TextSetter: FC<Props> = ({
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
      <TextInput type="text" value={value} setValue={setValue} />
    </SetterWrapper>
  );
};
