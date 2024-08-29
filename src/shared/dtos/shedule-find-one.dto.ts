import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { Directions } from './enums';

export class SheduleGetListDto {
  @IsOptional()
  @IsNumber()
  declare grade?: number;

  @IsOptional()
  @IsString()
  declare groupName?: string;

  @IsOptional()
  @IsNumber()
  declare group?: number;

  @IsOptional()
  @IsString()
  declare teacher?: string;

  @IsDateString()
  declare startTimeStamp: string;

  @IsDateString()
  declare endTimeStamp: string;

  @IsOptional()
  @IsEnum(Directions)
  declare sortByDate: Directions;
}
