import { Controller, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { SyncSheduleService } from './sync-shedule.service';

@Controller('syncShedule')
export class SyncSheduleController {
  constructor(private readonly syncSheduleService: SyncSheduleService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async syncShedules(): Promise<void> {
    await this.syncSheduleService.syncAll();
  }

  @Get('forceAll')
  async forceSyncShedules(): Promise<void> {
    await this.syncSheduleService.syncAll();
  }
}
