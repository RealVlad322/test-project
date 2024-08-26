import { Injectable } from '@nestjs/common';

import { MstucaFullstatResult } from '../../../apps/mstuca-shedule/mstuca-stat-xslx-converter.service';
import { CreateSheduleDto } from '../../dtos';

@Injectable()
export class MstucaSheduleMapperService {
  getAllMappedShedule(fullStat: MstucaFullstatResult): CreateSheduleDto[] {
    const result: CreateSheduleDto[] = [];
    const shedule: {
      name?: string;
      grade?: number;
      group?: number;
      faculty?: string;
      date?: string;
      subjects?: any[];
    } = {};

    const splitedName = fullStat.name.split(' ');
    const grade = splitedName[1].slice(0, 1);
    const group = splitedName[1].slice(2, 3);
    const faculty = 'ФПМиВТ';
    const subjectTeacherNameMap = new Map(
      fullStat.teacherAndSubject.map((i) => [i.teacherName.split(',')[0]?.trim(), i.subjectName]),
    );

    shedule.name = splitedName[0];
    shedule.grade = +grade;
    shedule.group = +group;
    shedule.faculty = faculty;
    shedule.subjects = [];
    fullStat.full.forEach((item) => {
      const date = item.date;
      shedule.subjects = [];
      shedule.date = date;

      const firstSubject = item.firstSubject;
      const secondSubject = item.secondSubject;
      const thirdSubject = item.thirdSubject;
      const fourthSubject = item.fourthSubject;
      const fifthSubject = item.fifthSubject;
      const sixthSubject = item.sixthSubject;
      const seventhSubject = item.seventhSubject;
      const subjects = [
        firstSubject,
        secondSubject,
        thirdSubject,
        fourthSubject,
        fifthSubject,
        sixthSubject,
        seventhSubject,
      ];

      subjects.forEach((sub, index) => {
        if (sub) {
          const subjectName = subjectTeacherNameMap.get(sub.split(',')[1]?.trim());
          const subject = {
            index: index + 1,
            name: subjectName,
            type: sub.split(',')[0]?.trim(),
            place: sub.split(',')[3]?.trim(),
            teacher: sub.split(',')[1]?.trim(),
          };
          shedule.subjects?.push(subject);
        }
      });

      result.push({ ...shedule } as CreateSheduleDto);
    });

    return result;
  }
}
