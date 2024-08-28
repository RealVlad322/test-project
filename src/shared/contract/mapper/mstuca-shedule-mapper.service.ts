import { Injectable } from '@nestjs/common';
import groupBy from 'lodash/groupBy';

import { CreateSheduleDto, SubjectDto } from '../../dtos';
import { MstucaResponse } from '../mstuca-api/types';

@Injectable()
export class MstucaSheduleMapperService {
  getAllMappedShedule(fullStat: MstucaResponse[]): CreateSheduleDto[] {
    const result: CreateSheduleDto[] = [];

    const groupedStat = Object.entries(groupBy(fullStat, 'date'));

    groupedStat.forEach(([date, item]) => {
      const shedule: {
        name?: string;
        grade?: number;
        group?: number;
        faculty?: string;
        date?: string;
        subjects?: any[];
      } = { date, grade: 4, group: 1 };

      shedule.subjects = item.map<SubjectDto>((sub) => {
        const name = sub.discipline;
        const type = sub.kindOfWork;
        const place = sub.auditorium;
        const index = sub.lessonNumberStart;
        const teacher = sub.lecturer;
        const address = sub.building;
        const sheduleName = sub.stream;

        shedule.name ||= sheduleName;

        return {
          index,
          name,
          type,
          place,
          teacher,
          address,
        };
      });

      // @ts-ignore
      result.push(shedule);
    });

    return result;
  }
}
