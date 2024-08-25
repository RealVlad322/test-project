import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { CreateSheduleDto } from './create-shedule.dto';

export class SheduleSaveManyDto {
  @IsArray({})
  @ValidateNested({ each: true })
  @Type(() => CreateSheduleDto)
  declare shedules: CreateSheduleDto[];
}
