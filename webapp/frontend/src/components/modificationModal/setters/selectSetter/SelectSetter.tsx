import { FC } from "react";

import { Props } from "../types";

interface SelectSetterProps extends Props {
  options: string[];
}

export const SelectSetter: FC<SelectSetterProps> = () => {
  return <div>SelectSetter</div>;
};
