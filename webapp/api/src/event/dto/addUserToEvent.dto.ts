import { IsNotEmpty, IsInt } from 'class-validator';

export class AddUserToEventDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
