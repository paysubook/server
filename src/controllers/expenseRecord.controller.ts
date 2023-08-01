import { Body, Controller, Post, Res } from '@nestjs/common';
import { ExpenseRecordService } from 'src/providers/expenseRecord.service';

@Controller('expense-record')
export class ExpenseRecordController {
  constructor(private expenseRecordService: ExpenseRecordService) {}

  @Post()
  async createExpenseRecord(@Res() res, @Body() expenseRecordBody) {
    const email = res.locals.email;
    const result = await this.expenseRecordService.createExpenseRecord(
      email,
      expenseRecordBody,
    );

    return res.status(result.statusCode).json(result.data);
  }
}
