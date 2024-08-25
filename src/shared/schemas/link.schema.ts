import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LinkDocument = HydratedDocument<Link>;

@Schema()
export class Link {
  @Prop({ required: true })
  declare id: string;

  @Prop({ required: true })
  declare hash: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
