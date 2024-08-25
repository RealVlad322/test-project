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
    const subjectTeacherNameMap = new Map(fullStat.teacherAndSubject.map((i) => [i.teacherName.split(',')[0]?.trim(), i.subjectName]));
    // const subjectTeacherNameLRMap = new Map(fullStat.LR.map((i) => [i.teacherName.split(',')[0]?.trim(), i.subjectName]));

    shedule.name = splitedName[0];
    shedule.grade = +grade;
    shedule.group = +group;
    shedule.faculty = faculty;
    shedule.subjects = [];
    fullStat.full.forEach((item) => {
      shedule.subjects = [];

      const date = item.date;
      const firstSubject = item.firstSubject;
      const secondSubject = item.secondSubject;
      const thirdSubject = item.thirdSubject;
      const fourthSubject = item.fourthSubject;
      const fifthSubject = item.fifthSubject;
      const sixthSubject = item.sixthSubject;
      const seventhSubject = item.seventhSubject;
      shedule.date = date;

      if (firstSubject) {
        const subjectName = subjectTeacherNameMap.get(firstSubject.split(',')[1]?.trim());
        const subject = {
          index: 1,
          name: subjectName,
          type: firstSubject.split(',')[0]?.trim(),
          place: firstSubject.split(',')[3]?.trim(),
          teacher: firstSubject.split(',')[1]?.trim(),
        };
        shedule.subjects?.push(subject);
      }

      if (secondSubject) {
        const subjectName = subjectTeacherNameMap.get(secondSubject.split(',')[1]?.trim());
        const subject = {
          index: 2,
          name: subjectName,
          type: secondSubject.split(',')[0]?.trim(),
          place: secondSubject.split(',')[3]?.trim(),
          teacher: secondSubject.split(',')[1]?.trim(),
        };
        shedule.subjects?.push(subject);
      }

      if (thirdSubject) {
        const subjectName = subjectTeacherNameMap.get(thirdSubject.split(',')[1]?.trim());
        const subject = {
          index: 3,
          name: subjectName,
          type: thirdSubject.split(',')[0]?.trim(),
          place: thirdSubject.split(',')[3]?.trim(),
          teacher: thirdSubject.split(',')[1]?.trim(),
        };
        shedule.subjects?.push(subject);
      }

      if (fourthSubject) {
        const subjectName = subjectTeacherNameMap.get(fourthSubject.split(',')[1]?.trim());
        const subject = {
          index: 4,
          name: subjectName,
          type: fourthSubject.split(',')[0]?.trim(),
          place: fourthSubject.split(',')[3]?.trim(),
          teacher: fourthSubject.split(',')[1]?.trim(),
        };
        shedule.subjects?.push(subject);
      }

      if (fifthSubject) {
        const subjectName = subjectTeacherNameMap.get(fifthSubject.split(',')[1]?.trim());
        const subject = {
          index: 5,
          name: subjectName,
          type: fifthSubject.split(',')[0]?.trim(),
          place: fifthSubject.split(',')[3]?.trim(),
          teacher: fifthSubject.split(',')[1]?.trim(),
        };
        shedule.subjects?.push(subject);
      }

      if (sixthSubject) {
        const subjectName = subjectTeacherNameMap.get(sixthSubject.split(',')[1]?.trim());
        const subject = {
          index: 6,
          name: subjectName,
          type: sixthSubject.split(',')[0]?.trim(),
          place: sixthSubject.split(',')[3]?.trim(),
          teacher: sixthSubject.split(',')[1]?.trim(),
        };
        shedule.subjects?.push(subject);
      }

      if (seventhSubject) {
        const subjectName = subjectTeacherNameMap.get(seventhSubject.split(',')[1]?.trim());
        const subject = {
          index: 7,
          name: subjectName,
          type: seventhSubject.split(',')[0]?.trim(),
          place: seventhSubject.split(',')[3]?.trim(),
          teacher: seventhSubject.split(',')[1]?.trim(),
        };
        shedule.subjects?.push(subject);
      }

      result.push({ ...shedule } as CreateSheduleDto);
    });

    return result;
  }
}
