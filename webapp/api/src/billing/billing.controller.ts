import { Body, Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { BillingService } from './billing.service';
import {
  serializedCreateBillingIntentDto,
  unserializeCreateBillingIntentDto,
} from './dto';

@Controller('billings')
export class BillingController {
  constructor(private billingService: BillingService) {}
  @Post()
  async createBillingIntent(@Body() data: serializedCreateBillingIntentDto) {
    const parsedDto = unserializeCreateBillingIntentDto(data);

    return this.billingService.createBillingIntent(parsedDto);
  }

  // this is where Stripe will send the events
  @Post('webhook')
  handleWebhookEvent(@Body() event: any, @Req() req: RawBodyRequest<Request>) {
    // Pass the event data to the billing service for processing
    this.billingService.processWebhookEvent(event, req);
    return { received: true };
  }
}
