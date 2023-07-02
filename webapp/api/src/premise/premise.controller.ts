import { Controller } from '@nestjs/common';
import { PremiseService } from './premise.service';

@Controller('premises')
export class PremiseController {
  constructor(private readonly premiseService: PremiseService) {}
}
