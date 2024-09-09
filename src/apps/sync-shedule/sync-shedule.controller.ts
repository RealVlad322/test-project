import { Controller, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { SyncSheduleService } from './sync-shedule.service';

@Controller('syncShedule')
export class SyncSheduleController {
  constructor(private readonly syncSheduleService: SyncSheduleService) {}

  @Cron(CronExpression.EVERY_11_HOURS)
  async syncShedulesTeachers(): Promise<void> {
    await this.syncSheduleService.syncAllTeachers();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncShedulesStudents(): Promise<void> {
    await this.syncSheduleService.syncAllStudents();
  }

  @Get('forceAllTeachers')
  async forceSyncShedulesTeachers(): Promise<void> {
    await this.syncSheduleService.syncAllTeachers();
  }

  @Get('forceAllStudents')
  async forceSyncShedulesStudents(): Promise<void> {
    await this.syncSheduleService.syncAllStudents();
  }
}
