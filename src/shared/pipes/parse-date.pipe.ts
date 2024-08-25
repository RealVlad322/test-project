import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import isDate from 'lodash/isDate';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    // const val = parseInt(value, 10);

    if (isDate(value)) {
      throw new BadRequestException('Validation failed');
    }

    return value;
  }
}
