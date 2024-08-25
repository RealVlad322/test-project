/* eslint-disable import/first,import/order,lodash/prefer-is-nil,lodash/prefer-lodash-typecheck */
import './global';

import { randomBytes } from 'crypto';
import { Types } from 'mongoose';

process.env.APP_ID ??= randomBytes(6).toString('hex');

import './lib/logger/configure';

import { Context } from '@evojs/context';

Context.generateTraceId = () => randomBytes(2).toString('hex');
Object.defineProperty(global, 'magicThis', { get: () => Context.get() });

global.isArray = Array.isArray as any;
global.isNumber = Number.isFinite as (x: unknown) => x is number;
global.isInteger = Number.isInteger as (x: unknown) => x is number;
global.isObject = (x: unknown): x is object => typeof x === 'object' && x !== null;
global.isBoolean = (x: unknown): x is boolean => typeof x === 'boolean';
global.isString = (x: unknown): x is string => typeof x === 'string';
global.isNil = (x: unknown): x is null | undefined => typeof x === 'undefined' || x === null;
global.isFunction = <T extends Function>(x: unknown): x is T => typeof x === 'function';
global.notEmpty = Boolean as unknown as typeof notEmpty;
global.isId = (x: unknown): x is Types.ObjectId => x instanceof Types.ObjectId;
