import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ExpenseRecordService } from 'src/providers/expenseRecord.service';

@Controller('expense-record')
export class ExpenseRecordController {
  constructor(private expenseRecordService: ExpenseRecordService) {}

  @Post()
  async createExpenseRecord(@Res() res, @Body() expenseRecordBody) {
    const userId = res.locals.userId;
    const result = await this.expenseRecordService.createExpenseRecord(
      userId,
      expenseRecordBody,
    );

    return res.status(result.statusCode).json(result.data);
  }

  @Get('within-a-month')
  async getExpenseRecordsWithinAMonth(
    @Res() res,
    @Query('paymentMethod') paymentMethod: string,
  ) {
    const userId = res.locals.userId;
    const result =
      await this.expenseRecordService.getExpenseRecordsWithinAMonth(
        userId,
        paymentMethod,
      );

    return res.status(result.statusCode).json(result.data);
  }

  @Get('comparison')
  async getExpenseComparisonThisMonth(@Res() res) {
    const userId = res.locals.userId;
    const result =
      await this.expenseRecordService.getExpenseComparisonThisMonth(userId);

    return res.status(result.statusCode).json(result.data);
  }
}
