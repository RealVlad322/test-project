
import { HttpException, Injectable } from '@nestjs/common';
import { RequestCredentials, RequestMode } from 'node-fetch';

import { buildQuery } from '../functions/build-query.function';

@Injectable()
export class HttpAgent {
  private baseUrl: string | undefined;

  constructor() {}

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async get<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    return this._request<T>('GET', url, options);
  }

  async post<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    return this._request<T>('POST', url, options);
  }

  async put<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    return this._request<T>('PUT', url, options);
  }

  async patch<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    return this._request<T>('PATCH', url, options);
  }

  async delete<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    return this._request<T>('DELETE', url, options);
  }

  async _request(
    method: string,
    url: string,
    options: HttpRequestOptions & { responseType: 'response' },
  ): Promise<Response>;
  async _request<T>(
    method: string,
    url: string,
    options: HttpRequestOptions & { responseType: 'json' },
  ): Promise<T>;
  async _request<T>(
    method: string,
    url: string,
    options: HttpRequestOptions & { responseType: 'buffer' },
  ): Promise<T>;
  async _request(
    method: string,
    url: string,
    options: HttpRequestOptions & { responseType: 'text' },
  ): Promise<string>;
  async _request(
    method: string,
    url: string,
    options: HttpRequestOptions & { responseType: 'blob' },
  ): Promise<Blob>;
  async _request<T>(method: string, url: string, options?: HttpRequestOptions): Promise<T>;
  async _request(method: string, url: string, options: HttpRequestOptions = {}): Promise<unknown> {
    if (this.baseUrl) {
      url = url.replace(/^\/+/, '');
      url = `${this.baseUrl}/${url}`;
    }

    if (options.params) {
      url = this._replacePathParams(url, options.params);
    }

    options.showToast ??= true;
    options.headers ??= {};

    const {
      query,
      headers: headersInit,
      responseType = 'json',
      signal,
      credentials,
      referrer,
      mode,
      ...contentOptions
    } = options;

    const hasQuery = !!(query && Object.keys(query).length);
    const fullUrl = `${url}${hasQuery ? `?${buildQuery(query)}` : ''}`;

    const res = await fetch(fullUrl, {
      method,
      signal,
      credentials,
      mode,
      headers: {
        'Accept': 'application/json',
        'Cookie': headersInit.cookie as string,
        ...'json' in options && { 'Content-Type': 'application/json; charset=utf-8' },
        ...headersInit,
      },
      referrer,
      body:
          'json' in contentOptions
            ? JSON.stringify(contentOptions.json!)
            : 'blob' in contentOptions
              ? contentOptions.blob
              : undefined,
    });

    if (responseType === 'response') {
      return res;
    }

    const data: unknown = await (responseType === 'json'
      ? res.text().then((t) => t ? (JSON.parse(t) as unknown) : null)
      : responseType === 'blob'
        ? res.blob()
        : responseType === 'text'
          ? res.text()
          : res.arrayBuffer());

    if (res.status >= 400) {
      const err = new HttpException(res.statusText, res.status, data as any);

      throw err;
    }

    return data;
  }

  private _replacePathParams(path: string, params: HttpParams): string {
    let resultPath = path;

    for (const param of Object.keys(params)) {
      const paramPlaceholder = `:${param}`;
      resultPath = resultPath.replace(paramPlaceholder, `${params[param]}`);
    }

    return resultPath;
  }
}

export interface HttpRequestOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
  query?: HttpQuery;
  json?: HttpJson;
  referrer?: string;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  blob?: Blob;
  responseType?: 'json' | 'blob' | 'text' | 'response' | 'buffer';
  showToast?: boolean;
  signal?: AbortSignal;
}

export interface HttpHeaders {
  [key: string]: string | string[];
}

export interface HttpParams {
  [key: string]: string | number | boolean;
}

export interface HttpQuery {
  [key: string]: string | number | boolean | (string | number | boolean)[] | undefined;
}

export interface HttpJson {
  [key: string]: any;
}
