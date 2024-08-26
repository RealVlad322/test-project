import { IsArray, IsNumber, IsString } from 'class-validator';

import { SubjectDto } from '../dtos';

export class SheduleOut {
  @IsNumber()
  declare grade: number;

  @IsString()
  declare faculty: string;

  @IsString()
  declare name: string;

  @IsNumber()
  declare group: number;

  @IsNumber()
  declare subgroup?: number;

  @IsString()
  declare date: string;

  @IsNumber()
  declare week?: number;

  @IsArray()
  declare subjects: SubjectDto[];
}
