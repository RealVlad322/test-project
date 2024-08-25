import { IsString } from 'class-validator';

export class LinkOut {
  @IsString()
  declare id: string;

  @IsString()
  declare hash: string;
}
