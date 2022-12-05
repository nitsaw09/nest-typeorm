import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('warmupevents')
  getWarmupEvents() {
    return this.eventsService.getWarmupEvents();
  }

  @Get('events')
  async getEventsWithWorkshops() {
    return this.eventsService.getEventsWithWorkshops();
  }

  @Get('futureevents')
  async getFutureEventWithWorkshops() {
    return this.eventsService.getFutureEventWithWorkshops();
  }
}
