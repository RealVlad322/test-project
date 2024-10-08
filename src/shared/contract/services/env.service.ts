/* eslint-disable @typescript-eslint/only-throw-error, @typescript-eslint/no-throw-literal */
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, statSync } from 'fs';
import isError from 'lodash/isError';
import { resolve as pathResolve } from 'path';

@Injectable()
export class EnvService {
  readonly env = process.env;

  has(key: string): boolean {
    return this.env[key] !== undefined;
  }

  getNumber(key: string): number;
  getNumber(key: string, defaultValue: number): number;
  getNumber(key: string, defaultValue?: number): number {
    return this._handleErrors(
      key,
      (value) => {
        const parsedValue = +value!;

        if (!isNumber(parsedValue)) {
          throw { mustBeType: 'number' };
        }

        return parsedValue;
      },
      defaultValue,
    );
  }

  getInteger(key: string): number;
  getInteger(key: string, defaultValue: number): number;
  getInteger(key: string, defaultValue?: number): number {
    return this._handleErrors(
      key,
      (value) => {
        const parsedValue = +value!;

        if (!Number.isInteger(parsedValue)) {
          throw { mustBeType: 'integer' };
        }

        return parsedValue;
      },
      defaultValue,
    );
  }

  getBoolean(key: string): boolean;
  getBoolean(key: string, defaultValue: boolean): boolean;
  getBoolean(key: string, defaultValue?: boolean): boolean {
    return this._handleErrors(
      key,
      (value) => {
        const unparsedValue = value?.toLowerCase();
        const parsedValue = ['1', 'true'].includes(unparsedValue!)
          ? true
          : ['0', 'false'].includes(unparsedValue!)
            ? false
            : value;

        if (!isBoolean(parsedValue)) {
          throw { mustBeType: 'boolean' };
        }

        return parsedValue;
      },
      defaultValue,
    );
  }

  getString(key: string): string;
  getString(key: string, defaultValue: string): string;
  getString(key: string, defaultValue?: string): string {
    return this._handleErrors(
      key,
      (value) => {
        if (!isString(value)) {
          throw { mustBeType: 'string' };
        }

        return value;
      },
      defaultValue,
    );
  }

  getEnumValue<E>(key: string, enumeration: object | string[]): E;
  getEnumValue<E>(key: string, enumeration: object | string[], defaultValue: E): E;
  getEnumValue<E>(key: string, enumeration: object | string[], defaultValue?: E): E {
    return this._handleErrors<E>(
      key,
      (value) => {
        const values = isArray(enumeration) ? enumeration : Object.values(enumeration);

        if (!values.includes(value as any)) {
          throw { mustBeOneOf: values };
        }

        return value as unknown as E;
      },
      defaultValue,
    );
  }

  getUrl(key: string): URL;
  getUrl<T extends URL | null>(key: string, defaultValue: T): URL | T;
  getUrl(key: string, defaultValue?: URL): URL {
    return this._handleErrors(
      key,
      (value) => {
        if (!value) {
          throw { mustBeType: 'url' };
        }

        try {
          const url = new URL(value);

          return url;
        } catch (err) {
          throw { mustBeType: 'url' };
        }
      },
      defaultValue,
    );
  }

  getDir(key: string): string;
  getDir(key: string, defaultValue: string): string;
  getDir(key: string, defaultValue?: string): string {
    // TODO: refactor
    return this._handleErrors(
      key,
      (value) => {
        try {
          if (!value) {
            throw new Error(`Path "${value}" is not directory`);
          }

          const dir = pathResolve(process.cwd(), value);
          const exists = existsSync(dir);

          if (exists) {
            if (!statSync(dir).isDirectory()) {
              throw new Error(`Path "${dir}" is not directory`);
            }
          } else {
            mkdirSync(dir, { recursive: true });
          }

          return dir;
        } catch (err) {
          if (defaultValue && !existsSync(defaultValue)) {
            const dir = pathResolve(process.cwd(), defaultValue);

            mkdirSync(dir, { recursive: true });
          }

          throw { mustBeType: 'dir' };
        }
      },
      defaultValue,
    );
  }

  getFile(key: string): string;
  getFile(key: string, defaultValue: string): string;
  getFile(key: string, defaultValue?: string): string {
    // TODO: refactor
    return this._handleErrors(
      key,
      (value = '') => {
        try {
          const filepath = pathResolve(process.cwd(), value);
          const exists = existsSync(filepath);

          if (!exists) {
            throw new Error(`File "${filepath}" does not exists`);
          } else if (statSync(filepath).isDirectory()) {
            throw new Error(`Path "${filepath}" is not a file`);
          }

          return filepath;
        } catch (err) {
          if (defaultValue !== undefined) {
            return defaultValue;
          }

          throw { mustBeType: 'file' };
        }
      },
      defaultValue,
    );
  }

  private _handleErrors<T>(
    key: string,
    cb: (value: string | undefined) => T,
    defaultValue: T | undefined,
  ): T {
    const value = this.env[key];

    try {
      return cb(value);
    } catch (err: any) {
      if (isError(err)) {
        throw err;
      }

      if (defaultValue !== undefined) {
        return defaultValue;
      }

      const { mustBeType, mustBeOneOf } = err as { mustBeType?: string; mustBeOneOf?: string[] };
      const mustBe = isArray(mustBeOneOf)
        ? `one of [${mustBeOneOf.join(', ')}]`
        : `type of ${mustBeType}`;

      throw new Error(`Value of "${key}" must be ${mustBe} but got ${value}!`);
    }
  }
}
