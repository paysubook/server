import { Controller, Get } from '@nestjs/common';
import { TestService } from 'src/providers/test.service';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  test() {
    const result = this.testService.test();

    return result;
  }
}
