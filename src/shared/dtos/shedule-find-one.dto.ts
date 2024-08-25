import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { Directions } from './enums';

export class SheduleGetListDto {
  @IsNumber()
  declare grade: number;

  @IsString()
  declare name?: string;

  @IsNumber()
  declare group: number;

  @IsDateString()
  declare startTimeStamp: string;

  @IsDateString()
  declare endTimeStamp: string;

  @IsOptional()
  @IsEnum(Directions)
  declare sortByDate: Directions;
}
