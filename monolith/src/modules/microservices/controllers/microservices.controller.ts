import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { EventService } from '../../../application/services/event.service';
import { UserService } from '../../../application/services/user.service';

@Controller('microservices')
export class MicroservicesController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}

  @Get('events/exists/:id')
  async checkEventExists(@Param('id') id: string) {
    const event = await this.eventService.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return { exists: true, id: event.id, title: event.title };
  }

  @Get('users/exists/:id')
  async checkUserExists(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { exists: true, id: user.id, name: user.name };
  }
}
