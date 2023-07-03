import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

import { IsFutureDateConstraint } from 'src/customValidators';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;

  @IsDate()
  @Validate(IsFutureDateConstraint)
  startTime: Date;

  @IsInt()
  @IsNotEmpty()
  durationMin: number;

  @IsInt()
  animator?: number;

  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;
}

export type unparsedCreateEventDto = Omit<CreateEventDto, 'startTime'> & {
  startTime: string;
  durationMin: string;
  animator?: string;
};
