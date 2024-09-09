export interface MstucaResponse {
  auditorium: string;
  building: string;
  date: string;
  dayOfWeekString: string;
  discipline: string;
  kindOfWork: string;
  lecturer: string;
  lecturer_rank: string;
  lessonNumberEnd: number;
  lessonNumberStart: number;
  stream_facultyoid: number;
  stream: string;
  subGroup: string | null;
  subGroupOid: number | null;
  subgroup_facultyoid: number | null;
  parentschedule?: string | null;
  duration: number;
}
