import { FC } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";

import { Props } from "../types";

interface EntitySetterProps extends Props {
  useFetchPossibleValues?: UseQuery<any>;
  textAttribute: string; // the attribute by which we will search, and which will be displayed in the field
}

export const EntitySetter: FC<EntitySetterProps> = () => {
  // TODO: use the useFetchPossibleValues to fetch the possible values for the entity as the user types
  // when one is selected, the value of the textAttribute on the entity should be displayed in the field
  // on validation, it is the id of the  that is used to patch the entity
  return <div>Entity setter</div>;
};
