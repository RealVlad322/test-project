import { Injectable } from '@nestjs/common';

import { CreateSheduleDto } from '../../dtos';
import { MstucaResponse } from '../mstuca-api/types';

@Injectable()
export class MstucaSheduleMapperService {
  getAllMappedShedule(fullStat: MstucaResponse[]): CreateSheduleDto[] {
    const result: CreateSheduleDto[] = [];
    fullStat.forEach((sub) => {
      const shedule: CreateSheduleDto = {
        date: sub.date,
        grade: 0,
        group: 1,
        discipline: '',
        faculty: '',
        groupName: '',
        index: 0,
        type: '',
        place: '',
        teacher: '',
        syncedAt: new Date().toISOString(),
      };
      shedule.discipline = sub.discipline;
      shedule.type = sub.kindOfWork;
      shedule.place = sub.auditorium;
      shedule.teacher = sub.lecturer;
      shedule.address = sub.building;
      shedule.groupName = sub.stream;
      shedule.grade = sub.stream_facultyoid;
      shedule.subgroup = sub.subGroup;

      if (sub.duration > 2) {
        shedule.index = sub.lessonNumberStart;
        result.push({ ...shedule });
      }

      shedule.index = sub.lessonNumberEnd;

      result.push({ ...shedule });
    });

    return result;
  }
}
