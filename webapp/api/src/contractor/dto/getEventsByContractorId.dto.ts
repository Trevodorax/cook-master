import { IsInt, IsNotEmpty } from 'class-validator';

export class GetEventsByContractorIdDto {
  @IsInt()
  @IsNotEmpty()
  contractorId: number;
}
