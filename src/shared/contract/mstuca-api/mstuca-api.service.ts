import { HttpAgent } from '@/shared/lib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MstucaApiService {
  constructor(private readonly http: HttpAgent) {}

  async getShedule(id: string, hash: string, signal?: AbortSignal): Promise<Buffer> {
    const result = await this.http.get<Buffer>(`https://www.mstuca.ru/upload/iblock/${id}/${hash}`, {
      signal,
      responseType: 'buffer',
    });

    return result;
  }

  async getHTMLPage(signal?: AbortSignal): Promise<string> {
    const result = await this.http.get<string>(`https://www.mstuca.ru/students/shedule/?SECTION_ID=95`, {
      signal,
      responseType: 'text',
    });

    return result;
  }
}
