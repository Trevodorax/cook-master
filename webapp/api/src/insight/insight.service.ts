import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InsightService {
  constructor(private prisma: PrismaService) {}

  async getRevenueDistribution() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }

  async getSubscriptionTypeDistribution() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }

  async getPurchaseRegularities() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }

  async getTop5Fidelity() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }

  async getEventTypeDistribution() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }

  async getEventsPerMonth() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }

  async getEventLocationDistribution() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }

  async getTop5DemandedEvents() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }

  async getServiceTypeDistribution() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }

  async getAverageServiceCost() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }

  async getTop5FrequentServices() {
    // TODO: Implement method
    throw new Error('Method not implemented');
  }
}
