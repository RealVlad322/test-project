import { IsString } from 'class-validator';

export class MstucaSheduleGetOneDto {
  @IsString()
  declare id: string;

  @IsString()
  declare start: string;

  @IsString()
  declare finish: string;
}
