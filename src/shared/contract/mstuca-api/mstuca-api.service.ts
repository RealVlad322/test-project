import { HttpAgent } from '@/shared/lib';
import { Injectable } from '@nestjs/common';

import { MstucaResponse } from './types';
import { ProxyCommonService } from '../services/proxy-common.service';

@Injectable()
export class MstucaApiService {
  constructor(
    private readonly http: HttpAgent,
    private readonly proxy: ProxyCommonService,
  ) {}

  async getShedule(id: string, hash: string, signal?: AbortSignal): Promise<Buffer> {
    const result = await this.http.get<Buffer>(
      `https://www.mstuca.ru/upload/iblock/${id}/${hash}`,
      {
        signal,
        responseType: 'buffer',
      },
    );

    return result;
  }

  async getShedule2(
    id: number,
    query: { start: string; finish: string; Ing: number },
    proxyId?: string,
    signal?: AbortSignal,
  ): Promise<MstucaResponse[]> {
    const proxyAgent = proxyId ? this.proxy.getFreeAgent(proxyId) : undefined;

    const result = await this.http.get<MstucaResponse[]>(
      `https://ruz.mstuca.ru/api/schedule/group/${id}`,
      {
        proxy: proxyAgent,
        signal,
        query,
      },
    );

    return result;
  }

  async getTeacherShedules(
    id: string,
    query: { start: string; finish: string; Ing: number },
    proxyId?: string,
    signal?: AbortSignal,
  ): Promise<MstucaResponse[]> {
    const proxyAgent = proxyId ? this.proxy.getFreeAgent(proxyId) : undefined;

    const result = await this.http.get<MstucaResponse[]>(
      `https://ruz.mstuca.ru/api/schedule/person/${id}`,
      {
        proxy: proxyAgent,
        signal,
        query,
      },
    );

    return result;
  }

  async getPage(signal?: AbortSignal): Promise<string> {
    const result = await this.http.get<string>(
      `https://www.mstuca.ru/students/shedule/?SECTION_ID=95`,
      {
        signal,
        responseType: 'text',
      },
    );

    return result;
  }
}
