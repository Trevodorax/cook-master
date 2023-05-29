import { IsInt, IsNotEmpty } from 'class-validator';

export class GetEventByIdDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
