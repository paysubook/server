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
    userId: string,
    expenseRecordBody: ExpenseRecordBody,
  ) {
    try {
      const createExpenseRecordQuery = new this.expenseRecordModel({
        userId: userId,
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

  async getExpenseRecordsWithinAMonth(userId: string, paymentMethod: string) {
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const expenseRecordsWithinAMonth =
        await this.expenseRecordModel.aggregate([
          {
            $match: {
              userId,
              paymentMethod,
              type: 'expense',
              createdAt: { $gte: oneMonthAgo },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: '$amount' },
            },
          },
        ]);

      if (!expenseRecordsWithinAMonth.length) {
        return {
          statusCode: 200,
          data: { totalAmount: 0 },
        };
      }

      return {
        statusCode: 200,
        data: { totalAmount: expenseRecordsWithinAMonth[0].totalAmount },
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '서버요청 실패.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
