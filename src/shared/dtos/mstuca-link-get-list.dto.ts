import { IsString } from 'class-validator';

export class MstucaLinkGetListDto {
  @IsString()
  declare id: string;
}
