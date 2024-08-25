import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { SubjectDto } from '../dtos';

export type SheduleDocument = HydratedDocument<Shedule>;

@Schema()
export class Shedule {
  @Prop({ required: true })
  declare grade: number;

  @Prop({ required: true })
  declare faculty: string;

  @Prop({ required: true })
  declare name: string;

  @Prop({ required: true })
  declare group: number;

  @Prop()
  declare subgroup: number;

  @Prop({ required: true })
  declare date: string;

  @Prop()
  declare week: number;

  @Prop()
  declare subjects: SubjectDto[];
}

export const SheduleSchema = SchemaFactory.createForClass(Shedule);
