import { IsArray } from 'class-validator';

import { CreateSheduleDto } from './create-shedule.dto';

export class SheduleSaveManyDto {
  @IsArray({})
  declare shedules: CreateSheduleDto[];
}
