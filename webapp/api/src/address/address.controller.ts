import { Controller } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('addresss')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
}
