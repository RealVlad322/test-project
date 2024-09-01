import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SheduleDocument = HydratedDocument<Shedule>;

@Schema()
export class Shedule {
  @Prop({ required: true, type: String })
  declare grade: number;

  @Prop({ required: true, type: String })
  declare faculty: string;

  @Prop({ required: true, type: String })
  declare groupName: string;

  @Prop({ required: true, type: Number })
  declare group: number;

  @Prop({ type: Number, subtype: String })
  declare subgroup: number | string | null;

  @Prop({ required: true, type: String })
  declare date: string;

  @Prop({ type: Number })
  declare week: number;

  @Prop({ required: true, type: Number })
  declare index: number;

  @Prop({ required: true, type: String })
  declare discipline: string;

  @Prop({ required: true, type: String })
  declare type: string;

  @Prop({ type: String })
  declare place: string;

  @Prop({ required: true, type: String })
  declare teacher: string;

  @Prop({ type: String })
  declare address: string;

  @Prop({ type: String })
  declare syncedAt: string;
}

export const SheduleSchema = SchemaFactory.createForClass(Shedule);
