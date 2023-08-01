import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentMethod, TransactionType } from 'src/types';

export type ExpenseRecordDocument = ExpenseRecord & Document;

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class ExpenseRecord extends Document {
  @Prop()
  userId: string;

  @Prop({ required: true })
  type: TransactionType;

  @Prop({ required: true })
  paymentMethod: PaymentMethod;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  description: string;
}

export const ExpenseRecordSchema = SchemaFactory.createForClass(ExpenseRecord);
