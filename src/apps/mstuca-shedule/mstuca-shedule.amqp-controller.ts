import { AmqpEvents } from '@/shared/dtos';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { MstucaSheduleService } from './mstuca-shedule.service';

@Controller('mstucaShedule')
export class MstucaSheduleAmqpController {
  constructor(private readonly mstucaSheduleService: MstucaSheduleService) {}

  @EventPattern(AmqpEvents.SYNC_ALL)
  async syncAll(): Promise<void> {
    await this.mstucaSheduleService.getAllList();
  }
}
