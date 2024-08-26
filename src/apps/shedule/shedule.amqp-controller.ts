import { AmqpEvents, SheduleSaveManyDto } from '@/shared/dtos';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { SheduleService } from './shedule.service';

@Controller('shedule')
export class SheduleAmqpController {
  constructor(private readonly sheduleService: SheduleService) {}

  @EventPattern(AmqpEvents.SAVE_MANY)
  // eslint-disable-next-line @typescript-eslint/require-await
  async saveMany(data: SheduleSaveManyDto): Promise<void> {
    try {
      const { shedules } = data;

      if (!shedules.length) {
        throw new Error('Empty data');
      }

      await Promise.all(shedules.map((a) => this.sheduleService.update((a))));
    } catch (err) {
      console.log('error', err);
    }
  }
}
