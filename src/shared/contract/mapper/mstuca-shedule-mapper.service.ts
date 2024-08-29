import { Injectable } from '@nestjs/common';
import groupBy from 'lodash/groupBy';

import { CreateSheduleDto } from '../../dtos';
import { MstucaResponse } from '../mstuca-api/types';

@Injectable()
export class MstucaSheduleMapperService {
  getAllMappedShedule(fullStat: MstucaResponse[]): CreateSheduleDto[] {
    const result: CreateSheduleDto[] = [];

    const groupedStat = Object.entries(groupBy(fullStat, 'date'));

    groupedStat.forEach(([date, item]) => {
      item.forEach((sub) => {
        const shedule: CreateSheduleDto = {
          date,
          grade: 4,
          group: 1,
          discipline: '',
          faculty: '',
          groupName: '',
          index: 0,
          type: '',
          place: '',
          teacher: '',
        };
        shedule.discipline = sub.discipline;
        shedule.type = sub.kindOfWork;
        shedule.place = sub.auditorium;
        shedule.index = sub.lessonNumberStart;
        shedule.teacher = sub.lecturer;
        shedule.address = sub.building;
        shedule.groupName = sub.stream;

        result.push(shedule);
      });
    });

    return result;
  }
}
