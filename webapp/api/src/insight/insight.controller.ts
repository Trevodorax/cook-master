import { Controller, Get, UseGuards } from '@nestjs/common';
import { InsightService } from './insight.service';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AllowedUserTypes } from 'src/auth/decorator';

@Controller('insights')
export class InsightController {
  constructor(private readonly insightService: InsightService) {}

  /* ===== CLIENT INSIGHTS ===== */
  // returns the revenue brought by each client
  @Get('revenueDistribution')
  getRevenueDistribution() {
    return this.insightService.getRevenueDistribution();
  }

  // returns the pourcentage of clients with each type of subscription
  // a subscription is either 0, 1 or 2
  @Get('subscriptionTypeDistribution')
  getSubscriptionTypeDistribution() {
    return this.insightService.getSubscriptionTypeDistribution();
  }

  // returns the pourcentage of "regular", "occasional" or "rare" clients
  // does so by looking at the invoices datetime
  @Get('purchaseRegularities')
  getPurchaseRegularities() {
    return this.insightService.getPurchaseRegularities();
  }

  // returns the 5 clients with the highest number of fidelity points
  @Get('top5Fidelity')
  getTop5Fidelity() {
    return this.insightService.getTop5Fidelity();
  }

  /* ===== EVENT INSIGHTS ===== */
  // returns the pourcentage of events by type
  @Get('eventTypeDistribution')
  getEventTypeDistribution() {
    return this.insightService.getEventTypeDistribution();
  }

  // returns the number of events happening each month
  @Get('eventsPerMonth')
  getEventsPerMonth() {
    return this.insightService.getEventsPerMonth();
  }

  // returns the pourcentage of events per city
  // the city is the city of the premise that hosts the room that hosts the event
  // if the event doesn't have a room, it is not part of the calculations
  @Get('eventLocationDistribution')
  getEventLocationDistribution() {
    return this.insightService.getEventLocationDistribution();
  }

  // returns the 5 events with the highest number of clients
  @Get('top5DemandedEvents')
  getTop5DemandedEvents() {
    return this.insightService.getTop5DemandedEvents();
  }

  /* ===== CONTRACTOR INSIGHTS ===== */
  // returns the pourcentage of each serviceType provided by all contractors
  @Get('serviceTypeDistribution')
  getServiceTypeDistribution() {
    return this.insightService.getServiceTypeDistribution();
  }

  // returns the average serviceCost per serviceType
  @Get('averageServiceCost')
  getAverageServiceCost() {
    return this.insightService.getAverageServiceCost();
  }

  // returns the top 5 most frequent types of services
  // an event from a contractor with serviceType "abc" is of type "abc"
  @Get('top5FrequentServices')
  getTop5FrequentServices() {
    return this.insightService.getTop5FrequentServices();
  }
}
