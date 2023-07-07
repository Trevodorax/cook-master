import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { AddressService } from 'src/address/address.service';

@Module({
  controllers: [ClientController],
  providers: [ClientService, AddressService],
})
export class ClientModule {}
