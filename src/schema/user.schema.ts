import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenderCode } from 'src/types';

export type UserDocument = User & Document;

@Schema({
  timestamps: { createdAt: 'createdAt' },
  versionKey: false,
})
export class User {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop()
  password: string;

  // 히스토리에 포함된 키워드
  @Prop()
  name: string;

  @Prop()
  birthday: string;

  @Prop({ required: true, enum: GenderCode })
  genderCode: GenderCode;
}

export const UserSchema = SchemaFactory.createForClass(User);
