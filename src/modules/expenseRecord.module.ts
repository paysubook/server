import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseRecordController } from 'src/controllers/expenseRecord.controller';
import { ExpenseRecordService } from 'src/providers/expenseRecord.service';
import {
  ExpenseRecord,
  ExpenseRecordSchema,
} from 'src/schema/expenseRecords.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpenseRecord.name, schema: ExpenseRecordSchema },
    ]),
  ],
  controllers: [ExpenseRecordController],
  providers: [ExpenseRecordService],
})
export class ExpenseRecordModule {}
