import { Module } from '@nestjs/common';
import { TokenController } from 'src/controllers/token.controller';
import { TokenService } from 'src/providers/token.service';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
