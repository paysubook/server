import { Body, Controller, Post, Res } from '@nestjs/common';
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
}
