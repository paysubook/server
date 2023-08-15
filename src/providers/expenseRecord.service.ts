import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
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

  private async getExpenseSumForDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.expenseRecordModel
      .aggregate([
        {
          $match: {
            userId,
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ])
      .exec();

    return result.length > 0 ? result[0].total : 0;
  }

  private getFirstDayOfMonth(year: number, month: number): Date {
    return dayjs().year(year).month(month).startOf('month').toDate();
  }

  private getLastDayOfMonth(year: number, month: number): Date {
    return dayjs().year(year).month(month).endOf('month').toDate();
  }

  async getExpenseComparisonThisMonth(userId: string) {
    const currentDate = dayjs();
    const thisMonth = currentDate.month();
    const lastMonth = thisMonth - 1;
    const currentYear = currentDate.year();

    const firstDayOfThisMonth = this.getFirstDayOfMonth(currentYear, thisMonth);
    const lastDayOfThisMonth = this.getLastDayOfMonth(currentYear, thisMonth);

    const firstDayOfLastMonth = this.getFirstDayOfMonth(currentYear, lastMonth);
    const lastDayOfLastMonth = this.getLastDayOfMonth(currentYear, lastMonth);

    try {
      const [lastMonthTotal, thisMonthTotal] = await Promise.all([
        this.getExpenseSumForDateRange(
          userId,
          firstDayOfLastMonth,
          lastDayOfLastMonth,
        ),
        this.getExpenseSumForDateRange(
          userId,
          firstDayOfThisMonth,
          lastDayOfThisMonth,
        ),
      ]);
      const variation =
        thisMonthTotal - lastMonthTotal > 0 ? 'increment' : 'decrement';
      const amount = Math.abs(thisMonthTotal - lastMonthTotal);

      return { statusCode: 200, data: { variation, amount } };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '서버요청 실패.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMonthlyCategoryExpenses(userId: string, month: string) {
    try {
      const currentDate = dayjs();
      const currentYear = currentDate.year();

      const firstDayOfThisMonth = this.getFirstDayOfMonth(
        currentYear,
        Number(month),
      );
      const lastDayOfThisMonth = this.getLastDayOfMonth(
        currentYear,
        Number(month),
      );

      const monthlyCategoryExpenses = await this.expenseRecordModel
        .aggregate([
          {
            $match: {
              userId,
              createdAt: {
                $gte: firstDayOfThisMonth,
                $lte: lastDayOfThisMonth,
              },
            },
          },
          {
            $group: {
              _id: '$category',
              total: { $sum: '$amount' },
            },
          },
        ])
        .exec();

      const result = monthlyCategoryExpenses
        .map((res) => {
          return {
            category: res._id,
            total: res.total,
          };
        })
        .sort((a, b) => b.total - a.total);

      return { statusCode: 200, data: { monthlyCategoryExpenses: result } };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '서버요청 실패.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  formatExpenseRecords(expenseRecords) {
    if (expenseRecords.length === 0) {
      return expenseRecords;
    }

    return expenseRecords.reduce((res, expenseRecord) => {
      if (!res[`${dayjs(expenseRecord.createdAt).date()}일`]) {
        res[`${dayjs(expenseRecord.createdAt).date()}일`] = [];
      }
      res[`${dayjs(expenseRecord.createdAt).date()}일`].push({
        id: expenseRecord._id,
        category: expenseRecord.category,
        description: expenseRecord.description,
        paymentMethod: expenseRecord.paymentMethod,
        amount: `${
          expenseRecord.type === 'income' ? '' : '-'
        }${expenseRecord.amount.toLocaleString()}`,
      });

      return res;
    }, {});
  }

  async getExpenseRecord({ userId, type = null, category = null }) {
    try {
      const currentDate = dayjs();
      const thisMonth = currentDate.month();
      const currentYear = currentDate.year();

      const firstDayOfThisMonth = this.getFirstDayOfMonth(
        currentYear,
        thisMonth,
      );
      const lastDayOfThisMonth = this.getLastDayOfMonth(currentYear, thisMonth);

      const expenseRecords = await this.expenseRecordModel
        .aggregate([
          {
            $match: {
              userId,
              createdAt: {
                $gte: firstDayOfThisMonth,
                $lte: lastDayOfThisMonth,
              },
              ...(!!type && { type }),
              ...(!!category && { category }),
            },
          },
        ])
        .exec();

      const result = this.formatExpenseRecords(expenseRecords);

      return { statusCode: 200, data: { expenseRecordList: result } };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '서버요청 실패.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
