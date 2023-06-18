import { BadRequestException } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBillingIntentDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  productName: string;
}

export type serializedCreateBillingIntentDto = {
  userId: string;
  productName: string;
};

export const unserializeCreateBillingIntentDto = (
  data: serializedCreateBillingIntentDto,
): CreateBillingIntentDto => {
  const userId = parseInt(data.userId);

  if (isNaN(userId)) {
    throw new BadRequestException('Invalid data');
  }

  return { ...data, userId };
};

export const serializeCreateBillingIntentDto = (
  data: CreateBillingIntentDto,
): serializedCreateBillingIntentDto => {
  return {
    ...data,
    userId: data.userId.toString(),
  };
};
