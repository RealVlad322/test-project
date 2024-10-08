import { Injectable, type OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import { HttpsProxyAgent } from 'hpagent';
import { Agent as HttpAgent } from 'http';
import random from 'lodash/random';

import { EnvService } from './env.service';

const PROXY_FILEPATH = process.env.PROXIES_PATH;

@Injectable()
export class ProxyCommonService implements OnModuleInit {
  private readonly FILEPATH: string | null;
  private readonly HTTP_PROXY_AGENTS: Record<string, HttpAgent[]> = {};

  private _counts: Record<string, number> = {};

  constructor(env: EnvService) {
    try {
      this.FILEPATH = env.getFile('PROXY_FILEPATH', PROXY_FILEPATH ? PROXY_FILEPATH : '.env/proxies.txt');
    } catch (err) {
      this.FILEPATH = null;
    }
  }

  async onModuleInit(): Promise<void> {
    if (this.FILEPATH) {
      await this._loadFromFile(this.FILEPATH);
    }
  }

  getFreeAgent(id: string): HttpAgent {
    const count = this._counts[id];

    if (!count) {
      throw new Error(`No proxies for ${id}`);
    }

    const index = random(0, count - 1);
    const proxyAgent = this.HTTP_PROXY_AGENTS[id].at(index)!;

    return proxyAgent;
  }

  private async _loadFromFile(filePath: string): Promise<void> {
    const proxyAgents = (await fs.readFile(filePath, 'utf-8'))
      .split(/\s+/)
      .filter((value) => value && !value.startsWith('-'))
      .reduce((acc, value, i) => {
        const [,, proxyUrl] = value.split('/');

        acc[i] ||= [];

        acc[i].push(
          new HttpsProxyAgent({
            proxy: `http://${proxyUrl}`,
            rejectUnauthorized: false,
            checkServerIdentity: () => undefined,
          }),
        );

        return acc;
      }, {});

    Object.assign(this.HTTP_PROXY_AGENTS, proxyAgents);

    this._counts = Object.fromEntries(
      Object.entries(this.HTTP_PROXY_AGENTS).map(([id, agents]) => [id, agents.length]),
    );
  }
}
