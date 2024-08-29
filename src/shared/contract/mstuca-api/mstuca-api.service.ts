import { HttpAgent } from '@/shared/lib';
import { Injectable } from '@nestjs/common';

import { MstucaResponse } from './types';

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

  async getShedule2(id: number, query: { start: string; finish: string; Ing: number }, signal?: AbortSignal): Promise<MstucaResponse[]> {
    const result = await this.http.get<MstucaResponse[]>(`https://ruz.mstuca.ru/api/schedule/group/${id}`, {
      signal,
      query,
    });

    return result;
  }

  async getTeacherShedules(id: string, query: { start: string; finish: string; Ing: number }, signal?: AbortSignal): Promise<MstucaResponse[]> {
    console.log(`https://ruz.mstuca.ru/api/schedule/person/${id}`);

    const result = await this.http.get<MstucaResponse[]>(`https://ruz.mstuca.ru/api/schedule/person/${id}`, {
      signal,
      query,
    });

    console.log(result);

    return result;
  }

  async getPage(signal?: AbortSignal): Promise<string> {
    const result = await this.http.get<string>(`https://www.mstuca.ru/students/shedule/?SECTION_ID=95`, {
      signal,
      responseType: 'text',
    });

    return result;
  }
}
