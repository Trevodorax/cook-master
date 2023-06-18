import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateBillingIntentDto } from './dto';

@Injectable()
export class BillingService {
  private stripe: Stripe;

  private products: Record<
    string,
    { price: number; validate: (userId: number) => void }
  >;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });

    // in order to access prisma service from these functions
    this.handleSubStarter = this.handleSubStarter.bind(this);
    this.handleSubMaster = this.handleSubMaster.bind(this);

    this.products = {
      subStarter: { validate: this.handleSubStarter, price: 1000 },
      subMaster: { validate: this.handleSubMaster, price: 2000 },
    };
  }

  async createBillingIntent(dto: CreateBillingIntentDto) {
    if (!this.products[dto.productName]) {
      throw new NotFoundException('Could not find a product with this name.');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: this.products[dto.productName].price, // in cents
      currency: 'eur',
      metadata: { userId: dto.userId.toString(), productName: dto.productName }, // Store the user ID in the metadata for later use
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
    };
  }

  async processWebhookEvent(event: Stripe.Event, req: RawBodyRequest<Request>) {
    try {
      // Verify the event using your Stripe webhook signing secret
      const signature = req.headers['stripe-signature'];
      const verifiedEvent = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET_KEY'),
      );

      switch (verifiedEvent.type) {
        case 'payment_intent.succeeded':
          this.handlePaymentIntentSucceeded(verifiedEvent.data);
          break;
        case 'payment_intent.failed':
          this.handlePaymentIntentFailed(verifiedEvent.data);
          break;
        default:
          console.log('Unhandled event type:', verifiedEvent.type);
          break;
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw new BadRequestException('Webhook processing error');
    }
  }

  handlePaymentIntentSucceeded(paymentIntent: Stripe.Event.Data) {
    const { userId, productName } = (
      paymentIntent.object as {
        metadata: { userId: string; productName: string };
      }
    ).metadata;

    const userIdNumber = parseInt(userId);

    if (Number.isNaN(userIdNumber)) {
      console.log('Invalid user id');
      return;
    }

    try {
      this.products[productName].validate(userIdNumber);
    } catch (e) {
      console.log('Error processing payment intent success : ', e);
    }
  }

  handlePaymentIntentFailed(paymentIntent: Stripe.Event.Data) {
    console.log('Payment Intent Failed:', paymentIntent);
  }

  /* =========== PRODUCT MANAGEMENT ========== */
  async handleSubStarter(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.clientId) {
      throw new NotFoundException('Could not find client');
    }

    const client = await this.prisma.client.update({
      where: {
        id: user.clientId,
      },
      data: {
        subscriptionLevel: 1,
      },
    });

    if (!client) {
      throw new InternalServerErrorException('Error updating subscription');
    }

    return client;
  }

  async handleSubMaster(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.clientId) {
      throw new NotFoundException('Could not find client');
    }

    const client = await this.prisma.client.update({
      where: {
        id: user.clientId,
      },
      data: {
        subscriptionLevel: 2,
      },
    });

    if (!client) {
      throw new InternalServerErrorException('Error updating subscription');
    }

    return client;
  }
}
