import { IsInt, IsNotEmpty } from 'class-validator';

export class getUserForContractorDto {
  @IsInt()
  @IsNotEmpty()
  contractorId: number;
}
