import { Injectable } from '@nestjs/common';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import * as xlsx from 'xlsx';

const ShetLetterToNum = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 10,
  K: 11,
};

const SheetLetterToIndex = {
  D: 'I',
  E: 'II',
  F: 'III',
  G: 'IV',
  H: 'V',
  I: 'VI',
  J: 'VII',
  K: 'VIII',
};

@Injectable()
export class MstucaStatXlsxConverterService {
  private readonly _sheetNameDictionary: Map<string, string>;
  private readonly _rowNameDictionary: Map<string, string>;
  private subjectName: null | string = null;
  private teacherName: null | string = null;

  constructor() {
    this._sheetNameDictionary = new Map([
      ['Неделя', 'teacherAndSubject'],
      ['Развернуто', 'full'],
    ]);

    this._rowNameDictionary = new Map([
      ['__EMPTY', 'date'],
      ['__EMPTY_1', 'dayOfWeek'],
      ['I', 'firstSubject'],
      ['II', 'secondSubject'],
      ['III', 'thirdSubject'],
      ['IV', 'fourthSubject'],
      ['V', 'fifthSubject'],
      ['VI', 'sixthSubject'],
      ['VII', 'seventhSubject'],
    ]);
  }

  convertXlsxToJson(fullStatBuffer: Buffer): MstucaFullstatResult {
    const result = {};

    const workbook = xlsx.read(fullStatBuffer, { type: 'buffer' });

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonSheet = xlsx.utils.sheet_to_json(worksheet);

      const translatedSheetName = this._translateSheetName(sheetName);

      if (translatedSheetName !== 'full') {
        if (translatedSheetName === 'teacherAndSubject') {
          result[translatedSheetName] = [];
        } else {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          result['name'] = sheetName;
          // eslint-disable-next-line @typescript-eslint/dot-notation
          result['LR'] = [];
        }

        for (const [key, value] of Object.entries(worksheet)) {
          if (!isObject(value)) {
            continue;
          }

          this._translateWeekandOtherRow(key, value as { v: string });

          if (this.teacherName && this.subjectName) {
            if (translatedSheetName === 'teacherAndSubject') {
              const prevValue = result[translatedSheetName].find((v) => v.teacherName === this.teacherName && v.subjectName === this.subjectName);

              if (!prevValue) {
                result[translatedSheetName].push({ teacherName: this.teacherName, subjectName: this.subjectName });
              }
            } else {
              // eslint-disable-next-line @typescript-eslint/dot-notation
              const prevValue = result['LR'].find((v) => v.teacherName === this.teacherName && v.subjectName === this.subjectName);

              if (!prevValue) {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                result['LR'].push({ teacherName: this.teacherName, subjectName: this.subjectName });
              }
            }

            this.subjectName = null;
            this.teacherName = null;
          }
        }

        return;
      }

      if (translatedSheetName === 'full') {
        const mergedCellsMap = this._createMergedCellsMap(worksheet);

        result[translatedSheetName] = [];

        for (const row of jsonSheet) {
          if (!isObject(row)) {
            continue;
          }

          const translatedRow = this._translateRow(row, mergedCellsMap);

          if (translatedRow && Object.hasOwn(translatedRow, 'date')) {
            result[translatedSheetName].push(translatedRow);
          }
        }
      }
    });

    return result as MstucaFullstatResult;
  }

  private _translateSheetName(sheetName: string): string {
    const result = this._sheetNameDictionary.get(sheetName);

    return result ? result : sheetName;
  }

  private _translateRow(row: { [key: string | number | symbol]: any }, mergesCellMap?: Map<string, any>): object | null {
    let result: object | null = null;

    for (const key in row) {
      if (!row.hasOwnProperty(key)) {
        continue;
      }

      const translatedKeyName = this._rowNameDictionary.get(key);
      let value = row[key];

      if (this._isExcelDate(value)) {
        value = this._convertExcelDateToJSDate(value);
      }

      const mergedValue = mergesCellMap?.get(row[key]);

      if (mergedValue) {
        const [diff, addr, value] = mergedValue;

        new Array(diff).fill(1).forEach(() => {
          result ||= {};

          const translatedKeyName = this._rowNameDictionary.get(SheetLetterToIndex[addr]);

          if (translatedKeyName) {
            result[translatedKeyName] = value;
          }
        });
      }

      if (translatedKeyName) {
        result ||= {};
        result[translatedKeyName] = value;
      }
    }

    return result;
  }

  private _translateWeekandOtherRow(key: string, val: { v: string }): any {
    const letter = key[0];
    // const numAddr = +key.slice(1);
    const regex = /^(?!.*[.,;:!?])(?=[^А-Я]*[А-Я])(?=.*\s)^[а-яА-Я\s]+$/;

    if (letter === 'C' && regex.test(val.v)) {
      this.subjectName = val.v;
    }

    if (this.subjectName && val.v.toString().includes(',')) {
      this.teacherName = val.v;
    }
  }

  private _createMergedCellsMap(worksheet: xlsx.WorkSheet): Map<string, any> {
    const mergedCellsMap = new Map<string, any>();
    const merges = worksheet['!merges'] || [];

    merges.forEach((merge) => {
      const startCell = xlsx.utils.encode_cell({ r: merge.s.r, c: merge.s.c });
      const endCell = xlsx.utils.encode_cell({ r: merge.e.r, c: merge.e.c });

      const diff = ShetLetterToNum[endCell[0]] - ShetLetterToNum[startCell[0]];
      const date = worksheet[`A${startCell.slice(1)}`].v;
      const value = worksheet[startCell]?.v;

      mergedCellsMap.set(date, [diff, endCell[0], value]);
    });

    return mergedCellsMap;
  }

  private _isExcelDate(value: any): boolean {
    return isNumber(value) && value > 40000 && value < 60000;
  }

  private _convertExcelDateToJSDate(excelDate: number): string {
    const date = new Date(Date.UTC(0, 0, excelDate - 1));

    return date.toISOString();
  }
}

export interface MstucaSheduleFullStat {
  date: string;
  dayOfWeek: string;
  firstSubject?: string;
  secondSubject?: string;
  thirdSubject?: string;
  fourthSubject?: string;
  fifthSubject?: string;
  sixthSubject?: string;
  seventhSubject?: string;
}

export interface MstucaLRStat {
  teacherName: string;
  subjectName: string;
}

export interface MstucaTeacherNames {
  teacherName: string;
  subjectName: string;
}

export interface MstucaFullstatResult {
  full: MstucaSheduleFullStat[];
  name: string;
  LR: MstucaLRStat[];
  teacherAndSubject: MstucaTeacherNames[];
}
