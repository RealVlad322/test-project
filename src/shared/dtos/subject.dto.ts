import { IsNumber, IsString } from 'class-validator';

export class SubjectDto {
  @IsNumber()
  declare index: number;

  @IsString()
  declare name: string;

  @IsString()
  declare type: string;

  @IsString()
  declare place: string;

  @IsString()
  declare teacher: string;

  @IsString()
  declare address: string;
}
