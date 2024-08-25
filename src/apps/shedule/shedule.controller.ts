import { CreateSheduleDto, SheduleGetListDto } from '@/shared/dtos';
import { Shedule } from '@/shared/schemas';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';

import { SheduleService } from './shedule.service';

@Controller('shedule')
export class SheduleController {
  constructor(private readonly sheduleService: SheduleService) {}

  @Post()
  async create(@Body() body: CreateSheduleDto): Promise<Shedule> {
    const result = await this.sheduleService.create(body);

    return result;
  }

  @Get('all')
  async getAll(): Promise<Shedule[]> {
    const result = await this.sheduleService.findAll();

    return result;
  }

  @Post('shedules')
  async getShedules(
    @Body() body: SheduleGetListDto,
  ): Promise<Shedule[]> {
    const result = await this.sheduleService.getShedules(body);

    return result;
  }

  @Get('test')
  async deleteAll(): Promise<void> {
    await this.sheduleService.deleteAll();
  }

  @Delete('shedules')
  async deleteByName(
    @Query('name') name: string,
  ): Promise<void> {
    await this.sheduleService.deleteByName(name);
  }

  @Delete('date')
  async deleteByDate(
    @Query('startTimeStamp') startTimeStamp: string,
    @Query('endTimeStamp') endTimeStamp: string,
  ): Promise<void> {
    await this.sheduleService.deleteByDate(startTimeStamp, endTimeStamp);
  }
}
