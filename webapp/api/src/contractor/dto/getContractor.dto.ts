import { IsInt, IsNotEmpty } from 'class-validator';

export class GetContractorDto {
  @IsInt()
  @IsNotEmpty()
  contractorId: number;
}
