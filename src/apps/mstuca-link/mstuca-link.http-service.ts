import { MstucaApiService } from '@/shared/contract';
import { CreateLinkDto } from '@/shared/dtos';
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class MstucaLinkHttpService {
  constructor(private readonly mstucaApi: MstucaApiService) {}

  async getLinksForCreate(): Promise<CreateLinkDto[]> {
    const result = await this.mstucaApi.getPage();

    const $ = cheerio.load(result);
    const t: CreateLinkDto[] = [];

    // eslint-disable-next-line func-names
    $('.news-item small a').each(function () {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      const attr = $(this).attr();

      if (attr) {
        const href = attr.href;
        t.push({ id: href.split('/')[3], hash: href.split('/')[4] });
      }
    });

    return t;
  }
}
