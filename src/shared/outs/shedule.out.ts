import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

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

  @IsArray({})
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  declare subjects: SubjectDto[];
}
