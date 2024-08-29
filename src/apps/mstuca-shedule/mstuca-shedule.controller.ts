import { CreateSheduleDto, MstucaSheduleGetOneDto } from '@/shared/dtos';
import { Controller, Get, Query } from '@nestjs/common';

import { MstucaSheduleService } from './mstuca-shedule.service';

@Controller('mstucaShedule')
export class MstucaSheduleController {
  constructor(private readonly mstucaSheduleService: MstucaSheduleService) {}

  @Get('one')
  async getOne(@Query() query: MstucaSheduleGetOneDto): Promise<CreateSheduleDto[]> {
    const result = await this.mstucaSheduleService.getOne(+query.id, query.start, query.finish);

    return result;
  }

  @Get('teacher')
  async getTeacher(@Query() query: MstucaSheduleGetOneDto): Promise<CreateSheduleDto[]> {
    const result = await this.mstucaSheduleService.getOneForTeacher(query.id, query.start, query.finish);

    return result;
  }
}
