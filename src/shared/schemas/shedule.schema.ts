import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SheduleDocument = HydratedDocument<Shedule>;

@Schema()
export class Shedule {
  @Prop({ required: true })
  declare grade: number;

  @Prop({ required: true })
  declare faculty: string;

  @Prop({ required: true })
  declare groupName: string;

  @Prop({ required: true })
  declare group: number;

  @Prop()
  declare subgroup: number | string | null;

  @Prop({ required: true })
  declare date: string;

  @Prop()
  declare week: number;

  @Prop({ required: true })
  declare index: number;

  @Prop({ required: true })
  declare discipline: string;

  @Prop({ required: true })
  declare type: string;

  @Prop()
  declare place: string;

  @Prop({ required: true })
  declare teacher: string;

  @Prop()
  declare address: string;

  @Prop()
  declare syncedAt: string;
}

export const SheduleSchema = SchemaFactory.createForClass(Shedule);
