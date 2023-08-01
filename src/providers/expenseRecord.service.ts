import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ExpenseRecord,
  ExpenseRecordDocument,
} from 'src/schema/expenseRecords.schema';
import { ExpenseRecordBody } from 'src/types';

@Injectable()
export class ExpenseRecordService {
  constructor(
    @InjectModel(ExpenseRecord.name)
    private expenseRecordModel: Model<ExpenseRecordDocument>,
  ) {}

  async createExpenseRecord(
    email: string,
    expenseRecordBody: ExpenseRecordBody,
  ) {
    try {
      const createExpenseRecordQuery = new this.expenseRecordModel({
        userId: email,
        ...expenseRecordBody,
      });
      await createExpenseRecordQuery.save();

      return { statusCode: 201, data: { isPosted: true } };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '서버요청 실패.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
