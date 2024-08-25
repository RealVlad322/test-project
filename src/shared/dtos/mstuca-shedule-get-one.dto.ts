import { IsString } from 'class-validator';

export class MstucaSheduleGetOneDto {
  @IsString()
  declare id: string;

  @IsString()
  declare hash: string;
}
