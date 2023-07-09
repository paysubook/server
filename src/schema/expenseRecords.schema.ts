import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentMethod, TransactionType } from 'src/types';

@Schema()
export class ExpenseRecord extends Document {
  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  description: string;
}

export const ExpenseRecordSchema = SchemaFactory.createForClass(ExpenseRecord);
