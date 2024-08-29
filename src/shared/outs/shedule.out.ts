import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SheduleOut {
  @IsNumber()
  declare grade: number;

  @IsString()
  declare faculty: string;

  @IsString()
  declare groupName: string;

  @IsNumber()
  declare group: number;

  @IsOptional()
  @IsNumber()
  declare subgroup?: number;

  @IsString()
  declare date: string;

  @IsOptional()
  @IsNumber()
  declare week?: number;

  @IsNumber()
  declare index: number;

  @IsString()
  declare discipline: string;

  @IsString()
  declare type: string;

  @IsString()
  declare place: string;

  @IsString()
  declare teacher: string;

  @IsOptional()
  @IsString()
  declare address?: string;
}
