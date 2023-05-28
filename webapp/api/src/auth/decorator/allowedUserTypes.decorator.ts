import { SetMetadata } from '@nestjs/common';

export const AllowedUserTypes = (userTypes: string[]) => {
  return SetMetadata('allowedUserTypes', userTypes);
};
