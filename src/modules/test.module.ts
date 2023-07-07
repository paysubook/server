import { Module } from '@nestjs/common';
import { TestController } from 'src/controllers/test.controller';
import { TestService } from 'src/providers/test.service';

@Module({
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
